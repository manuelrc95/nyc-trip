/* Cordillera y Cibao: La Vega (Jarabacoa, Constanza), Santiago, Monseñor Nouel,
   Sánchez Ramírez, Duarte. Coordenadas aproximadas (ver _schema.md). */

export default [
  /* ---------- La Vega: Jarabacoa ---------- */
  {
    id: "salto-jimenoa-uno", name: "Salto de Jimenoa Uno", province: "La Vega", town: "Jarabacoa",
    lat: 19.0892, lng: -70.5933, type: "cascada", dwell: 90, price: 3,
    hours: { from: "08:30", to: "17:00" }, best: "manana",
    desc: "Caída de 60 m dentro de una cueva de roca, al final de siete puentes colgantes sobre el río.",
    tip: "Los puentes son estrechos y mojados: calzado con suela. El agua está helada y el salpicado lo empapa todo.",
    tags: ["mojarse", "puentes", "clasico"]
  },
  {
    id: "salto-baiguate", name: "Salto de Baiguate", province: "La Vega", town: "Jarabacoa",
    lat: 19.0942, lng: -70.6322, type: "cascada", dwell: 90, price: 2,
    hours: { from: "08:30", to: "17:00" }, best: "manana",
    desc: "Cascada de 25 m en un cañón cerrado, con poza para bañarse al pie.",
    tip: "Bajada de escaleras de diez minutos. Es la cascada de Jarabacoa donde sí te puedes meter. Hay rápel con operadores locales.",
    tags: ["banarse", "escalones", "rapel"]
  },
  {
    id: "jarabacoa", name: "Jarabacoa", province: "La Vega", town: "Jarabacoa",
    lat: 19.1183, lng: -70.6303, type: "pueblo", dwell: 90, price: 0,
    hours: null, best: "cualquiera",
    desc: "La ciudad de la eterna primavera: 550 m de altura, pinares, río Yaque del Norte y rafting.",
    tip: "Base natural para la cordillera. El rafting por el Yaque sale de aquí todas las mañanas.",
    tags: ["base", "rafting", "fresco"]
  },
  {
    id: "monte-mirador-jarabacoa", name: "Mirador La Peña", province: "La Vega", town: "Jarabacoa",
    lat: 19.1297, lng: -70.6522, type: "mirador", dwell: 45, price: 1,
    hours: { from: "08:00", to: "18:00" }, best: "atardecer",
    desc: "Balcón sobre el valle de Jarabacoa y el río Yaque del Norte.",
    tip: "Cinco minutos en carro desde el centro. Al atardecer se llena de gente local con cerveza y vista.",
    tags: ["vistas", "atardecer", "cerca"]
  },
  {
    id: "pico-duarte-cienaga", name: "Pico Duarte (La Ciénaga)", province: "La Vega", town: "La Ciénaga",
    lat: 19.0469, lng: -70.8369, type: "aventura", dwell: 480, price: 60, priceNote: "Guía, mula y permiso por día",
    hours: { from: "06:00", to: "16:00" }, best: "manana",
    desc: "Arranque de la subida al techo del Caribe, 3.098 m. Dos o tres días de caminata.",
    tip: "No es una excursión de un día: son 46 km ida y vuelta. Permiso obligatorio en Medio Ambiente y guía de la comunidad.",
    tags: ["varios-dias", "duro", "permiso"]
  },

  /* ---------- La Vega: Constanza y Valle Nuevo ---------- */
  {
    id: "constanza", name: "Constanza", province: "La Vega", town: "Constanza",
    lat: 18.9108, lng: -70.7447, type: "pueblo", dwell: 120, price: 0,
    hours: null, best: "cualquiera",
    desc: "Valle agrícola a 1.200 m rodeado de montañas: fresas, flores y clima de primavera permanente.",
    tip: "Puede bajar de 5 °C de noche, y en invierno hiela. Lleva chaqueta de verdad, no una sudadera.",
    tags: ["frio", "base", "agricola"]
  },
  {
    id: "salto-aguas-blancas", name: "Salto de Aguas Blancas", province: "La Vega", town: "Constanza",
    lat: 18.8133, lng: -70.7194, type: "cascada", dwell: 120, price: 2,
    hours: { from: "08:00", to: "16:30" }, best: "manana",
    desc: "Triple caída de 83 m a 1.680 m de altura, la cascada más alta del Caribe accesible en vehículo.",
    tip: "El camino desde Constanza son 45 min de tierra y piedra: 4x4 muy recomendable. El agua está a 8 °C: casi nadie se mete dos veces.",
    tags: ["4x4", "frio", "fotos"]
  },
  {
    id: "valle-nuevo", name: "Parque Nacional Valle Nuevo", province: "La Vega", town: "Constanza",
    lat: 18.7544, lng: -70.6031, type: "naturaleza", dwell: 180, price: 5,
    hours: { from: "08:00", to: "16:00" }, best: "manana",
    desc: "Páramo de pinos a 2.200 m con las Pirámides, el monumento al centro geográfico de la isla.",
    tip: "El sitio más frío del país: ha llegado a −8 °C. Carretera de tierra, tanque lleno y nada de ir de noche.",
    tags: ["4x4", "frio", "parque-nacional"]
  },

  /* ---------- Santiago y alrededores ---------- */
  {
    id: "monumento-santiago", name: "Monumento a los Héroes de la Restauración", province: "Santiago", town: "Santiago",
    lat: 19.4495, lng: -70.6881, type: "cultura", dwell: 75, price: 2,
    hours: { from: "09:00", to: "17:00" }, best: "atardecer",
    desc: "Torre de 67 m sobre una colina, con mirador y murales de Vela Zanetti dentro.",
    tip: "Sube al mirador: se ve todo el valle del Cibao. Alrededor hay bares y es el punto de encuentro de la ciudad.",
    tags: ["vistas", "noche", "clasico"]
  },
  {
    id: "centro-leon", name: "Centro León", province: "Santiago", town: "Santiago",
    lat: 19.4683, lng: -70.6797, type: "cultura", dwell: 120, price: 4,
    hours: { from: "10:00", to: "19:00" }, best: "cualquiera",
    desc: "El mejor museo del país: arte dominicano, antropología taína y una fábrica de cigarros en vivo.",
    tip: "Cierra los lunes. La demostración de torcido de tabaco y la cata van incluidas en la entrada.",
    tags: ["museo", "cierra-lunes", "tabaco"]
  },
  {
    id: "catedral-santiago", name: "Catedral de Santiago Apóstol", province: "Santiago", town: "Santiago",
    lat: 19.4511, lng: -70.6950, type: "cultura", dwell: 40, price: 0,
    hours: { from: "08:00", to: "18:00" }, best: "cualquiera",
    desc: "Catedral del siglo XIX frente al Parque Duarte, en el centro histórico.",
    tip: "Combínala con el Parque Duarte y el Centro Histórico: todo se hace andando en una hora.",
    tags: ["centro", "parada"]
  },
  {
    id: "santo-cerro", name: "Santo Cerro", province: "La Vega", town: "La Vega",
    lat: 19.2583, lng: -70.4761, type: "cultura", dwell: 60, price: 0,
    hours: { from: "07:00", to: "18:00" }, best: "atardecer",
    desc: "Santuario sobre una colina con la mejor vista del valle de La Vega Real.",
    tip: "Parada perfecta en la autopista Duarte entre Santiago y la capital. El patio del convento tiene la vista.",
    tags: ["vistas", "parada", "autopista"]
  },
  {
    id: "catedral-la-vega", name: "Catedral de La Vega", province: "La Vega", town: "La Vega",
    lat: 19.2219, lng: -70.5281, type: "cultura", dwell: 30, price: 0,
    hours: { from: "08:00", to: "18:00" }, best: "cualquiera",
    desc: "Catedral de hormigón brutalista de los años 90, una de las iglesias más raras de América.",
    tip: "Gusta o espanta, pero no se parece a nada. En febrero La Vega vive por su carnaval, el más famoso del país.",
    tags: ["arquitectura", "carnaval", "parada"]
  },
  {
    id: "presa-hatillo", name: "Presa de Hatillo", province: "Sánchez Ramírez", town: "Cotuí",
    lat: 19.0611, lng: -70.1972, type: "naturaleza", dwell: 90, price: 0,
    hours: null, best: "tarde",
    desc: "El embalse más grande del país, con paseos en bote y pescado fresco en la orilla.",
    tip: "Poco turístico y muy tranquilo. Los comedores de la presa sirven tilapia recién sacada.",
    tags: ["comida-cerca", "local", "bote"]
  },
  {
    id: "salto-socoa", name: "Salto de Socoa", province: "Monseñor Nouel", town: "Bonao",
    lat: 18.9414, lng: -70.4089, type: "cascada", dwell: 90, price: 2,
    hours: { from: "08:00", to: "17:00" }, best: "manana",
    desc: "Cascada y balneario en el río Yuna, a diez minutos de Bonao.",
    tip: "Parada corta saliendo de la autopista Duarte. Fines de semana lleno de familias y música.",
    tags: ["banarse", "parada", "local"]
  },
  {
    id: "bonao-pueblo", name: "Bonao y Plaza de la Cultura", province: "Monseñor Nouel", town: "Bonao",
    lat: 18.9372, lng: -70.4089, type: "cultura", dwell: 60, price: 0,
    hours: { from: "09:00", to: "17:00" }, best: "cualquiera",
    desc: "La ciudad del pintor Cándido Bidó, con su plaza cultural y galería.",
    tip: "Mitad de camino exacto entre la capital y Santiago. Buen sitio para parar a comer y estirar las piernas.",
    tags: ["parada", "arte", "autopista"]
  }
];
