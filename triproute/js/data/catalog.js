/* Catálogos: categorías de lugar, ritmos de viaje, estilos y partidas de presupuesto.
   Todo lo que es "tabla fija" vive aquí para no repetirlo por el código. */

export const TYPES = {
  playa:        { label: "Playa",        emoji: "🏖️", color: "#0ea5e9", dwell: 120, best: "manana" },
  naturaleza:   { label: "Naturaleza",   emoji: "🌿", color: "#10b981", dwell: 90,  best: "manana" },
  cascada:      { label: "Cascada",      emoji: "💦", color: "#06b6d4", dwell: 120, best: "manana" },
  aventura:     { label: "Aventura",     emoji: "🧭", color: "#f59e0b", dwell: 180, best: "manana" },
  mirador:      { label: "Mirador",      emoji: "🌅", color: "#f97316", dwell: 45,  best: "atardecer" },
  cultura:      { label: "Cultura",      emoji: "🏛️", color: "#a855f7", dwell: 75,  best: "cualquiera" },
  pueblo:       { label: "Pueblo",       emoji: "🏘️", color: "#8b5cf6", dwell: 60,  best: "cualquiera" },
  comida:       { label: "Comida",       emoji: "🍽️", color: "#ef4444", dwell: 75,  best: "cualquiera" },
  compras:      { label: "Compras",      emoji: "🛍️", color: "#ec4899", dwell: 60,  best: "cualquiera" },
  noche:        { label: "Noche",        emoji: "🌙", color: "#6366f1", dwell: 120, best: "noche" },
  excursion:    { label: "Excursión",    emoji: "⛵", color: "#0891b2", dwell: 300, best: "manana" },
  logistica:    { label: "Logística",    emoji: "🧳", color: "#64748b", dwell: 30,  best: "cualquiera" },
  alojamiento:  { label: "Alojamiento",  emoji: "🛏️", color: "#475569", dwell: 0,   best: "cualquiera" },
  personalizado:{ label: "Mi lugar",     emoji: "📍", color: "#334155", dwell: 60,  best: "cualquiera" }
};

export function typeInfo(t) {
  return TYPES[t] || TYPES.personalizado;
}

/* Franjas horarias preferidas. El optimizador penaliza visitar algo fuera de su franja. */
export const WINDOWS = {
  manana:     { label: "Mejor por la mañana", from: 7 * 60,  to: 13 * 60 },
  tarde:      { label: "Mejor por la tarde",  from: 13 * 60, to: 18 * 60 },
  atardecer:  { label: "Mejor al atardecer",  from: 16 * 60, to: 19 * 60 },
  noche:      { label: "Mejor de noche",      from: 18 * 60, to: 24 * 60 },
  cualquiera: { label: "A cualquier hora",    from: 0,       to: 24 * 60 }
};

/* Ritmo: cuántos minutos de "colchón" entre paradas y cuánto se recorta la visita. */
export const PACES = {
  relajado: { label: "Relajado", buffer: 25, dwellFactor: 1.15, maxDriveMin: 150 },
  normal:   { label: "Normal",   buffer: 15, dwellFactor: 1,    maxDriveMin: 210 },
  intenso:  { label: "Intenso",  buffer: 10, dwellFactor: 0.85, maxDriveMin: 300 }
};

/* Estilos de viaje: suben la prioridad de ciertos tipos al sugerir lugares. */
export const STYLES = {
  playas:       { label: "Playas",       favor: ["playa", "mirador"] },
  aventura:     { label: "Aventura",     favor: ["aventura", "cascada", "naturaleza"] },
  naturaleza:   { label: "Naturaleza",   favor: ["naturaleza", "cascada", "mirador"] },
  gastronomia:  { label: "Gastronomía",  favor: ["comida", "pueblo", "compras"] },
  cultura:      { label: "Cultura",      favor: ["cultura", "pueblo"] },
  relajacion:   { label: "Relajación",   favor: ["playa", "pueblo"] },
  fiesta:       { label: "Fiesta",       favor: ["noche", "playa", "comida"] },
  familia:      { label: "En familia",   favor: ["playa", "naturaleza", "cultura"] },
  mixto:        { label: "Mixto",        favor: [] }
};

/* Modos de planificación. */
export const MODES = {
  base: {
    label: "Con base fija",
    hint: "Duermes siempre en el mismo sitio. Agrupo los lugares por zonas para que cada día conduzcas menos."
  },
  ruta: {
    label: "Ruta de paso",
    hint: "Vas avanzando y duermes por el camino. Encadeno los lugares en una sola línea de avance."
  }
};

/* Partidas de presupuesto. 'auto' indica que la app propone un número y el usuario puede sobreescribirlo. */
export const BUDGET_LINES = [
  { id: "transporte",  label: "Combustible / transporte", auto: true,  perPerson: false },
  { id: "peajes",      label: "Peajes",                   auto: true,  perPerson: false },
  { id: "alojamiento", label: "Alojamiento",              auto: true,  perPerson: false },
  { id: "comida",      label: "Comida",                   auto: true,  perPerson: true  },
  { id: "entradas",    label: "Entradas y tours",         auto: true,  perPerson: true  },
  { id: "extras",      label: "Extras / imprevistos",     auto: false, perPerson: false }
];

/* Supuestos para la estimación automática del presupuesto (editables en la pestaña). */
export const BUDGET_ASSUMPTIONS = {
  fuelPricePerLiter: 4.6,   // USD por litro de gasolina premium (orientativo)
  litersPer100km: 9.5,
  tollsPerDay: 4,           // USD por día de carretera
  lodgingPerNight: 85,      // USD por noche y habitación doble
  foodPerPersonDay: 35      // USD por persona y día
};
