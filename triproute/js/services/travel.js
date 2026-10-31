/* Tiempos y distancias entre paradas.
   Por defecto se estiman sin red (gratis y offline). Si el usuario configura una
   clave de Google, los tramos del itinerario final se refinan con la Routes API. */

import { haversine } from "../geo.js";

const CACHE_KEY = "triproute:legs";
let cache = loadCache();

function loadCache() {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY) || "{}"); }
  catch { return {}; }
}

function saveCache() {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(cache)); } catch { /* sin espacio: seguimos */ }
}

function keyOf(a, b) {
  const r = (n) => Number(n).toFixed(4);
  return `${r(a.lat)},${r(a.lng)}>${r(b.lat)},${r(b.lng)}`;
}

/* El factor de rodeo: en RD casi nunca se va en línea recta. */
function detourFactor(straightKm) {
  if (straightKm < 3) return 1.5;
  if (straightKm < 10) return 1.4;
  if (straightKm < 40) return 1.32;
  if (straightKm < 120) return 1.25;
  return 1.2;
}

/* Velocidad media realista por tramo (km/h). */
function speedFor(km, a, b) {
  let v;
  if (km < 3) v = 18;
  else if (km < 10) v = 28;
  else if (km < 40) v = 45;
  else if (km < 120) v = 58;
  else v = 65;
  if (isRough(a) || isRough(b)) v *= 0.72;   // último tramo de tierra
  return v;
}

function isRough(p) {
  if (!p) return false;
  const tags = p.tags || [];
  return tags.includes("4x4") || tags.includes("barro") || p.type === "cascada" || p.type === "aventura";
}

/* Estimación de un tramo. Devuelve siempre algo: nunca falla. */
export function estimateLeg(a, b) {
  if (!a || !b) return { km: 0, min: 0, source: "estimado" };
  const straight = haversine(a, b);
  const km = straight * detourFactor(straight);
  const min = Math.max(8, Math.round((km / speedFor(km, a, b)) * 60 / 5) * 5);
  return { km: Math.round(km * 10) / 10, min, source: "estimado" };
}

/* Tramo: usa el valor refinado por Google si está en caché, si no estima. */
export function leg(a, b) {
  if (!a || !b) return { km: 0, min: 0, source: "estimado" };
  const hit = cache[keyOf(a, b)];
  if (hit) return { ...hit, source: "google" };
  return estimateLeg(a, b);
}

/* ¿Hay algún tramo del itinerario sin refinar? */
export function pendingLegs(pairs) {
  return pairs.filter(([a, b]) => a && b && !cache[keyOf(a, b)]);
}

export function cachedLegCount() {
  return Object.keys(cache).length;
}

export function clearLegCache() {
  cache = {};
  saveCache();
}

/* Refina una lista de tramos [ [origen, destino], ... ] con la Routes API.
   Una sola petición: computeRouteMatrix devuelve n×n y nos quedamos la diagonal. */
export async function refineLegs(pairs, { apiKey, signal } = {}) {
  const todo = pendingLegs(pairs).slice(0, 25); // 25×25 = 625 elementos, el límite
  if (!apiKey || !todo.length) return { refined: 0, skipped: pendingLegs(pairs).length };

  const body = {
    origins: todo.map(([a]) => waypoint(a)),
    destinations: todo.map(([, b]) => waypoint(b)),
    travelMode: "DRIVE",
    routingPreference: "TRAFFIC_UNAWARE"
  };

  const res = await fetch("https://routes.googleapis.com/distanceMatrix/v2:computeRouteMatrix", {
    method: "POST",
    signal,
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": "originIndex,destinationIndex,duration,distanceMeters,condition"
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Routes API ${res.status}: ${detail.slice(0, 200)}`);
  }

  const rows = await res.json();
  let refined = 0;
  for (const row of Array.isArray(rows) ? rows : []) {
    if (row.originIndex !== row.destinationIndex) continue;       // solo la diagonal
    if (row.condition && row.condition !== "ROUTE_EXISTS") continue;
    const pair = todo[row.originIndex];
    if (!pair) continue;
    const seconds = Number(String(row.duration || "0s").replace("s", ""));
    const km = (Number(row.distanceMeters) || 0) / 1000;
    if (!seconds || !km) continue;
    cache[keyOf(pair[0], pair[1])] = {
      km: Math.round(km * 10) / 10,
      min: Math.max(5, Math.round(seconds / 60))
    };
    refined++;
  }
  saveCache();
  return { refined, skipped: pendingLegs(pairs).length };
}

function waypoint(p) {
  return { waypoint: { location: { latLng: { latitude: p.lat, longitude: p.lng } } } };
}

/* Matriz de costes para el optimizador. Siempre sincrónica: usa caché + estimación. */
export function costMatrix(points) {
  const n = points.length;
  const m = Array.from({ length: n }, () => new Array(n).fill(null));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      m[i][j] = i === j ? { km: 0, min: 0, source: "estimado" } : leg(points[i], points[j]);
    }
  }
  return {
    min: (i, j) => m[i][j].min,
    km: (i, j) => m[i][j].km,
    at: (i, j) => m[i][j]
  };
}
