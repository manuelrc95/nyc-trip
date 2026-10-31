/* Búsqueda de lugares.
   Siempre busca en el catálogo local. Si hay clave y Places está activado, además
   consulta la Places API (New) y propone los resultados como lugares añadibles. */

import { PLACES } from "../data/places/index.js";
import { getState } from "../store.js";
import { norm } from "../util.js";
import { apiKey, placesEnabled } from "./config.js";

/* Centro aproximado de RD, para sesgar la búsqueda al país. */
const RD_CENTER = { lat: 18.95, lng: -70.5 };

export function searchLocal(query, { province = "", type = "", region = "" } = {}) {
  const q = norm(query);
  const pool = [...PLACES, ...getState().customPlaces];
  return pool.filter((p) => {
    if (province && p.province !== province) return false;
    if (type && p.type !== type) return false;
    if (region && p.region !== region) return false;
    if (!q) return true;
    const hay = norm([p.name, p.province, p.town, p.desc, (p.tags || []).join(" ")].join(" "));
    return q.split(/\s+/).every((word) => hay.includes(word));
  });
}

/* Mapea los tipos de Google a nuestras categorías. */
const TYPE_MAP = [
  [["beach"], "playa"],
  [["natural_feature", "park", "national_park", "hiking_area"], "naturaleza"],
  [["tourist_attraction", "observation_deck"], "mirador"],
  [["museum", "church", "historical_landmark", "historical_place", "cultural_landmark"], "cultura"],
  [["restaurant", "food", "cafe", "bar_and_grill"], "comida"],
  [["bar", "night_club"], "noche"],
  [["shopping_mall", "market", "store", "gift_shop"], "compras"],
  [["lodging", "hotel", "resort_hotel"], "alojamiento"],
  [["locality", "political", "administrative_area_level_2"], "pueblo"]
];

function mapType(types = []) {
  for (const [keys, mine] of TYPE_MAP) {
    if (types.some((t) => keys.includes(t))) return mine;
  }
  return "personalizado";
}

function mapHours(oh) {
  const periods = oh?.periods;
  if (!Array.isArray(periods) || !periods.length) return null;
  const p = periods.find((x) => x.open && x.close) || periods[0];
  if (!p?.open || !p?.close) return null;
  const fmt = (t) => `${String(t.hour ?? 0).padStart(2, "0")}:${String(t.minute ?? 0).padStart(2, "0")}`;
  return { from: fmt(p.open), to: fmt(p.close) };
}

/* Busca en Google Places (New). Devuelve [] si no está configurado. */
export async function searchGoogle(query, { bias = RD_CENTER, radius = 120000, signal } = {}) {
  if (!placesEnabled() || !query.trim()) return [];

  const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    signal,
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey(),
      "X-Goog-FieldMask": [
        "places.id", "places.displayName", "places.formattedAddress", "places.location",
        "places.types", "places.rating", "places.userRatingCount", "places.regularOpeningHours",
        "places.editorialSummary", "places.googleMapsUri"
      ].join(",")
    },
    body: JSON.stringify({
      textQuery: query,
      languageCode: "es",
      regionCode: "DO",
      maxResultCount: 10,
      locationBias: { circle: { center: { latitude: bias.lat, longitude: bias.lng }, radius } }
    })
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Places API ${res.status}: ${detail.slice(0, 200)}`);
  }

  const data = await res.json();
  return (data.places || []).map((p) => ({
    externalId: p.id,
    name: p.displayName?.text || "Sin nombre",
    province: provinceFromAddress(p.formattedAddress),
    town: "",
    lat: p.location?.latitude,
    lng: p.location?.longitude,
    type: mapType(p.types),
    hours: mapHours(p.regularOpeningHours),
    desc: p.editorialSummary?.text || p.formattedAddress || "",
    rating: p.rating || null,
    ratingCount: p.userRatingCount || null,
    mapsUri: p.googleMapsUri || null,
    source: "google"
  })).filter((p) => p.lat != null && p.lng != null);
}

/* Las direcciones de Google en RD suelen traer la provincia antes del código postal. */
function provinceFromAddress(address = "") {
  const parts = String(address).split(",").map((s) => s.trim());
  const candidate = parts.length >= 2 ? parts[parts.length - 2] : "";
  return candidate.replace(/\s*\d{5}.*$/, "").trim() || "República Dominicana";
}

/* Busca un lugar concreto para corregir sus coordenadas y horario. */
export async function refineOne(place, { signal } = {}) {
  const query = [place.name, place.town, place.province, "República Dominicana"].filter(Boolean).join(", ");
  const results = await searchGoogle(query, { bias: { lat: place.lat, lng: place.lng }, radius: 30000, signal });
  return results[0] || null;
}
