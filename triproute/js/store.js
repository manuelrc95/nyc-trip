/* Estado único de la aplicación, con persistencia en localStorage y suscripción
   para que las vistas se repinten solas. Todo cambio pasa por update(). */

import { PLACES } from "./data/places/index.js";
import { typeInfo, PACES } from "./data/catalog.js";
import { addDaysISO, daysBetween, todayISO, uid, toMinutes } from "./util.js";

const KEY = "triproute:v1";
const LEGACY = { trip: "triproute_trip", itinerary: "triproute_itinerary", tips: "triproute_tips" };

function blank() {
  return {
    v: 1,
    trip: {
      destination: "",
      startDate: todayISO(),
      endDate: addDaysISO(todayISO(), 2),
      people: 2,
      style: "mixto",
      currency: "USD",
      budgetTotal: 800,
      pace: "normal",
      mode: "base",
      dayStart: "08:30",
      dayEnd: "19:00",
      lunch: true,
      base: null              // { name, lat, lng } hotel o punto de salida
    },
    days: [],                 // [{ date, note, dayStart, dayEnd, kind }]
    picked: {},               // placeId -> { dwell, fixedStart, note, cost, done }
    plan: { days: [], unassigned: [], manual: false, generatedAt: null },
    customPlaces: [],
    budget: { overrides: {}, assumptions: {} },
    settings: {
      mapProvider: "leaflet",
      googleKey: "",
      googleMapId: "",
      usePlaces: false,
      useRoutes: false
    },
    updatedAt: null
  };
}

function deepMerge(base, patch) {
  if (!patch || typeof patch !== "object") return base;
  const out = Array.isArray(base) ? [...base] : { ...base };
  for (const [k, v] of Object.entries(patch)) {
    if (v && typeof v === "object" && !Array.isArray(v) && base && typeof base[k] === "object" && !Array.isArray(base[k])) {
      out[k] = deepMerge(base[k], v);
    } else if (v !== undefined) {
      out[k] = v;
    }
  }
  return out;
}

function load() {
  let saved = null;
  try { saved = JSON.parse(localStorage.getItem(KEY) || "null"); } catch { saved = null; }
  const state = saved ? deepMerge(blank(), saved) : importLegacy();
  syncDays(state);
  return state;
}

/* Si el usuario viene del prototipo anterior, se recupera lo que tenía guardado. */
function importLegacy() {
  const state = blank();
  try {
    const oldTrip = JSON.parse(localStorage.getItem(LEGACY.trip) || "null");
    if (oldTrip) {
      state.trip.destination = oldTrip.dest || "";
      state.trip.startDate = oldTrip.dateStart || state.trip.startDate;
      state.trip.endDate = oldTrip.dateEnd || state.trip.endDate;
      state.trip.people = Number(oldTrip.people) || 2;
      state.trip.budgetTotal = Number(oldTrip.budget) || 800;
      const style = String(oldTrip.type || "").toLowerCase();
      if (style) state.trip.style = style.normalize("NFD").replace(/[̀-ͯ]/g, "");
    }
    const oldIt = JSON.parse(localStorage.getItem(LEGACY.itinerary) || "null");
    const oldTips = JSON.parse(localStorage.getItem(LEGACY.tips) || "null") || {};
    if (Array.isArray(oldIt)) {
      for (const p of oldIt) {
        const match = PLACES.find((x) => x.name === p.name) || null;
        const id = match ? match.id : `legacy-${p.id}`;
        if (!match) {
          state.customPlaces.push({
            id, name: p.name, province: p.province || "Personalizado", town: "",
            lat: p.lat, lng: p.lng, type: p.type && p.type !== "personalizado" ? p.type : "personalizado",
            dwell: p.time || 60, price: p.price || 0, hours: null, best: "cualquiera",
            desc: p.desc || "", tip: p.tip || "", tags: [], source: "usuario"
          });
        }
        state.picked[id] = { dwell: null, fixedStart: null, note: oldTips[p.id] || "", cost: null, done: false };
      }
    }
    if (Object.keys(state.picked).length || state.trip.destination) {
      state._importedLegacy = true;
    }
  } catch { /* si el formato antiguo está roto, se empieza limpio */ }
  return state;
}

