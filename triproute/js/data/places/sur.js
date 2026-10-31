/* Suroeste: Barahona, Pedernales, Independencia, Azua, Peravia, San Cristóbal,
   San Juan. Coordenadas aproximadas (ver _schema.md). */

export default [
  /* ---------- Barahona ---------- */
  {
    id: "playa-san-rafael", name: "Playa San Rafael", province: "Barahona", town: "Paraíso",
    lat: 18.0477, lng: -71.1194, type: "playa", dwell: 150, price: 0, priceNote: "Comida ~US$12",
    hours: null, best: "manana",
    desc: "Playa de guijarros donde un río de montaña cae al Caribe y forma piscinas de agua dulce.",
    tip: "El balneario de agua dulce está justo detrás de la playa. Pide pescado frito con tostones en los comedores de la entrada.",
    tags: ["rio", "comida-cerca", "clasico"]
  },
  {
    id: "playa-los-patos", name: "Playa Los Patos", province: "Barahona", town: "Paraíso",
    lat: 17.9472, lng: -71.1950, type: "playa", dwell: 120, price: 0,
    hours: null, best: "manana",
    desc: "El río más corto del mundo desembocando en una playa de piedras, con balneario natural.",
    tip: "El agua del río está helada y el mar caliente: alterna. Lleva calzado, las piedras duelen.",
    tags: ["rio", "banarse", "comida-cerca"]
  },
  {
    id: "playa-bahoruco", name: "Playa Bahoruco", province: "Barahona", town: "Bahoruco",
    lat: 18.1536, lng: -71.0892, type: "playa", dwell: 100, price: 0,
    hours: null, best: "tarde",
    desc: "Playa de arena gris y guijarros con la montaña cayendo directamente al mar.",
    tip: "Una de las vistas más bonitas de la carretera de la costa. Mar abierto: báñate con cuidado.",
    tags: ["fotos", "tranquila"]
  },
  {
    id: "mina-larimar", name: "Minas de Larimar", province: "Barahona", town: "Filipinas",
    lat: 18.1181, lng: -71.2383, type: "cultura", dwell: 90, price: 5, priceNote: "Propina al guía",
    hours: { from: "08:00", to: "16:00" }, best: "manana",
    desc: "La única mina de larimar del mundo, excavada a mano en la sierra de Bahoruco.",
    tip: "El camino de subida necesita 4x4 o motoconcho. Compra la piedra aquí: cuesta una fracción de lo que vale en la costa.",
    tags: ["4x4", "compras", "local"]
  },
  {
    id: "polo-magnetico", name: "Polo Magnético", province: "Barahona", town: "Polo",
    lat: 18.0797, lng: -71.2900, type: "mirador", dwell: 40, price: 0,
    hours: null, best: "cualquiera",
    desc: "Tramo de carretera donde parece que el coche sube la cuesta solo. Ilusión óptica famosa.",
    tip: "Hay un cartel y una zona marcada. Es una tontería divertida de cinco minutos: no desvíes el viaje solo por esto.",
    tags: ["curiosidad", "parada"]
  },
  {
    id: "hoyo-pelempito", name: "Hoyo de Pelempito", province: "Pedernales", town: "Sierra de Bahoruco",
    lat: 18.0847, lng: -71.5700, type: "mirador", dwell: 120, price: 5,
    hours: { from: "08:00", to: "16:00" }, best: "manana",
    desc: "Mirador sobre una depresión de 700 m de profundidad en plena sierra, a 1.165 m de altura.",
    tip: "Hace frío de verdad arriba, incluso en agosto: lleva chaqueta. Camino de tierra de 20 km, mejor 4x4 y con el depósito lleno.",
    tags: ["4x4", "frio", "parque-nacional"]
  },

  /* ---------- Pedernales ---------- */
  {
    id: "bahia-de-las-aguilas", name: "Bahía de las Águilas", province: "Pedernales", town: "Pedernales",
    lat: 17.8831, lng: -71.6342, type: "playa", dwell: 300, price: 30, priceNote: "Lancha desde Cabo Rojo + entrada al parque",
    hours: { from: "08:00", to: "17:00" }, best: "manana",
    desc: "Ocho kilómetros de arena virgen dentro del Parque Nacional Jaragua. La playa más bonita del país.",
    tip: "Se llega en lancha desde Las Cuevas (20 min) o por un camino de tierra. No hay sombra, ni agua, ni comida: lleva todo y vete antes de las 15:00.",
    tags: ["dia-completo", "virgen", "lancha", "sin-servicios"]
  },
  {
    id: "laguna-oviedo", name: "Laguna de Oviedo", province: "Pedernales", town: "Oviedo",
    lat: 17.7831, lng: -71.4031, type: "naturaleza", dwell: 180, price: 22, priceNote: "Bote con guía, por grupo",
    hours: { from: "08:00", to: "16:00" }, best: "manana",
    desc: "Laguna hipersalina con flamencos, iguanas y cocodrilos, en el Parque Nacional Jaragua.",
    tip: "El paseo en bote dura 2–3 horas y para en los islotes de iguanas. Los flamencos se ven mejor temprano y con prismáticos.",
    tags: ["bote", "animales", "parque-nacional"]
  },
  {
    id: "cabo-rojo", name: "Cabo Rojo y Playa Las Cuevas", province: "Pedernales", town: "Pedernales",
    lat: 17.9231, lng: -71.6542, type: "playa", dwell: 90, price: 0,
    hours: null, best: "tarde",
    desc: "Playa de arena blanca junto al puerto minero, punto de salida de las lanchas a Bahía de las Águilas.",
    tip: "Aquí están los comedores y los baños que no hay en Bahía de las Águilas. Come al volver, no antes.",
    tags: ["comida-cerca", "base"]
  },
  {
    id: "playa-san-rafael-pedernales", name: "Hoyo de Cacique", province: "Pedernales", town: "Pedernales",
    lat: 17.8747, lng: -71.6475, type: "playa", dwell: 60, price: 0,
    hours: null, best: "manana",
    desc: "Cala minúscula de arena blanca encajada entre rocas, de camino a Bahía de las Águilas.",
    tip: "La lancha para aquí si lo pides. Cabe poca gente y el agua es cristalina: perfecta para snorkel.",
    tags: ["snorkel", "lancha", "pequena"]
  },

  /* ---------- Independencia ---------- */
  {
    id: "lago-enriquillo", name: "Lago Enriquillo e Isla Cabritos", province: "Independencia", town: "La Descubierta",
    lat: 18.4950, lng: -71.6500, type: "naturaleza", dwell: 210, price: 25, priceNote: "Bote con guía",
    hours: { from: "08:00", to: "15:00" }, best: "manana",
    desc: "El lago salado más grande del Caribe, 40 m bajo el nivel del mar, con cocodrilos americanos e iguanas.",
    tip: "Depende del nivel del agua: pregunta antes de ir si los botes están saliendo. A las 8:00 es cuando se ven los cocodrilos.",
    tags: ["bote", "animales", "consultar"]
  },
  {
    id: "las-caritas", name: "Las Caritas de Los Indios", province: "Independencia", town: "La Descubierta",
    lat: 18.4869, lng: -71.7050, type: "cultura", dwell: 45, price: 0,
    hours: null, best: "manana",
    desc: "Petroglifos taínos tallados en la roca caliza, con vista al lago Enriquillo.",
    tip: "Son unos escalones de piedra junto a la carretera. Diez minutos de subida y una vista enorme del lago.",
    tags: ["taino", "parada", "vistas"]
  },
  {
    id: "balneario-la-zurza", name: "Balneario Las Barías (La Zurza)", province: "Independencia", town: "La Descubierta",
    lat: 18.5733, lng: -71.7261, type: "naturaleza", dwell: 90, price: 2,
    hours: { from: "08:00", to: "18:00" }, best: "tarde",
    desc: "Manantial de agua transparente a 25 °C bajo los árboles, en el pueblo de La Descubierta.",
    tip: "El sitio donde se baña todo el pueblo y donde se te quita el calor del lago. Hay comedores al lado.",
    tags: ["banarse", "local", "comida-cerca"]
  },

  /* ---------- Azua, Peravia, San Cristóbal, San Juan ---------- */
  {
    id: "playa-monte-rio", name: "Playa Monte Río", province: "Azua", town: "Azua",
    lat: 18.3864, lng: -70.7719, type: "playa", dwell: 90, price: 0,
    hours: null, best: "tarde",
    desc: "Playa de guijarros en la bahía de Ocoa, con comedores de pescado sobre el agua.",
    tip: "Parada clásica camino al suroeste. El pescado con coco de los comedores es el motivo para detenerse.",
    tags: ["comida-cerca", "parada"]
  },
  {
    id: "dunas-de-bani", name: "Dunas de Baní", province: "Peravia", town: "Baní",
    lat: 18.2353, lng: -70.3392, type: "naturaleza", dwell: 90, price: 3,
    hours: { from: "08:00", to: "17:30" }, best: "atardecer",
    desc: "Quince kilómetros de dunas de arena de hasta 35 m entre el mar y la salina de Las Calderas.",
    tip: "Paisaje de desierto a una hora y media de la capital. Ve al final de la tarde: a mediodía la arena quema.",
    tags: ["fotos", "atardecer", "raro"]
  },
  {
    id: "las-salinas-bani", name: "Las Salinas", province: "Peravia", town: "Baní",
    lat: 18.2075, lng: -70.5442, type: "pueblo", dwell: 75, price: 0,
    hours: null, best: "tarde",
    desc: "Península de salinas y mar plano, capital nacional del windsurf.",
    tip: "Buen sitio para comer marisco con vista a la bahía. El viento entra fuerte por la tarde.",
    tags: ["windsurf", "comida-cerca"]
  },
  {
    id: "playa-palenque", name: "Playa Palenque", province: "San Cristóbal", town: "Palenque",
    lat: 18.2703, lng: -70.1575, type: "playa", dwell: 100, price: 0,
    hours: null, best: "tarde",
    desc: "Playa larga de arena oscura a 45 minutos de Santo Domingo, con mucho ambiente local.",
    tip: "Los fines de semana hay música a todo volumen; entre semana está casi vacía.",
    tags: ["local", "cerca-capital"]
  },
  {
    id: "cuevas-pomier", name: "Reserva Antropológica de Pomier", province: "San Cristóbal", town: "San Cristóbal",
    lat: 18.4583, lng: -70.1281, type: "cultura", dwell: 75, price: 3,
    hours: { from: "09:00", to: "16:00" }, best: "cualquiera",
    desc: "Cincuenta y cinco cuevas con más de 6.000 pinturas rupestres taínas, el conjunto mayor del Caribe.",
    tip: "Solo se visitan las cuevas 1 y 2, con guía y linterna. Media hora desde la capital por la autopista 6 de Noviembre.",
    tags: ["taino", "cerca-capital", "guia"]
  },
  {
    id: "el-cachon-de-la-rubia", name: "El Cachón de la Rubia", province: "San Juan", town: "San Juan de la Maguana",
    lat: 18.8086, lng: -71.2297, type: "naturaleza", dwell: 120, price: 2,
    hours: { from: "08:00", to: "17:00" }, best: "manana",
    desc: "Balneario de agua turquesa entre paredes de roca, en el río Maguana.",
    tip: "Un secreto del sur profundo. El agua está fría y transparente; los fines de semana es fiesta local.",
    tags: ["banarse", "local", "rio"]
  },
  {
    id: "corral-de-los-indios", name: "Corral de los Indios", province: "San Juan", town: "San Juan de la Maguana",
    lat: 18.9208, lng: -71.2458, type: "cultura", dwell: 40, price: 0,
    hours: null, best: "cualquiera",
    desc: "Círculo ceremonial taíno de 2.000 m² con una piedra tallada en el centro.",
    tip: "Queda en medio de una finca y no hay nada montado alrededor. Interesa si te gusta la historia taína.",
    tags: ["taino", "parada"]
  }
];
