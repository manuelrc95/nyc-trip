/* Datos del viaje. Editar aquí para cambiar el itinerario. */

const TRIP = {
  title: "NYC",
  subtitle: "Manuel & Manu · 15–19 octubre 2026",
  hotel: {
    name: "DoubleTree by Hilton New York Chelsea",
    address: "128 W 29th St, New York, NY 10001",
    maps: "DoubleTree by Hilton Hotel New York Chelsea, 128 W 29th St"
  },
  sunset: "18:12",
  essentials: [
    {
      icon: "metro",
      title: "Metro — OMNY",
      body: "Tocas el móvil o la tarjeta contactless directamente en el torno. No hace falta comprar MetroCard. $2.90 por viaje, y a partir del viaje 12 en una semana el resto son gratis."
    },
    {
      icon: "plane",
      title: "Ir al JFK",
      body: "Metro hasta Jamaica Station + AirTrain. Menos de $12. Calcula 90 minutos desde Chelsea, no 45. En taxi o Uber son 45–60 min y unos $80."
    },
    {
      icon: "phone",
      title: "Apps que vas a usar",
      body: "Citymapper para el metro (mucho mejor que Google Maps aquí). TodayTix para Broadway de última hora. Passio GO para el bus gratuito del centro. Flush para encontrar baños."
    },
    {
      icon: "coat",
      title: "Tiempo en octubre",
      body: "Unos 18°C de día y 11°C de noche. Chaqueta ligera imprescindible para las noches. El sol se pone sobre las 18:12 todos estos días."
    }
  ],
  flights: [
    { who: "Manu", when: "Lunes 19, 09:30", from: "JFK", leave: "Sale del hotel a las 6:00 (metro) o 6:30 (Uber)" },
    { who: "Manuel", when: "Lunes 19, 17:00", from: "JFK", leave: "Sale del hotel a las 12:30" }
  ],
  days: [
    {
      id: "jue",
      label: "Jue 15",
      date: "2026-10-15",
      title: "Chelsea y la primera noche",
      note: "Llegas con maletas desde el YMCA. Lo primero es soltarlas en el hotel.",
      stops: [
        {
          time: "10:30", cat: "logistica", cost: "free",
          title: "Dejar las maletas en el hotel",
          desc: "Tren 1 desde 66th St–Lincoln Center hasta 28th St. Te las guardan gratis en recepción aunque el check-in sea a las 4. Es lo que te libera el día entero.",
          address: "128 W 29th St",
          coords: [40.7470, -73.9900],
          maps: "DoubleTree by Hilton Hotel New York Chelsea, 128 W 29th St"
        },
        {
          time: "11:30", cat: "vista", cost: "free",
          title: "Hudson Yards y el Vessel",
          desc: "Quince minutos andando al oeste. El Vessel por fuera es muy fotogénico. El mirador Edge se paga, así que lo saltamos.",
          address: "20 Hudson Yards",
          coords: [40.7540, -74.0014],
          maps: "Vessel Hudson Yards New York"
        },
        {
          time: "12:00", cat: "paseo", cost: "free",
          title: "La High Line entera",
          desc: "Un parque construido sobre vías de tren elevadas, atraviesa Chelsea por encima de la calle. Bájala de la 30 a la 14. Una hora tranquila y en octubre está preciosa.",
          address: "De W 30th St a Gansevoort St",
          coords: [40.7479, -74.0048],
          maps: "The High Line New York"
        },
        {
          time: "13:00", cat: "comida", cost: "cheap",
          title: "Comer en Chelsea Market",
          desc: "Mercado cubierto al final de la High Line. Los Tacos No. 1 es lo más rico por lo que cuesta. Unos $15 por cabeza.",
          address: "75 9th Ave",
          coords: [40.7424, -74.0061],
          maps: "Chelsea Market, 75 9th Ave New York"
        },
        {
          time: "14:00", cat: "vista", cost: "free",
          title: "Little Island",
          desc: "Parque flotante sobre el río Hudson, a cinco minutos del mercado. Gratis y con muy buenas vistas al agua. Lo tenías guardado en tus reels.",
          address: "Pier 55, Hudson River Park",
          coords: [40.7420, -74.0105],
          maps: "Little Island at Pier 55 New York"
        },
        {
          time: "16:00", cat: "logistica", cost: "free",
          title: "Check-in en el DoubleTree",
          desc: "Vuelves andando desde el río, son veinte minutos. Manu llega sobre las cinco.",
          address: "128 W 29th St",
          coords: [40.7470, -73.9900],
          maps: "DoubleTree by Hilton Hotel New York Chelsea, 128 W 29th St"
        },
        {
          time: "18:30", cat: "comida", cost: "cheap",
          title: "Cena en Koreatown",
          desc: "La calle 32 entre la 5ª y Broadway, a cinco minutos del hotel. Carteles de neón, sitios abiertos hasta tarde y lleno de gente joven. Unos $20.",
          address: "W 32nd St",
          coords: [40.7478, -73.9870],
          maps: "Koreatown W 32nd St New York"
        },
        {
          time: "20:00", cat: "compras", cost: "mid",
          title: "Apple de la Quinta Avenida",
          desc: "El cubo de cristal. Abre 24 horas y de noche iluminado es mucho mejor foto que de día. Aquí compráis lo que queráis.",
          address: "767 5th Ave",
          coords: [40.7638, -73.9729],
          maps: "Apple Fifth Avenue, 767 5th Ave New York",
          link: "https://www.apple.com/retail/fifthavenue/"
        },
        {
          time: "21:00", cat: "noche", cost: "free",
          title: "Times Square de noche",
          desc: "Diez minutos andando desde el Apple. La primera vez en Nueva York hay que verla de noche, aunque solo sea una vez.",
          address: "Times Square",
          coords: [40.7580, -73.9855],
          maps: "Times Square New York"
        },
        {
          time: "21:30", cat: "vista", cost: "free",
          title: "Rooftop gratuito de la 52",
          desc: "De uno de tus reels guardados. Vistas sin pagar, a dos manzanas de Times Square.",
          address: "226 W 52nd St",
          coords: [40.7625, -73.9840],
          maps: "226 W 52nd St New York",
          warn: "Sin confirmar: comprueba al llegar que sigue siendo accesible y gratis."
        }
      ]
    },
    {
      id: "vie",
      label: "Vie 16",
      date: "2026-10-16",
      title: "Cumpleaños de Manu",
      note: "Katz's primero, Burlington después y el atardecer en el ferry. La cena es el plan fuerte del día.",
      stops: [
        {
          time: "10:30", cat: "comida", cost: "mid",
          title: "Katz's Delicatessen",
          desc: "Tren F desde 23rd St hasta 2nd Ave, diez minutos. El pastrami que tenías guardado. Al entrar te dan un ticket: no lo pierdas, se paga al salir. Unos $30.",
          address: "205 E Houston St",
          coords: [40.7223, -73.9874],
          maps: "Katz's Delicatessen, 205 E Houston St New York",
          link: "https://katzsdelicatessen.com/"
        },
        {
          time: "12:30", cat: "compras", cost: "mid",
          title: "Burlington",
          desc: "Vuelves en el F hasta 23rd St. Está a la altura de la 23 con la 6ª avenida. Aquí es donde compráis la ropa.",
          address: "707 6th Ave",
          coords: [40.7437, -73.9924],
          maps: "Burlington, 707 6th Ave New York",
          warn: "Confirma el horario antes de ir."
        },
        {
          time: "14:30", cat: "logistica", cost: "free",
          title: "Dejar las bolsas en el hotel",
          desc: "Diez minutos andando desde Burlington. No bajes al centro cargado.",
          address: "128 W 29th St",
          coords: [40.7470, -73.9900],
          maps: "DoubleTree by Hilton Hotel New York Chelsea, 128 W 29th St"
        },
        {
          time: "15:45", cat: "paseo", cost: "free",
          title: "Downtown Connection",
          desc: "El autobús rojo gratuito del bajo Manhattan. Descarga Passio GO para ver por dónde va. Enlaza Wall Street, el Toro, el Oculus y Battery Park sin pagar nada.",
          address: "Lower Manhattan",
          coords: [40.7075, -74.0113],
          maps: "Downtown Connection bus Lower Manhattan"
        },
        {
          time: "16:15", cat: "vista", cost: "free",
          title: "Charging Bull y Wall Street",
          desc: "El toro de bronce, la bolsa y el Oculus, esa estación blanca que parece un esqueleto. Todo junto y todo gratis.",
          address: "Bowling Green",
          coords: [40.7056, -74.0134],
          maps: "Charging Bull Bowling Green New York"
        },
        {
          time: "16:45", cat: "vista", cost: "free",
          title: "The Elevated Acre",
          desc: "Un jardín escondido encima de un edificio de oficinas. Se sube por unas escaleras mecánicas desde la calle y casi ningún turista lo conoce. Estaba en tus reels.",
          address: "55 Water St",
          coords: [40.7033, -74.0090],
          maps: "Elevated Acre, 55 Water St New York"
        },
        {
          time: "17:30", cat: "vista", cost: "free",
          title: "Staten Island Ferry al atardecer",
          desc: "Gratis, sale cada 15–30 minutos y pasa por delante de la Estatua de la Libertad justo con el sol poniéndose. El mejor plan gratis de la ciudad y perfecto para un cumpleaños. Ponte en el lado derecho al salir.",
          address: "Whitehall Terminal, 4 South St",
          coords: [40.7013, -74.0134],
          maps: "Staten Island Ferry Whitehall Terminal New York",
          warn: "Cuidado con los vendedores de la entrada que fingen vender el tour oficial de la Estatua. El ferry es gratis y no tiene ticket."
        },
        {
          time: "19:30", cat: "comida", cost: "cheap",
          title: "Cena de cumpleaños en Chinatown",
          desc: "Quince minutos andando desde el ferry. Joe's Shanghai por los soup dumplings, o Great NY Noodletown si está lleno. Coméis de sobra por 25 por cabeza y la calle de noche con los letreros encendidos es de las más fotogénicas de la ciudad.",
          address: "46 Bowery",
          coords: [40.7156, -73.9966],
          maps: "Joe's Shanghai, 46 Bowery New York"
        },
        {
          time: "21:30", cat: "noche", cost: "mid",
          title: "Lower East Side",
          desc: "Las calles Ludlow y Orchard son donde sale la gente joven los viernes. Pianos tiene música en vivo y la entrada es barata.",
          address: "158 Ludlow St",
          coords: [40.7212, -73.9876],
          maps: "Pianos, 158 Ludlow St New York"
        }
      ]
    },
    {
      id: "sab",
      label: "Sáb 17",
      date: "2026-10-17",
      title: "Brooklyn entero",
      note: "El día más bonito del fin de semana. Mucho andar, así que zapatillas cómodas.",
      stops: [
        {
          time: "10:30", cat: "vista", cost: "free",
          title: "Washington Street, DUMBO",
          desc: "Tren F hasta York St. Aquí está la foto del puente de Manhattan encajado entre dos edificios de ladrillo. Es la postal de Nueva York y no cuesta nada. Ve pronto, que a mediodía hay cola para hacerla.",
          address: "Washington St con Water St",
          coords: [40.7033, -73.9894],
          maps: "Washington Street Dumbo Brooklyn"
        },
        {
          time: "11:45", cat: "paseo", cost: "free",
          title: "Brooklyn Bridge Park",
          desc: "Bajas al río y tienes el skyline de Manhattan enfrente. El carrusel antiguo acristalado está aquí mismo.",
          address: "Brooklyn Bridge Park",
          coords: [40.7033, -73.9956],
          maps: "Brooklyn Bridge Park Brooklyn"
        },
        {
          time: "13:00", cat: "paseo", cost: "free",
          title: "Cruzar el puente de Brooklyn a pie",
          desc: "Hazlo en este sentido, de Brooklyn hacia Manhattan, porque así tienes el skyline de frente todo el rato en vez de a la espalda. Son unos 40 minutos sin prisa.",
          address: "Brooklyn Bridge",
          coords: [40.7061, -73.9969],
          maps: "Brooklyn Bridge pedestrian entrance Brooklyn"
        },
        {
          time: "16:00", cat: "comida", cost: "cheap",
          title: "Smorgasburg en Williamsburg",
          desc: "Mercado de comida callejera al aire libre, decenas de puestos. Ambiente joven y se come barato.",
          address: "Marsha P. Johnson State Park",
          coords: [40.7208, -73.9646],
          maps: "Smorgasburg Williamsburg Marsha P Johnson State Park",
          link: "https://www.smorgasburg.com/",
          warn: "Confirma en su web que abre ese sábado: la temporada al aire libre termina por estas fechas."
        },
        {
          time: "19:00", cat: "noche", cost: "mid",
          title: "Radegast Hall",
          desc: "Cervecería alemana con mesas largas compartidas y música. Buen sitio para empezar la noche sin gastar mucho.",
          address: "113 N 3rd St",
          coords: [40.7174, -73.9623],
          maps: "Radegast Hall & Biergarten, 113 N 3rd St Brooklyn"
        },
        {
          time: "21:30", cat: "noche", cost: "mid",
          title: "Baby's All Right",
          desc: "Sala de conciertos pequeña con música en vivo casi todas las noches. Es de los sitios con mejor ambiente joven de Williamsburg. Mira la cartelera antes y saca entrada si toca alguien.",
          address: "146 Broadway, Brooklyn",
          coords: [40.7100, -73.9650],
          maps: "Baby's All Right, 146 Broadway Brooklyn",
          link: "https://babysallright.com/"
        }
      ]
    },
    {
      id: "dom",
      label: "Dom 18",
      date: "2026-10-18",
      title: "Central Park, SoHo y el teleférico",
      note: "Noche tranquila: Manu se levanta a las cinco y media.",
      stops: [
        {
          time: "10:30", cat: "paseo", cost: "free",
          title: "Bethesda Terrace, Central Park",
          desc: "Entra por la calle 72. Es la terraza con la fuente y los arcos de azulejos, el rincón más fotografiado del parque. A mediados de octubre los árboles están cambiando de color.",
          address: "Central Park, altura de la 72",
          coords: [40.7740, -73.9709],
          maps: "Bethesda Terrace Central Park New York"
        },
        {
          time: "11:30", cat: "paseo", cost: "free",
          title: "Bow Bridge",
          desc: "El puente de hierro sobre el lago, a cinco minutos de la terraza. La foto clásica del parque con los edificios detrás.",
          address: "Central Park",
          coords: [40.7757, -73.9722],
          maps: "Bow Bridge Central Park New York"
        },
        {
          time: "13:00", cat: "paseo", cost: "free",
          title: "SoHo: Greene y Mercer",
          desc: "Las calles adoquinadas con los edificios de hierro fundido y las escaleras de incendios en la fachada. Es el barrio más bonito para pasear sin gastar nada, y está lleno de tiendas si os pica.",
          address: "Greene St con Spring St",
          coords: [40.7233, -74.0020],
          maps: "Greene Street Soho New York"
        },
        {
          time: "14:30", cat: "paseo", cost: "free",
          title: "Washington Square Park",
          desc: "El arco, los músicos tocando y los estudiantes de NYU. Plan dominguero perfecto y a veinte minutos andando de SoHo.",
          address: "Washington Square",
          coords: [40.7308, -73.9973],
          maps: "Washington Square Park New York"
        },
        {
          time: "17:45", cat: "vista", cost: "cheap",
          title: "Teleférico de Roosevelt Island",
          desc: "Sale de Tramway Plaza, en la calle 60 con la 2ª avenida. Cuesta lo mismo que el metro y pagas con el móvil. Cruzas volando por encima del East River: es el mejor dinero que vas a gastar en todo el viaje. Ve a esta hora para pillar la luz.",
          address: "E 59th St con 2nd Ave",
          coords: [40.7614, -73.9640],
          maps: "Roosevelt Island Tramway Plaza E 59th St New York"
        },
        {
          time: "19:30", cat: "comida", cost: "cheap",
          title: "Última cena cerca del hotel",
          desc: "Vuelve a Koreatown o al Flatiron, los dos a diez minutos. Cena tranquila y a dormir pronto.",
          address: "Chelsea / Flatiron",
          coords: [40.7411, -73.9897],
          maps: "Flatiron Building New York"
        }
      ]
    },
    {
      id: "lun",
      label: "Lun 19",
      date: "2026-10-19",
      title: "Vuelta a casa",
      note: "Manu madruga y Manuel tiene la mañana libre.",
      stops: [
        {
          time: "06:00", cat: "logistica", cost: "mid",
          title: "Manu sale hacia el JFK",
          desc: "Vuelo a las 9:30, hay que estar en la terminal a las 7:30. En metro más AirTrain son 90 minutos, así que sale a las 6:00. En Uber son 45 minutos y unos $80, y entonces puede salir a las 6:30. Si el vuelo es internacional, resta una hora a todo.",
          address: "JFK",
          coords: [40.6413, -73.7781],
          maps: "John F Kennedy International Airport"
        },
        {
          time: "11:00", cat: "logistica", cost: "free",
          title: "Manuel: checkout y maletas en recepción",
          desc: "Dejas la maleta guardada en el hotel y te queda hora y media libre.",
          address: "128 W 29th St",
          coords: [40.7470, -73.9900],
          maps: "DoubleTree by Hilton Hotel New York Chelsea, 128 W 29th St"
        },
        {
          time: "11:20", cat: "vista", cost: "free",
          title: "Grand Central y la Biblioteca Pública",
          desc: "Tres paradas de metro. El techo de estrellas de Grand Central y, a cinco minutos andando, la sala de lectura de la biblioteca en Bryant Park. Los dos gratis y los dos estaban en tus reels. Es el último sitio que te falta por ver.",
          address: "89 E 42nd St",
          coords: [40.7527, -73.9772],
          maps: "Grand Central Terminal New York"
        },
        {
          time: "12:30", cat: "logistica", cost: "mid",
          title: "Manuel sale hacia el JFK",
          desc: "Recoges la maleta y te vas. Vuelo a las 17:00, en la terminal sobre las 14:00. Metro hasta Jamaica Station y AirTrain, menos de $12.",
          address: "JFK",
          coords: [40.6413, -73.7781],
          maps: "John F Kennedy International Airport"
        }
      ]
    }
  ]
};

const CATS = {
  vista:     { label: "Vistas",     color: "#f5a524" },
  comida:    { label: "Comida",     color: "#f3503c" },
  paseo:     { label: "Paseo",      color: "#34c98a" },
  compras:   { label: "Compras",    color: "#a97bf0" },
  noche:     { label: "Noche",      color: "#4d9dff" },
  logistica: { label: "Logística",  color: "#8b94a7" }
};

const COSTS = {
  free:  { label: "Gratis", cls: "free" },
  cheap: { label: "Barato", cls: "cheap" },
  mid:   { label: "$$",     cls: "mid" }
};