/* ---------- días ---------- */

export function tripDayCount(trip) {
  const n = daysBetween(trip.startDate, trip.endDate);
  if (n == null) return 1;
  return Math.max(1, Math.min(30, n + 1));
}

/* Reconstruye el array de días a partir de las fechas, conservando notas y horarios
   que el usuario haya tocado, y ajusta el tamaño del plan. */
export function syncDays(state) {
  const count = tripDayCount(state.trip);
  const byDate = new Map(state.days.map((d) => [d.date, d]));
  const days = [];
  for (let i = 0; i < count; i++) {
    const date = addDaysISO(state.trip.startDate, i);
    const prev = byDate.get(date) || {};
    days.push({
      date,
      note: prev.note || "",
      dayStart: prev.dayStart || null,   // null = hereda el del viaje
      dayEnd: prev.dayEnd || null,
      kind: prev.kind || "normal"        // normal | viaje | libre
    });
  }
  state.days = days;

  const plan = state.plan;
  plan.days = plan.days || [];
  if (plan.days.length > count) {
    // Los días que desaparecen devuelven sus paradas a la bandeja.
    const extra = plan.days.slice(count).flat();
    plan.days = plan.days.slice(0, count);
    plan.unassigned = [...new Set([...(plan.unassigned || []), ...extra])];
  }
  while (plan.days.length < count) plan.days.push([]);
  plan.unassigned = plan.unassigned || [];

  // Coherencia: todo lo elegido está exactamente una vez en el plan.
  const picked = new Set(Object.keys(state.picked));
  const seen = new Set();
  plan.days = plan.days.map((day) =>
    day.filter((id) => {
      if (!picked.has(id) || seen.has(id)) return false;
      seen.add(id);
      return true;
    })
  );
  plan.unassigned = plan.unassigned.filter((id) => {
    if (!picked.has(id) || seen.has(id)) return false;
    seen.add(id);
    return true;
  });
  for (const id of picked) if (!seen.has(id)) plan.unassigned.push(id);
  return state;
}

/* ---------- estado y suscripción ---------- */

const state = load();
const listeners = new Set();

export function getState() { return state; }

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

let silent = 0;

export function update(mutator, { persist = true, notify = true } = {}) {
  mutator(state);
  syncDays(state);
  state.updatedAt = Date.now();
  if (persist) save();
  if (notify && !silent) listeners.forEach((fn) => fn(state));
  return state;
}

export function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch (e) {
    console.warn("[TripRoute] no se pudo guardar (¿modo privado o almacenamiento lleno?)", e);
  }
}

export function notifyAll() { listeners.forEach((fn) => fn(state)); }

/* ---------- registro de lugares ---------- */

export function allPlaces() {
  return [...PLACES, ...state.customPlaces];
}

let indexCache = null;
let indexStamp = null;

export function placeIndex() {
  if (!indexCache || indexStamp !== state.updatedAt) {
    indexCache = new Map(allPlaces().map((p) => [p.id, p]));
    indexStamp = state.updatedAt;
  }
  return indexCache;
}

export function getPlace(id) {
  return placeIndex().get(id) || null;
}

/* Lugar + ajustes del usuario, ya resueltos: es lo que consume el planificador. */
export function resolvePlace(id) {
  const place = getPlace(id);
  if (!place) return null;
  const over = state.picked[id] || {};
  const factor = (PACES[state.trip.pace] || PACES.normal).dwellFactor;
  const baseDwell = over.dwell ?? place.dwell ?? typeInfo(place.type).dwell;
  return {
    ...place,
    dwell: Math.max(10, Math.round(baseDwell * (over.dwell ? 1 : factor))),
    rawDwell: baseDwell,
    fixedStart: over.fixedStart || null,
    fixedStartMin: toMinutes(over.fixedStart) ?? null,
    note: over.note || "",
    cost: over.cost ?? place.price ?? 0,
    done: !!over.done,
    best: over.best || place.best || typeInfo(place.type).best
  };
}

export function isPicked(id) {
  return Object.prototype.hasOwnProperty.call(state.picked, id);
}

