/* Costa norte: Puerto Plata, María Trinidad Sánchez, Espaillat, Monte Cristi,
   Hermanas Mirabal, Dajabón. Coordenadas aproximadas (ver _schema.md). */

export default [
  /* ---------- María Trinidad Sánchez (Río San Juan, Cabrera, Nagua) ---------- */
  {
    id: "playa-caleton", name: "Playa Caletón", province: "María Trinidad Sánchez", town: "Río San Juan",
    lat: 19.6389, lng: -70.0686, type: "playa", dwell: 120, price: 0, priceNote: "Parqueo RD$100",
    hours: null, best: "manana",
    desc: "Cala pequeña de arena blanca y agua tranquila, protegida por acantilados.",
    tip: "Llega antes de las 10:00: es diminuta y los fines de semana se llena. Hay fritura y pescado frito en la orilla.",
    tags: ["familia", "comida-cerca", "snorkel"]
  },
  {
    id: "laguna-gri-gri", name: "Laguna Gri-Grí", province: "María Trinidad Sánchez", town: "Río San Juan",
    lat: 19.6403, lng: -70.0733, type: "naturaleza", dwell: 105, price: 18, priceNote: "Bote por grupo, negociable",
    hours: { from: "08:00", to: "17:00" }, best: "manana",
    desc: "Manglar navegable en bote que sale al mar por la Cueva de las Golondrinas y la Piscina Natural.",
    tip: "El paseo son unos 75 minutos. Pregunta el precio por bote completo, no por persona, y acuerda si incluye la parada en Caletón.",
    tags: ["bote", "manglar"]
  },
  {
    id: "playa-grande-rsj", name: "Playa Grande", province: "María Trinidad Sánchez", town: "Río San Juan",
    lat: 19.6453, lng: -70.0169, type: "playa", dwell: 150, price: 0, priceNote: "Parqueo RD$100–200",
    hours: null, best: "manana",
    desc: "Kilómetro y medio de arena dorada entre acantilados. La playa más espectacular de la zona.",
    tip: "El oleaje es fuerte y hay resaca: báñate en el extremo derecho, que está más protegido. Fila de comedores al entrar.",
    tags: ["surf", "comida-cerca"]
  },
  {
    id: "playa-preciosa", name: "Playa Preciosa", province: "María Trinidad Sánchez", town: "Río San Juan",
    lat: 19.6478, lng: -70.0108, type: "playa", dwell: 75, price: 0,
    hours: null, best: "manana",
    desc: "La hermana salvaje de Playa Grande, a cinco minutos andando por el acantilado.",
    tip: "Preciosa para fotos, mala para bañarse: corrientes serias y nadie vigilando. Ve, mira y vuelve.",
    tags: ["fotos", "virgen"]
  },
  {
    id: "laguna-dudu", name: "Laguna Dudú", province: "María Trinidad Sánchez", town: "Cabrera",
    lat: 19.6447, lng: -69.9223, type: "naturaleza", dwell: 120, price: 12, priceNote: "Entrada; tirolina aparte",
    hours: { from: "08:30", to: "17:30" }, best: "manana",
    desc: "Dos cenotes de agua azul intensa en plena selva, con tirolina que cae al agua.",
    tip: "Lleva efectivo, no aceptan tarjeta. El cenote grande tiene escalera; el pequeño se llega por un túnel de cuevas.",
    tags: ["cenote", "tirolina", "familia"]
  },
  {
    id: "playa-diamante", name: "Playa Diamante", province: "María Trinidad Sánchez", town: "Cabrera",
    lat: 19.6497, lng: -69.8972, type: "playa", dwell: 90, price: 0,
    hours: null, best: "manana",
    desc: "Laguna de mar cerrada por una barra de arena: agua turquesa y sin olas.",
    tip: "La mejor de la zona para niños o para quien no nada bien. Casi sin sombra: lleva sombrilla.",
    tags: ["familia", "sin-olas"]
  },
  {
    id: "el-saltadero-cabrera", name: "El Saltadero", province: "María Trinidad Sánchez", town: "Cabrera",
    lat: 19.6531, lng: -69.8741, type: "mirador", dwell: 45, price: 0,
    hours: null, best: "atardecer",
    desc: "Acantilado donde el mar revienta contra la roca y sale disparado hacia arriba.",
    tip: "Impresiona con mar de fondo y nada con mar en calma. No te acerques al borde mojado.",
    tags: ["fotos", "acantilado"]
  },
  {
    id: "cabo-frances-viejo", name: "Cabo Francés Viejo", province: "María Trinidad Sánchez", town: "Cabrera",
    lat: 19.6703, lng: -69.8958, type: "mirador", dwell: 50, price: 2,
    hours: { from: "09:00", to: "17:00" }, best: "atardecer",
    desc: "Faro y parque nacional sobre el punto más al norte de la costa, con mirador al océano.",
    tip: "El último tramo es de tierra. Vas por el mirador, no por el faro, que está cerrado al público.",
    tags: ["faro", "parque-nacional"]
  },
  {
    id: "playa-arroyo-salado", name: "Playa Arroyo Salado", province: "María Trinidad Sánchez", town: "Cabrera",
    lat: 19.5908, lng: -69.8711, type: "playa", dwell: 70, price: 0,
    hours: null, best: "tarde",
    desc: "Playa virgen de arena gruesa donde desemboca un río, casi siempre vacía.",
    tip: "No hay servicios de ningún tipo. Lleva agua y algo de comer si piensas quedarte.",
    tags: ["virgen", "sin-servicios"]
  },
  {
    id: "playa-los-gringos", name: "Playa Los Gringos", province: "María Trinidad Sánchez", town: "Nagua",
    lat: 19.3886, lng: -69.8325, type: "playa", dwell: 60, price: 0,
    hours: null, best: "tarde",
    desc: "La playa urbana de Nagua, con cocoteros pegados a la arena.",
    tip: "Más parada técnica que destino: buena para estirar las piernas si vas de camino a Samaná.",
    tags: ["parada", "local"]
  },

  /* ---------- Puerto Plata ---------- */
  {
    id: "teleferico-puerto-plata", name: "Teleférico y Pico Isabel de Torres", province: "Puerto Plata", town: "Puerto Plata",
    lat: 19.7869, lng: -70.6993, type: "mirador", dwell: 120, price: 15,
    hours: { from: "08:30", to: "17:00" }, best: "manana",
    desc: "Único teleférico del Caribe: ocho minutos hasta los 793 m, con jardín botánico y Cristo Redentor arriba.",
    tip: "Sube temprano: a media mañana el pico se nubla y no se ve nada. Arriba hace fresco de verdad.",
    tags: ["familia", "vistas", "clasico"]
  },
  {
    id: "fuerte-san-felipe", name: "Fortaleza San Felipe", province: "Puerto Plata", town: "Puerto Plata",
    lat: 19.8042, lng: -70.6959, type: "cultura", dwell: 60, price: 4,
    hours: { from: "09:00", to: "17:00" }, best: "atardecer",
    desc: "Fortaleza del siglo XVI a la entrada del puerto, con museo pequeño y paseo marítimo.",
    tip: "Combínala con el Malecón y el parque Independencia, todo está a diez minutos andando.",
    tags: ["historia", "malecon"]
  },
  {
    id: "playa-dorada", name: "Playa Dorada", province: "Puerto Plata", town: "Puerto Plata",
    lat: 19.7936, lng: -70.6417, type: "playa", dwell: 150, price: 0,
    hours: null, best: "tarde",
    desc: "Arena dorada protegida por un arrecife, rodeada de hoteles y con todos los servicios.",
    tip: "El acceso público está junto al centro comercial Playa Dorada Plaza. Alquiler de tumbonas y deportes acuáticos.",
    tags: ["servicios", "familia", "sin-olas"]
  },
  {
    id: "playa-cofresi", name: "Playa Cofresí", province: "Puerto Plata", town: "Puerto Plata",
    lat: 19.7892, lng: -70.7342, type: "playa", dwell: 120, price: 0,
    hours: null, best: "atardecer",
    desc: "Bahía pequeña con roca y arena, famosa por sus atardeceres.",
    tip: "La única playa de la zona orientada al oeste: aquí sí se ve el sol caer al mar.",
    tags: ["atardecer", "comida-cerca"]
  },
  {
    id: "damajagua", name: "27 Charcos de Damajagua", province: "Puerto Plata", town: "Imbert",
    lat: 19.6842, lng: -70.8293, type: "aventura", dwell: 210, price: 28, priceNote: "Incluye guía, casco y chaleco",
    hours: { from: "08:30", to: "15:00" }, best: "manana",
    desc: "Cañón de travertino que se baja saltando y deslizándose por 27 toboganes naturales.",
    tip: "Puedes subir solo a 7 o a 12 charcos si no quieres los saltos grandes. Última entrada a las 15:00 y en temporada de lluvia cierran sin avisar.",
    tags: ["mojarse", "adrenalina", "calzado-agua"]
  },
  {
    id: "cabarete", name: "Cabarete", province: "Puerto Plata", town: "Cabarete",
    lat: 19.7497, lng: -70.4150, type: "playa", dwell: 180, price: 0,
    hours: null, best: "tarde",
    desc: "La bahía del kitesurf: viento constante, escuelas, y la fila de bares con mesas en la arena.",
    tip: "El viento entra sobre las 11:00. Para bañarte tranquilo ve por la mañana; para ver kites y cenar en la arena, al atardecer.",
    tags: ["kitesurf", "noche", "comida-cerca"]
  },
  {
    id: "playa-encuentro", name: "Playa Encuentro", province: "Puerto Plata", town: "Cabarete",
    lat: 19.7622, lng: -70.4662, type: "playa", dwell: 120, price: 0,
    hours: null, best: "manana",
    desc: "La playa de surf de la costa norte, con escuelas y clases para principiantes.",
    tip: "Las mejores olas para aprender son de 7:00 a 10:00. No es playa de baño: el fondo es de coral.",
    tags: ["surf", "coral"]
  },
  {
    id: "playa-sosua", name: "Playa Sosúa", province: "Puerto Plata", town: "Sosúa",
    lat: 19.7596, lng: -70.5232, type: "playa", dwell: 120, price: 0,
    hours: null, best: "manana",
    desc: "Bahía en forma de herradura con agua transparente y el mejor snorkel accesible del norte.",
    tip: "Pasa de los vendedores de la entrada y camina hasta el extremo derecho, donde está el arrecife. Playa Alicia, al lado, es más tranquila.",
    tags: ["snorkel", "servicios"]
  },
  {
    id: "ocean-world", name: "Ocean World Adventure Park", province: "Puerto Plata", town: "Cofresí",
    lat: 19.7880, lng: -70.7390, type: "aventura", dwell: 300, price: 89, priceNote: "Entrada general, extras aparte",
    hours: { from: "09:00", to: "17:00" }, best: "manana",
    desc: "Parque marino con delfines, tiburones, leones marinos y piscinas.",
    tip: "Caro y de día completo. Solo tiene sentido si viajas con niños y reservas online con antelación.",
    tags: ["familia", "caro", "dia-completo"]
  },
  {
    id: "la-isabela", name: "Parque Histórico La Isabela", province: "Puerto Plata", town: "Luperón",
    lat: 19.8869, lng: -71.0831, type: "cultura", dwell: 75, price: 3,
    hours: { from: "09:00", to: "17:00" }, best: "manana",
    desc: "Ruinas del primer asentamiento europeo estable en América, fundado por Colón en 1493.",
    tip: "Hay poco en pie y mucho que contar: coge el guía de la entrada o te quedas mirando piedras.",
    tags: ["historia", "tranquilo"]
  },
  {
    id: "punta-rucia", name: "Punta Rucia y Cayo Arena", province: "Puerto Plata", town: "Punta Rucia",
    lat: 19.8906, lng: -71.1406, type: "excursion", dwell: 300, price: 45, priceNote: "Lancha al cayo",
    hours: { from: "08:00", to: "16:00" }, best: "manana",
    desc: "Banco de arena en medio del arrecife de Montecristi, con snorkel de postal.",
    tip: "Día completo desde Puerto Plata (2h de carretera). Sal temprano: las lanchas salen entre 9:00 y 10:00.",
    tags: ["snorkel", "dia-completo", "lancha"]
  },
  {
    id: "monkey-jungle", name: "Monkey Jungle", province: "Puerto Plata", town: "El Choco",
    lat: 19.6967, lng: -70.5219, type: "aventura", dwell: 150, price: 55, priceNote: "Zipline + monos",
    hours: { from: "09:00", to: "16:00" }, best: "manana",
    desc: "Siete tirolinas sobre el bosque y un recinto donde los monos ardilla se te suben encima.",
    tip: "Los beneficios van a la clínica dental gratuita del pueblo. Mejor a primera hora, cuando los monos tienen hambre.",
    tags: ["familia", "tirolina", "animales"]
  },

  /* ---------- Espaillat, Hermanas Mirabal, Monte Cristi, Dajabón ---------- */
  {
    id: "moca-corazon-jesus", name: "Iglesia Corazón de Jesús", province: "Espaillat", town: "Moca",
    lat: 19.3917, lng: -70.5236, type: "cultura", dwell: 40, price: 0,
    hours: { from: "08:00", to: "18:00" }, best: "cualquiera",
    desc: "Templo de 1920 con vitrales alemanes y un órgano de tubos traído de Europa.",
    tip: "Parada corta y bonita si cruzas la Cordillera Septentrional hacia Santiago.",
    tags: ["parada", "arquitectura"]
  },
  {
    id: "casa-museo-mirabal", name: "Casa Museo Hermanas Mirabal", province: "Hermanas Mirabal", town: "Salcedo",
    lat: 19.4089, lng: -70.4181, type: "cultura", dwell: 60, price: 2,
    hours: { from: "09:00", to: "17:00" }, best: "cualquiera",
    desc: "La casa de las tres hermanas asesinadas por Trujillo en 1960, conservada tal cual.",
    tip: "Cierra los lunes. Las guías son familiares de las Mirabal y la visita cambia por completo con lo que cuentan.",
    tags: ["historia", "cierra-lunes"]
  },
  {
    id: "el-morro-montecristi", name: "El Morro de Montecristi", province: "Monte Cristi", town: "Montecristi",
    lat: 19.8897, lng: -71.6564, type: "naturaleza", dwell: 120, price: 3,
    hours: { from: "08:00", to: "17:00" }, best: "manana",
    desc: "Mesa de roca de 237 m que cae a pico sobre el mar, con playa desierta a sus pies.",
    tip: "Son 500 escalones hasta el mirador. Hazlo temprano: a mediodía no hay ni una sombra.",
    tags: ["escalones", "virgen", "parque-nacional"]
  },
  {
    id: "dajabon-mercado", name: "Mercado binacional de Dajabón", province: "Dajabón", town: "Dajabón",
    lat: 19.5503, lng: -71.7083, type: "compras", dwell: 90, price: 0,
    hours: { from: "08:00", to: "14:00" }, best: "manana",
    desc: "El mercado de la frontera con Haití: miles de personas cruzando el río Masacre a comprar y vender.",
    tip: "Solo abre lunes y viernes. Es intenso y hay carteristas: lleva poco encima y nada de valor.",
    tags: ["lunes-viernes", "intenso", "frontera"]
  }
];
