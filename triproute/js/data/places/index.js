/* Catálogo de lugares. Para añadir o quitar sitios, edita los archivos por región
   (ver _schema.md). El resto de la app no necesita cambios. */

import norte from "./norte.js";
import este from "./este.js";
import sur from "./sur.js";
import centro from "./centro.js";
import capital from "./capital.js";

const REGIONS = [
  { id: "norte",   label: "Costa norte",        places: norte },
  { id: "este",    label: "Este y Samaná",      places: este },
  { id: "centro",  label: "Cordillera y Cibao", places: centro },
  { id: "sur",     label: "Suroeste",           places: sur },
  { id: "capital", label: "Gran Santo Domingo", places: capital }
];

/* Lista plana con la región inyectada en cada lugar. */
export const PLACES = REGIONS.flatMap((r) =>
  r.places.map((p) => ({ ...p, region: r.id, regionLabel: r.label, source: "catalogo" }))
);

export const REGION_LIST = REGIONS.map(({ id, label }) => ({ id, label }));

export const PROVINCES = [...new Set(PLACES.map((p) => p.province))].sort((a, b) =>
  a.localeCompare(b, "es")
);

/* Aviso de integridad en desarrollo: ids duplicados romperían el itinerario. */
const seen = new Set();
for (const p of PLACES) {
  if (seen.has(p.id)) console.warn("[TripRoute] id de lugar duplicado:", p.id);
  seen.add(p.id);
}