/* ---------- acciones ---------- */

export function pickPlace(id) {
  if (isPicked(id)) return;
  update((s) => {
    s.picked[id] = { dwell: null, fixedStart: null, note: "", cost: null, done: false };
    s.plan.unassigned.push(id);
  });
}

export function unpickPlace(id) {
  update((s) => {
    delete s.picked[id];
    s.plan.days = s.plan.days.map((d) => d.filter((x) => x !== id));
    s.plan.unassigned = s.plan.unassigned.filter((x) => x !== id);
  });
}

export function setPickField(id, field, value) {
  update((s) => {
    if (!s.picked[id]) return;
    s.picked[id][field] = value;
    if (field !== "done") s.plan.manual = true;
  });
}

export function addCustomPlace(data) {
  const place = {
    id: uid("mio"),
    name: data.name || "Lugar sin nombre",
    province: data.province || "Personalizado",
    town: data.town || "",
    lat: data.lat, lng: data.lng,
    type: data.type || "personalizado",
    dwell: data.dwell || typeInfo(data.type || "personalizado").dwell,
    price: data.price || 0,
    hours: data.hours || null,
    best: data.best || "cualquiera",
    desc: data.desc || "",
    tip: data.tip || "",
    tags: data.tags || [],
    source: data.source || "usuario",
    externalId: data.externalId || null
  };
  update((s) => { s.customPlaces.push(place); });
  return place;
}

export function updateCustomPlace(id, patch) {
  update((s) => {
    const i = s.customPlaces.findIndex((p) => p.id === id);
    if (i >= 0) s.customPlaces[i] = { ...s.customPlaces[i], ...patch };
  });
}

/* Corrige las coordenadas de un lugar del catálogo guardando una copia editada. */
export function overrideCoords(id, lat, lng, extra = {}) {
  update((s) => {
    const custom = s.customPlaces.findIndex((p) => p.id === id);
    if (custom >= 0) {
      s.customPlaces[custom] = { ...s.customPlaces[custom], lat, lng, ...extra };
      return;
    }
    const original = PLACES.find((p) => p.id === id);
    if (original) s.customPlaces.push({ ...original, ...extra, lat, lng, source: "corregido" });
  });
}

export function setPlan(planDays, { manual = false } = {}) {
  update((s) => {
    s.plan.days = planDays.map((d) => [...d]);
    s.plan.unassigned = [];
    s.plan.manual = manual;
    s.plan.generatedAt = Date.now();
  });
}

/* Mueve una parada a (día, posición). dayIndex === null → bandeja de pendientes. */
export function moveItem(id, dayIndex, position) {
  update((s) => {
    s.plan.days = s.plan.days.map((d) => d.filter((x) => x !== id));
    s.plan.unassigned = s.plan.unassigned.filter((x) => x !== id);
    const target = dayIndex == null ? s.plan.unassigned : s.plan.days[dayIndex];
    if (!target) { s.plan.unassigned.push(id); return; }
    const pos = position == null ? target.length : Math.max(0, Math.min(target.length, position));
    target.splice(pos, 0, id);
    s.plan.manual = true;
  });
}

export function setTrip(patch) {
  update((s) => { s.trip = { ...s.trip, ...patch }; });
}

export function setDayField(index, field, value) {
  update((s) => { if (s.days[index]) s.days[index][field] = value; });
}

export function setSettings(patch) {
  update((s) => { s.settings = { ...s.settings, ...patch }; });
}

export function setBudgetOverride(lineId, value) {
  update((s) => {
    if (value === null || value === "") delete s.budget.overrides[lineId];
    else s.budget.overrides[lineId] = Number(value) || 0;
  });
}

export function setAssumption(key, value) {
  update((s) => { s.budget.assumptions[key] = Number(value) || 0; });
}

export function resetAll() {
  update((s) => { Object.assign(s, blank()); });
}

export function exportState() {
  return JSON.stringify(state, null, 2);
}

export function importState(json) {
  const parsed = JSON.parse(json);
  if (!parsed || typeof parsed !== "object") throw new Error("Archivo no válido");
  update((s) => { Object.assign(s, deepMerge(blank(), parsed)); });
}
