/* Optimizador de itinerario.
   1. Reparte las paradas entre los días (por zonas si duermes en el mismo sitio,
      o en línea de avance si es una ruta de paso).
   2. Ordena cada día simulando el horario completo: no solo busca el camino más
      corto, también evita llegar a un mirador a mediodía o a un museo cerrado.  */

import { simulate, dayOptions } from "./schedule.js";
import { kmeans, haversine, centroid } from "../geo.js";
import { resolvePlace } from "../store.js";

/* ---------- orden dentro de un día ---------- */

function nearestNeighbor(places, startPoint) {
  if (places.length < 2) return [...places];
  const rest = [...places];
  const order = [];
  let current = startPoint;
  if (!current) {
    current = rest.shift();
    order.push(current);
  }
  while (rest.length) {
    let bi = 0;
    let bd = Infinity;
    rest.forEach((p, i) => {
      const d = haversine(current, p);
      if (d < bd) { bd = d; bi = i; }
    });
    const next = rest.splice(bi, 1)[0];
    order.push(next);
    current = next;
  }
  return order;
}

/* Coloca las paradas con hora fija en orden cronológico, moviendo lo mínimo. */
function respectFixed(order) {
  const fixed = order.filter((p) => p.fixedStartMin != null).sort((a, b) => a.fixedStartMin - b.fixedStartMin);
  if (fixed.length < 1) return order;
  const free = order.filter((p) => p.fixedStartMin == null);
  const result = [];
  const slots = fixed.length + 1;
  // Reparte los libres entre las paradas fijas manteniendo su orden relativo.
  const perSlot = Math.ceil(free.length / slots) || 0;
  let f = 0;
  for (let s = 0; s < slots; s++) {
    for (let k = 0; k < perSlot && f < free.length; k++) result.push(free[f++]);
    if (fixed[s]) result.push(fixed[s]);
  }
  while (f < free.length) result.push(free[f++]);
  return result;
}

const score = (places, opts) => simulate(places, opts).penalty;

/* Búsqueda local: 2-opt (invertir tramos, mata las idas y vueltas) + or-opt
   (mover una parada de sitio). Se evalúa el día completo, con horarios. */
function improve(places, opts, { rounds = 60 } = {}) {
  if (places.length < 3) return places;
  let best = [...places];
  let bestScore = score(best, opts);

  for (let round = 0; round < rounds; round++) {
    let improved = false;

    for (let i = 0; i < best.length - 1; i++) {
      for (let j = i + 1; j < best.length; j++) {
        const cand = [...best.slice(0, i), ...best.slice(i, j + 1).reverse(), ...best.slice(j + 1)];
        const s = score(cand, opts);
        if (s < bestScore - 0.5) { best = cand; bestScore = s; improved = true; }
      }
    }

    for (let i = 0; i < best.length; i++) {
      for (let j = 0; j < best.length; j++) {
        if (i === j) continue;
        const cand = [...best];
        const [item] = cand.splice(i, 1);
        cand.splice(j, 0, item);
        const s = score(cand, opts);
        if (s < bestScore - 0.5) { best = cand; bestScore = s; improved = true; }
      }
    }

    if (!improved) break;
  }
  return best;
}

export function orderDay(places, opts) {
  if (places.length < 2) return [...places];
  const seeded = respectFixed(nearestNeighbor(places, opts.startPoint));
  return improve(seeded, opts);
}

/* ---------- reparto entre días ---------- */

/* Minutos que cabe llenar en un día, descontando un margen de conducción. */
function capacityOf(state, index) {
  const o = dayOptions(state, index);
  const day = state.days[index] || {};
  const raw = o.endMin - o.startMin;
  if (day.kind === "libre") return 0;
  if (day.kind === "viaje") return Math.round(raw * 0.45);
  return raw;
}

/* Coste en minutos de meter un lugar en un día (visita + traslado aproximado). */
function weightOf(place) {
  return place.dwell + 35;
}

/* Reparto en línea de avance: un solo recorrido global cortado por capacidad. */
function splitSequential(places, state, startPoint) {
  const n = state.days.length;
  const order = respectFixed(nearestNeighbor(places, startPoint));
  const buckets = Array.from({ length: n }, () => []);
  const caps = Array.from({ length: n }, (_, i) => capacityOf(state, i));
  let d = 0;
  let used = 0;
  for (const p of order) {
    const w = weightOf(p);
    while (d < n - 1 && (caps[d] === 0 || used + w > caps[d])) { d++; used = 0; }
    buckets[d].push(p);
    used += w;
  }
  return buckets;
}

/* Reparto por zonas: agrupa geográficamente y asigna cada grupo a un día,
   empezando por el más cercano a la base. */
function splitByZone(places, state, startPoint) {
  const n = state.days.length;
  const usable = Array.from({ length: n }, (_, i) => capacityOf(state, i)).map((c, i) => ({ i, c }))
    .filter((d) => d.c > 0);
  if (!usable.length) return Array.from({ length: n }, (_, i) => (i === 0 ? places : []));

  const k = Math.min(usable.length, places.length);
  const assign = kmeans(places, k);
  const groups = Array.from({ length: k }, () => []);
  places.forEach((p, i) => groups[assign[i]].push(p));

  // Grupos ordenados por cercanía a la base: lo de al lado, primero.
  const anchor = startPoint || centroid(places);
  const sorted = groups
    .filter((g) => g.length)
    .map((g) => ({ g, d: haversine(anchor, centroid(g)) }))
    .sort((a, b) => a.d - b.d)
    .map((x) => x.g);

  const buckets = Array.from({ length: n }, () => []);
  sorted.forEach((group, idx) => {
    const target = usable[Math.min(idx, usable.length - 1)].i;
    buckets[target].push(...group);
  });

  return rebalance(buckets, state);
}

