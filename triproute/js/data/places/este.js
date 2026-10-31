/* Este y península de Samaná: Samaná, La Altagracia, La Romana, San Pedro de Macorís,
   El Seibo, Hato Mayor. Coordenadas aproximadas (ver _schema.md). */

export default [
  /* ---------- Samaná ---------- */
  {
    id: "salto-el-limon", name: "Salto El Limón", province: "Samaná", town: "El Limón",
    lat: 19.2811, lng: -69.4472, type: "cascada", dwell: 210, price: 25, priceNote: "Guía + caballo",
    hours: { from: "08:00", to: "16:00" }, best: "manana",
    desc: "Cascada de 40 m al final de una hora de camino a caballo o a pie entre fincas de cacao.",
    tip: "Hay cuatro paradas de salida; la de El Café es la más corta. El camino es barro resbaladizo: no vayas en chancletas.",
    tags: ["caballo", "mojarse", "barro"]
  },
  {
    id: "playa-rincon", name: "Playa Rincón", province: "Samaná", town: "Las Galeras",
    lat: 19.3573, lng: -69.2383, type: "playa", dwell: 240, price: 0, priceNote: "Lancha desde Las Galeras ~US$20",
    hours: null, best: "manana",
    desc: "Tres kilómetros de arena blanca al pie de una montaña de 600 m. De las mejores playas del Caribe.",
    tip: "Por tierra son 20 min de camino malo desde Las Galeras; en lancha, 15 min y mucho más bonito. Hay comedores en el extremo derecho, junto al río de agua dulce.",
    tags: ["dia-completo", "comida-cerca", "virgen"]
  },
  {
    id: "las-galeras", name: "Las Galeras", province: "Samaná", town: "Las Galeras",
    lat: 19.3011, lng: -69.1659, type: "pueblo", dwell: 90, price: 0,
    hours: null, best: "tarde",
    desc: "Pueblo de pescadores al final de la carretera, con playa urbana y lanchas a las playas vírgenes.",
    tip: "Es la base para Rincón, Frontón y Madama. Negocia la lancha para varias playas en un solo viaje.",
    tags: ["base", "lancha", "comida-cerca"]
  },
  {
    id: "playa-fronton", name: "Playa Frontón", province: "Samaná", town: "Las Galeras",
    lat: 19.3331, lng: -69.1372, type: "playa", dwell: 150, price: 22, priceNote: "Lancha ida y vuelta",
    hours: null, best: "manana",
    desc: "Playa encajada entre acantilados de 200 m, con uno de los mejores arrecifes de la península.",
    tip: "Solo se llega en lancha o con una caminata dura de 90 min. Lleva gafas de snorkel propias.",
    tags: ["snorkel", "lancha", "virgen"]
  },
  {
    id: "cayo-levantado", name: "Cayo Levantado", province: "Samaná", town: "Samaná",
    lat: 19.1961, lng: -69.2872, type: "excursion", dwell: 240, price: 20, priceNote: "Lancha desde el muelle",
    hours: { from: "08:00", to: "17:00" }, best: "manana",
    desc: "La isla Bacardí: media hora de lancha desde Samaná y arena blanca con palmeras.",
    tip: "La mitad de la isla es un resort privado. La playa pública se llena cuando atraca un crucero: ve a primera hora.",
    tags: ["lancha", "familia", "turistico"]
  },
  {
    id: "los-haitises", name: "Parque Nacional Los Haitises", province: "Samaná", town: "Sabana de la Mar",
    lat: 19.0800, lng: -69.4900, type: "excursion", dwell: 300, price: 55, priceNote: "Tour en bote con guía",
    hours: { from: "08:00", to: "16:00" }, best: "manana",
    desc: "Mogotes de roca saliendo del agua, manglares y cuevas con pictografías taínas.",
    tip: "Solo con tour autorizado, en bote desde Samaná o Sabana de la Mar. Reserva el día antes y llévate impermeable fino.",
    tags: ["bote", "dia-completo", "reservar"]
  },
  {
    id: "samana-pueblo", name: "Santa Bárbara de Samaná", province: "Samaná", town: "Samaná",
    lat: 19.2061, lng: -69.3327, type: "pueblo", dwell: 75, price: 0,
    hours: null, best: "tarde",
    desc: "El pueblo-puerto de la bahía, con su malecón y el puente a los cayos.",
    tip: "De enero a marzo salen de aquí los barcos a ver ballenas jorobadas. Fuera de temporada es solo una parada agradable.",
    tags: ["ballenas", "malecon", "comida-cerca"]
  },
  {
    id: "las-terrenas", name: "Las Terrenas", province: "Samaná", town: "Las Terrenas",
    lat: 19.3200, lng: -69.5400, type: "pueblo", dwell: 150, price: 0,
    hours: null, best: "atardecer",
    desc: "El pueblo más cosmopolita de la península: Pueblo de los Pescadores, restaurantes franceses e italianos y playa urbana.",
    tip: "Cena en el Pueblo de los Pescadores al atardecer. Para moverte por el pueblo, los motoconchos son la norma.",
    tags: ["noche", "comida-cerca", "base"]
  },
  {
    id: "playa-coson", name: "Playa Cosón", province: "Samaná", town: "Las Terrenas",
    lat: 19.3031, lng: -69.6000, type: "playa", dwell: 150, price: 0,
    hours: null, best: "atardecer",
    desc: "Siete kilómetros de arena con cocoteros y casi nadie, a diez minutos de Las Terrenas.",
    tip: "La mejor puesta de sol de la península. Come en uno de los chiringuitos de pescado del centro de la playa.",
    tags: ["atardecer", "tranquila", "comida-cerca"]
  },
  {
    id: "playa-bonita-samana", name: "Playa Bonita", province: "Samaná", town: "Las Terrenas",
    lat: 19.3139, lng: -69.5697, type: "playa", dwell: 120, price: 0,
    hours: null, best: "manana",
    desc: "Playa de arena fina con hoteles pequeños, entre Las Terrenas y Cosón.",
    tip: "Buen equilibrio: tiene servicios y no está masificada. Entra por el hotel Atlantis.",
    tags: ["servicios", "tranquila"]
  },
  {
    id: "el-valle-samana", name: "Playa El Valle", province: "Samaná", town: "El Valle",
    lat: 19.2961, lng: -69.2958, type: "playa", dwell: 120, price: 0,
    hours: null, best: "manana",
    desc: "Bahía salvaje entre montañas, con olas y un río que desemboca en la arena.",
    tip: "La carretera desde Samaná es empinada y estrecha: mejor con vehículo alto. No hay sombra ni servicios.",
    tags: ["virgen", "4x4", "olas"]
  },

  /* ---------- La Altagracia (Punta Cana, Higüey, Bayahíbe) ---------- */
  {
    id: "playa-bavaro", name: "Playa Bávaro", province: "La Altagracia", town: "Bávaro",
    lat: 18.6894, lng: -68.4281, type: "playa", dwell: 180, price: 0,
    hours: null, best: "manana",
    desc: "La playa de postal de Punta Cana: arena blanca, cocoteros y agua turquesa sin olas.",
    tip: "Los accesos públicos están en Los Corales y El Cortecito. Deja el coche en una de las plazas, no en la arena.",
    tags: ["familia", "servicios", "clasico"]
  },
  {
    id: "playa-macao", name: "Playa Macao", province: "La Altagracia", town: "Macao",
    lat: 18.8133, lng: -68.5319, type: "playa", dwell: 150, price: 0, priceNote: "Parqueo RD$100",
    hours: null, best: "manana",
    desc: "Playa pública abierta, con olas, escuela de surf y comedores de pescado.",
    tip: "La única playa grande de la zona sin resorts delante. Por la tarde llegan los buggies y se llena de polvo y ruido.",
    tags: ["surf", "comida-cerca", "publica"]
  },
  {
    id: "hoyo-azul", name: "Hoyo Azul", province: "La Altagracia", town: "Cap Cana",
    lat: 18.4861, lng: -68.4208, type: "naturaleza", dwell: 105, price: 45, priceNote: "Acceso por Scape Park",
    hours: { from: "09:00", to: "17:00" }, best: "manana",
    desc: "Cenote de agua azul eléctrico al pie de un acantilado de 75 m, en Cap Cana.",
    tip: "Solo se entra comprando el acceso de Scape Park. Ve a primera hora: al mediodía el color baja y hay cola para la foto.",
    tags: ["cenote", "caro", "fotos"]
  },
  {
    id: "playa-juanillo", name: "Playa Juanillo", province: "La Altagracia", town: "Cap Cana",
    lat: 18.4917, lng: -68.3697, type: "playa", dwell: 150, price: 0, priceNote: "Entrada a Cap Cana con pasaporte",
    hours: { from: "08:00", to: "18:00" }, best: "manana",
    desc: "Media luna de arena blanquísima dentro de Cap Cana, con agua de piscina.",
    tip: "En la caseta de Cap Cana pide acceso a la playa pública y muestra identificación. Los beach clubs cobran, la arena no.",
    tags: ["familia", "sin-olas", "turistico"]
  },
  {
    id: "isla-saona", name: "Isla Saona", province: "La Altagracia", town: "Bayahíbe",
    lat: 18.1489, lng: -68.7225, type: "excursion", dwell: 420, price: 75, priceNote: "Tour con almuerzo",
    hours: { from: "08:00", to: "17:00" }, best: "manana",
    desc: "Isla del Parque Nacional del Este: playas de postal, piscina natural con estrellas de mar y catamarán de vuelta.",
    tip: "Día completo que ocupa el día entero. Sale de Bayahíbe, no de Punta Cana: si duermes en Bávaro, te recogen a las 7:00.",
    tags: ["dia-completo", "reservar", "catamaran"]
  },
  {
    id: "bayahibe", name: "Bayahíbe", province: "La Altagracia", town: "Bayahíbe",
    lat: 18.3706, lng: -68.8351, type: "pueblo", dwell: 120, price: 0,
    hours: null, best: "tarde",
    desc: "Pueblo de pescadores convertido en puerto de salida a Saona y Catalina, con playa propia.",
    tip: "La Playa de Bayahíbe y la Playa Dominicus están a diez minutos una de otra. Es el centro del buceo del país.",
    tags: ["buceo", "base", "comida-cerca"]
  },
  {
    id: "basilica-higuey", name: "Basílica de Higüey", province: "La Altagracia", town: "Higüey",
    lat: 18.6153, lng: -68.7078, type: "cultura", dwell: 45, price: 0,
    hours: { from: "07:00", to: "19:00" }, best: "cualquiera",
    desc: "Arco de hormigón de 80 m que alberga a la Virgen de la Altagracia, patrona del país.",
    tip: "Parada natural si vas de Punta Cana a Samaná o a la capital. El 21 de enero es la gran peregrinación.",
    tags: ["parada", "arquitectura"]
  },
  {
    id: "playa-limon", name: "Playa Limón", province: "La Altagracia", town: "Miches",
    lat: 18.7764, lng: -68.6392, type: "playa", dwell: 150, price: 0,
    hours: null, best: "manana",
    desc: "Playa virgen de dos kilómetros con laguna y manglar detrás, entre Miches y Punta Cana.",
    tip: "Acceso por camino de tierra: mejor con 4x4 o después de días sin lluvia. No hay nada: lleva todo.",
    tags: ["virgen", "4x4", "sin-servicios"]
  },
  {
    id: "ojos-indigenas", name: "Reserva Ojos Indígenas", province: "La Altagracia", town: "Punta Cana",
    lat: 18.6567, lng: -68.4147, type: "naturaleza", dwell: 120, price: 25,
    hours: { from: "08:00", to: "17:00" }, best: "manana",
    desc: "Bosque de 600 hectáreas con doce lagunas de agua dulce, cinco de ellas abiertas al baño.",
    tip: "Lo más tranquilo y verde que hay en Punta Cana. Lleva repelente, hay mosquitos de verdad.",
    tags: ["banarse", "verde", "repelente"]
  },

  /* ---------- La Romana y San Pedro de Macorís ---------- */
  {
    id: "altos-de-chavon", name: "Altos de Chavón", province: "La Romana", town: "La Romana",
    lat: 18.4211, lng: -68.8733, type: "cultura", dwell: 120, price: 25, priceNote: "Acceso a Casa de Campo",
    hours: { from: "09:00", to: "21:00" }, best: "atardecer",
    desc: "Réplica de un pueblo mediterráneo del siglo XVI sobre el cañón del río Chavón, con anfiteatro de 5.000 plazas.",
    tip: "Sube al atardecer: la luz sobre el cañón es lo mejor del sitio. Mira la agenda del anfiteatro, dan conciertos grandes.",
    tags: ["fotos", "cena", "turistico"]
  },
  {
    id: "isla-catalina", name: "Isla Catalina", province: "La Romana", town: "La Romana",
    lat: 18.3481, lng: -68.9461, type: "excursion", dwell: 360, price: 70, priceNote: "Tour con almuerzo",
    hours: { from: "08:00", to: "16:00" }, best: "manana",
    desc: "Isla del Parque Nacional del Este con la pared de coral más famosa del país para bucear.",
    tip: "Menos concurrida que Saona. Si buceas, el Muro de Catalina es la inmersión que justifica el viaje.",
    tags: ["buceo", "dia-completo", "snorkel"]
  },
  {
    id: "cueva-maravillas", name: "Cueva de las Maravillas", province: "San Pedro de Macorís", town: "Boca de Soco",
    lat: 18.4333, lng: -69.4139, type: "cultura", dwell: 90, price: 7,
    hours: { from: "09:00", to: "17:00" }, best: "cualquiera",
    desc: "Cueva habilitada con pasarelas, ascensor y luz, con 500 pictografías taínas.",
    tip: "Cierra los lunes y no se puede entrar con cámara. La visita guiada dura 45 min y es cómoda para cualquier edad.",
    tags: ["familia", "cierra-lunes", "taino"]
  },
  {
    id: "juan-dolio", name: "Playa Juan Dolio", province: "San Pedro de Macorís", town: "Juan Dolio",
    lat: 18.4231, lng: -69.4000, type: "playa", dwell: 150, price: 0,
    hours: null, best: "tarde",
    desc: "Playa larga y tranquila a 45 minutos de la capital, protegida por arrecife.",
    tip: "La escapada de playa de los capitaleños. Guayacanes, al lado, tiene los mejores comedores de pescado.",
    tags: ["familia", "sin-olas", "comida-cerca"]
  },

  /* ---------- El Seibo y Hato Mayor ---------- */
  {
    id: "montana-redonda", name: "Montaña Redonda", province: "El Seibo", town: "Miches",
    lat: 18.9103, lng: -69.0189, type: "mirador", dwell: 90, price: 6, priceNote: "Camioneta hasta la cima RD$300",
    hours: { from: "08:00", to: "18:00" }, best: "atardecer",
    desc: "Cerro de 300 m con vistas de 360° a la laguna Redonda, la de Limón y el mar, con columpios al borde.",
    tip: "Puedes subir en tu carro solo si es alto; si no, hay camionetas abajo. A primera hora o al atardecer, que no hay sombra.",
    tags: ["fotos", "columpios", "vistas"]
  },
  {
    id: "playa-esmeralda-miches", name: "Playa Esmeralda", province: "El Seibo", town: "Miches",
    lat: 18.9433, lng: -69.0078, type: "playa", dwell: 120, price: 0,
    hours: null, best: "manana",
    desc: "Bahía protegida por un arrecife a flor de agua, con piscina natural sin olas.",
    tip: "Se llega por un camino de tierra desde la carretera de Miches. Un par de comedores y nada más.",
    tags: ["virgen", "sin-olas", "4x4"]
  },
  {
    id: "salto-la-jalda", name: "Salto de la Jalda", province: "El Seibo", town: "Miches",
    lat: 18.8336, lng: -69.1511, type: "cascada", dwell: 360, price: 30, priceNote: "Guía obligatorio",
    hours: { from: "07:00", to: "15:00" }, best: "manana",
    desc: "La cascada más alta del Caribe, 120 m, al final de una caminata de 8 km por la Cordillera Oriental.",
    tip: "Son 5–6 horas de ida y vuelta, a pie o a caballo. Solo con guía de la comunidad y saliendo de madrugada.",
    tags: ["dia-completo", "duro", "caballo"]
  },
  {
    id: "cueva-fun-fun", name: "Cueva Fun Fun", province: "Hato Mayor", town: "Hato Mayor del Rey",
    lat: 18.8456, lng: -69.3403, type: "aventura", dwell: 420, price: 110, priceNote: "Tour completo con rápel",
    hours: { from: "08:00", to: "16:00" }, best: "manana",
    desc: "Caverna gigante en la que se entra haciendo rápel de 20 m y se recorre caminando dentro del río.",
    tip: "Día completo y de verdad exigente: caballo, caminata y agua hasta el pecho. Solo con el operador autorizado.",
    tags: ["dia-completo", "adrenalina", "reservar"]
  }
];
