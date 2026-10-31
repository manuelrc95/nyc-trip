/* Un único mapa para toda la app, que se mueve de vista en vista.
   Recrearlo en cada pestaña sería lento y perdería el encuadre. */

import { createMap, RD_CENTER } from "../services/map/provider.js";

let container = null;
let api = null;
let creating = null;

export function hostElement() {
  if (!container) {
    container = document.createElement("div");
    container.id = "map-host";
    container.className = "map-host";
    document.getElementById("map-parking")?.append(container);
  }
  return container;
}

export async function getMap() {
  hostElement();
  if (api) return api;
  if (!creating) {
    creating = createMap(container, { center: RD_CENTER, zoom: 8 }).then((m) => {
      api = m;
      creating = null;
      return m;
    });
  }
  return creating;
}

/* Mueve el mapa dentro de la vista activa. */
export async function attachTo(target) {
  const el = hostElement();
  if (el.parentElement !== target) target.append(el);
  const m = await getMap();
  requestAnimationFrame(() => m.invalidateSize());
  setTimeout(() => m.invalidateSize(), 220);
  return m;
}

export function park() {
  const el = hostElement();
  const parking = document.getElementById("map-parking");
  if (parking && el.parentElement !== parking) parking.append(el);
}

/* Se usa al cambiar de proveedor (Leaflet ↔ Google) en ajustes. */
export async function rebuild() {
  if (api) {
    try { api.destroy(); } catch { /* ignorar */ }
    api = null;
  }
  if (container) container.innerHTML = "";
  creating = null;
  return getMap();
}

export function currentProvider() {
  return api?.provider || null;
}