/* Si un día se pasa de minutos y el siguiente tiene hueco, se pasa la última parada. */
function rebalance(buckets, state) {
  const caps = buckets.map((_, i) => capacityOf(state, i));
  const load = (b) => b.reduce((s, p) => s + weightOf(p), 0);
  for (let pass = 0; pass < 4; pass++) {
    let moved = false;
    for (let i = 0; i < buckets.length; i++) {
      while (load(buckets[i]) > caps[i] && buckets[i].length > 1) {
        const target = buckets.findIndex((b, j) => j !== i && caps[j] > 0 && load(b) + weightOf(buckets[i].at(-1)) <= caps[j]);
        if (target < 0) break;
        buckets[target].push(buckets[i].pop());
        moved = true;
      }
    }
    if (!moved) break;
  }
  return buckets;
}

/* Reparación entre días: mueve una parada de día si eso mejora el conjunto.
   Es lo que saca de un lunes el museo que cierra los lunes, o alivia el día
   que se había quedado demasiado cargado. */
function crossDayRepair(buckets, state, { rounds = 3, maxStops = 32 } = {}) {
  const total = buckets.reduce((s, b) => s + b.length, 0);
  if (total < 2 || total > maxStops || buckets.length < 2) {
    return buckets.map((g, i) => (g.length ? orderDay(g, dayOptions(state, i)) : []));
  }

  const caps = buckets.map((_, i) => capacityOf(state, i));
  const order = (g, i) => (g.length ? orderDay(g, dayOptions(state, i)) : []);
  const penaltyOf = (g, i) => (g.length ? simulate(g, dayOptions(state, i)).penalty : 0);

  let current = buckets.map(order);
  let scores = current.map(penaltyOf);
  let best = scores.reduce((a, b) => a + b, 0);

  for (let round = 0; round < rounds; round++) {
    let improved = false;

    for (let i = 0; i < current.length; i++) {
      for (let k = 0; k < current[i].length; k++) {
        const moving = current[i][k];
        for (let j = 0; j < current.length; j++) {
          if (i === j || caps[j] === 0) continue;
          const from = current[i].filter((_, idx) => idx !== k);
          const to = [...current[j], moving];
          const orderedFrom = order(from, i);
          const orderedTo = order(to, j);
          const candidate = best - scores[i] - scores[j] + penaltyOf(orderedFrom, i) + penaltyOf(orderedTo, j);
          if (candidate < best - 5) {
            current[i] = orderedFrom;
            current[j] = orderedTo;
            scores[i] = penaltyOf(orderedFrom, i);
            scores[j] = penaltyOf(orderedTo, j);
            best = scores.reduce((a, b) => a + b, 0);
            improved = true;
            k = -1;            // la lista del día i cambió: se sigue en la ronda siguiente
            break;
          }
        }
        if (k === -1) break;
      }
    }

    if (!improved) break;
  }

  return current;
}

/* ---------- API pública ---------- */

/**
 * Calcula un itinerario completo.
 * @returns {{ days: string[][], report: object }}
 */
export function optimize(state) {
  const ids = [...state.plan.days.flat(), ...state.plan.unassigned];
  const places = ids.map(resolvePlace).filter((p) => p && isFinite(p.lat) && isFinite(p.lng));
  const startPoint = state.trip.base || null;

  if (!places.length) {
    return { days: state.days.map(() => []), report: { stops: 0, days: 0, driveMin: 0, km: 0 } };
  }

  const buckets = state.trip.mode === "ruta"
    ? splitSequential(places, state, startPoint)
    : splitByZone(places, state, startPoint);

  const ordered = crossDayRepair(buckets, state);

  // En ruta de paso, el día siguiente arranca donde terminó el anterior.
  if (state.trip.mode === "ruta") {
    let prevEnd = startPoint;
    ordered.forEach((group, i) => {
      if (!group.length) return;
      const opts = { ...dayOptions(state, i), startPoint: prevEnd, endPoint: null };
      ordered[i] = orderDay(group, opts);
      prevEnd = ordered[i].at(-1);
    });
  }

  const report = { stops: places.length, days: 0, driveMin: 0, km: 0, warnings: 0 };
  ordered.forEach((group, i) => {
    if (!group.length) return;
    const sim = simulate(group, dayOptions(state, i));
    report.days++;
    report.driveMin += sim.totals.driveMin;
    report.km += sim.totals.km;
    report.warnings += sim.items.reduce((s, it) => s + it.warnings.length, 0);
  });
  report.km = Math.round(report.km * 10) / 10;

  return { days: ordered.map((g) => g.map((p) => p.id)), report };
}

/* Simulación de todos los días tal como está el plan ahora (sin reordenar nada). */
export function buildItinerary(state) {
  return state.plan.days.map((ids, i) => {
    const places = ids.map(resolvePlace).filter(Boolean);
    const sim = simulate(places, dayOptions(state, i));
    return { index: i, day: state.days[i], ...sim };
  });
}
