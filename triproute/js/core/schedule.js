/* Construye la línea de tiempo de un día: a qué hora llegas, cuánto conduces,
   qué avisos tiene cada parada y cuánto cuesta. La misma función sirve para
   pintar el itinerario y para puntuar un orden dentro del optimizador. */

import { leg as legOf } from "../services/travel.js";
import { WINDOWS, PACES } from "../data/catalog.js";
import { toMinutes, weekday } from "../util.js";

const LUNCH_FROM = 11 * 60 + 45;   // antes de esto nadie quiere comer
const LUNCH_TO = 15 * 60;          // más tarde, ya se comió por el camino
const LUNCH_MIN = 60;

function openWindow(place) {
  if (!place.hours) return null;
  const from = toMinutes(place.hours.from);
  const to = toMinutes(place.hours.to);
  if (from == null || to == null) return null;
  return { from, to };
}

function prefWindow(place) {
  return WINDOWS[place.best] || WINDOWS.cualquiera;
}

/* Penalización por visitar algo fuera de su mejor franja: minutos de desfase. */
function windowPenalty(place, arrive, leaveAt) {
  const w = prefWindow(place);
  if (w === WINDOWS.cualquiera) return 0;
  if (leaveAt <= w.from) return (w.from - leaveAt) * 0.6;
  if (arrive >= w.to) return (arrive - w.to) * 0.6;
  return 0;
}

/**
 * Simula un día.
 * @param {Array} places  lugares ya resueltos (resolvePlace), en el orden a evaluar
 * @param {Object} opts   { startPoint, endPoint, startMin, endMin, buffer, lunch, date, legFn }
 */
export function simulate(places, opts = {}) {
  const {
    startPoint = null,
    endPoint = null,
    startMin = 8 * 60 + 30,
    endMin = 19 * 60,
    buffer = 15,
    lunch = true,
    date = null,
    legFn = legOf
  } = opts;

  const dow = date ? weekday(date) : null;
  const items = [];
  let cursor = startMin;
  let prev = startPoint;
  let totalKm = 0;
  let driveMin = 0;
  let visitMin = 0;
  let cost = 0;
  let penalty = 0;
  let lunchBreak = null;
  let lunchDone = !lunch;
  let lastFixed = -1;
  const warnings = [];

  places.forEach((place, i) => {
    const tr = prev ? legFn(prev, place) : { km: 0, min: 0, source: "estimado" };
    cursor += tr.min;
    driveMin += tr.min;
    totalKm += tr.km;
    penalty += tr.min;

    /* Parada para comer. Si la visita en la que caes es larga y pilla la hora de
       comer, se asume que comes ahí (en RD casi toda playa tiene su comedor) y no
       se reserva una hora aparte. */
    let mealHere = false;
    if (!lunchDone && cursor >= LUNCH_FROM && cursor <= LUNCH_TO) {
      const coversLunch = place.dwell >= 90 && cursor <= 13 * 60 + 15;
      if (place.type === "comida" || coversLunch) {
        lunchDone = true;
        mealHere = true;
      } else {
        lunchBreak = { at: cursor, min: LUNCH_MIN, afterIndex: i - 1 };
        cursor += LUNCH_MIN;
        lunchDone = true;
      }
    }

    const w = [];
    let wait = 0;

    // Hora fija pedida por el usuario (reserva, tour, barco...).
    if (place.fixedStartMin != null) {
      if (place.fixedStartMin < lastFixed) {
        w.push("Choca con otra hora fija anterior");
        penalty += 240;
      }
      lastFixed = place.fixedStartMin;
      if (cursor <= place.fixedStartMin) {
        wait += place.fixedStartMin - cursor;
        cursor = place.fixedStartMin;
      } else {
        const late = cursor - place.fixedStartMin;
        w.push(`Llegas ${late} min tarde para la hora fijada (${place.fixedStart})`);
        penalty += 120 + late * 3;
      }
    }

    // Horario de apertura.
    const open = openWindow(place);
    if (open) {
      if (cursor < open.from) {
        const espera = open.from - cursor;
        wait += espera;
        cursor = open.from;
        penalty += espera * 0.3;      // esperar a que abran también molesta
      }
      if (cursor >= open.to) {
        w.push(`Ya está cerrado (cierra a las ${place.hours.to})`);
        penalty += 400;
      } else if (cursor + place.dwell > open.to) {
        w.push(`Cierra a las ${place.hours.to}: te queda poco tiempo`);
        penalty += 120;
      }
    }

    // Cierres semanales conocidos.
    if (dow === 1 && (place.tags || []).includes("cierra-lunes")) {
      w.push("Cierra los lunes");
      penalty += 500;
    }
    if (dow != null && (place.tags || []).includes("lunes-viernes") && ![1, 5].includes(dow)) {
      w.push("Solo abre lunes y viernes");
      penalty += 500;
    }

    const arrive = cursor;
    const leaveAt = arrive + place.dwell;
    penalty += windowPenalty(place, arrive, leaveAt);

    if (leaveAt > endMin) {
      w.push("Se sale de la hora de fin del día");
      penalty += (leaveAt - endMin) * 2.5;
    }

    items.push({
      id: place.id,
      place,
      travel: tr,
      wait,
      arrive,
      leave: leaveAt,
      mealHere,
      warnings: w
    });

    visitMin += place.dwell;
    cost += (Number(place.cost) || 0);
    cursor = leaveAt + buffer;
    prev = place;
  });

  // Vuelta a la base al final del día.
  let back = null;
  if (endPoint && prev && places.length) {
    back = legFn(prev, endPoint);
    driveMin += back.min;
    totalKm += back.km;
    penalty += back.min;
    cursor += back.min - buffer;
  }

  if (cursor > endMin) warnings.push("El día termina más tarde de lo previsto");

  return {
    items,
    lunchBreak,
    back,
    totals: {
      km: Math.round(totalKm * 10) / 10,
      driveMin,
      visitMin,
      cost,
      stops: places.length
    },
    startMin,
    endMin,
    finishMin: cursor,
    penalty,
    warnings
  };
}

/* Horario efectivo de un día concreto (el del viaje salvo que el día lo sobrescriba). */
export function dayWindow(state, index) {
  const day = state.days[index] || {};
  const startMin = toMinutes(day.dayStart || state.trip.dayStart) ?? 8 * 60 + 30;
  const endMin = toMinutes(day.dayEnd || state.trip.dayEnd) ?? 19 * 60;
  return { startMin, endMin: Math.max(startMin + 60, endMin) };
}

export function paceOf(state) {
  return PACES[state.trip.pace] || PACES.normal;
}

/* Opciones de simulación para el día `index` del estado actual. */
export function dayOptions(state, index) {
  const { startMin, endMin } = dayWindow(state, index);
  const base = state.trip.base;
  const isLast = index === state.days.length - 1;
  const mode = state.trip.mode;
  return {
    startMin,
    endMin,
    buffer: paceOf(state).buffer,
    lunch: !!state.trip.lunch,
    date: state.days[index]?.date || null,
    startPoint: base || null,
    // Con base fija se vuelve a dormir al mismo sitio todos los días.
    endPoint: base && (mode === "base" || isLast) ? base : null
  };
}
