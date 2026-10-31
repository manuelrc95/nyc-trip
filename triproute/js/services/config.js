/* Configuración de Google Maps Platform.
   La clave vive solo en el navegador del usuario (localStorage); nunca va en el código. */

import { getState } from "../store.js";

export const GOOGLE_APIS = [
  { id: "maps", label: "Maps JavaScript API", why: "Dibujar el mapa con tiles de Google en lugar de OpenStreetMap." },
  { id: "places", label: "Places API (New)", why: "Buscar cualquier sitio de RD por nombre y traer sus coordenadas, horario y valoración." },
  { id: "routes", label: "Routes API", why: "Tiempos de conducción reales entre paradas, en vez de estimados." }
];

export function settings() {
  return getState().settings;
}

export function apiKey() {
  return (settings().googleKey || "").trim();
}

export function hasKey() {
  return apiKey().length > 20;
}

export function placesEnabled() {
  return hasKey() && !!settings().usePlaces;
}

export function routesEnabled() {
  return hasKey() && !!settings().useRoutes;
}

export function googleMapsEnabled() {
  return hasKey() && settings().mapProvider === "google";
}

/* Carga el SDK de Google Maps una sola vez, bajo demanda. */
let mapsPromise = null;

export function loadGoogleMaps() {
  if (mapsPromise) return mapsPromise;
  if (!hasKey()) return Promise.reject(new Error("Falta la clave de Google Maps"));

  mapsPromise = new Promise((resolve, reject) => {
    const params = new URLSearchParams({
      key: apiKey(),
      v: "weekly",
      libraries: "marker",
      language: "es",
      region: "DO",
      loading: "async",
      callback: "__tripRouteMapsReady"
    });
    window.__tripRouteMapsReady = () => resolve(window.google.maps);
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?${params}`;
    script.async = true;
    script.onerror = () => {
      mapsPromise = null;
      reject(new Error("No se pudo cargar Google Maps. Revisa la clave y las restricciones de referente."));
    };
    document.head.append(script);
  });
  return mapsPromise;
}

export function resetGoogleMaps() {
  mapsPromise = null;
}
