/* Gran Santo Domingo: Distrito Nacional y provincia Santo Domingo.
   Coordenadas aproximadas (ver _schema.md). */

export default [
  {
    id: "zona-colonial", name: "Zona Colonial", province: "Distrito Nacional", town: "Santo Domingo",
    lat: 18.4731, lng: -69.8832, type: "cultura", dwell: 180, price: 0,
    hours: null, best: "tarde",
    desc: "La primera ciudad europea de América, Patrimonio de la Humanidad: calles de piedra, plazas y 500 años de historia.",
    tip: "Empieza en el Parque Colón, baja la Calle El Conde y termina en la Plaza España al atardecer. Todo se hace andando.",
    tags: ["andando", "clasico", "comida-cerca"]
  },
  {
    id: "catedral-primada", name: "Catedral Primada de América", province: "Distrito Nacional", town: "Santo Domingo",
    lat: 18.4723, lng: -69.8835, type: "cultura", dwell: 45, price: 3,
    hours: { from: "09:00", to: "16:30" }, best: "cualquiera",
    desc: "La catedral más antigua de América, consagrada en 1541, frente al Parque Colón.",
    tip: "Cierra al mediodía los domingos por misa. Pide la audioguía, está incluida en la entrada.",
    tags: ["historia", "centro"]
  },
  {
    id: "alcazar-de-colon", name: "Alcázar de Colón", province: "Distrito Nacional", town: "Santo Domingo",
    lat: 18.4772, lng: -69.8827, type: "cultura", dwell: 60, price: 5,
    hours: { from: "09:00", to: "17:00" }, best: "cualquiera",
    desc: "El palacio de Diego Colón, de 1514, hoy museo con mobiliario de la época.",
    tip: "Está en la Plaza España, con las terrazas de la Calle La Atarazana al lado. Visita el palacio y cena ahí mismo.",
    tags: ["museo", "comida-cerca", "centro"]
  },
  {
    id: "fortaleza-ozama", name: "Fortaleza Ozama", province: "Distrito Nacional", town: "Santo Domingo",
    lat: 18.4697, lng: -69.8808, type: "cultura", dwell: 50, price: 3,
    hours: { from: "09:00", to: "17:00" }, best: "manana",
    desc: "La fortificación militar más antigua de América, de 1502, con la Torre del Homenaje sobre el río Ozama.",
    tip: "Sube a la torre: desde arriba se ve el río, el puerto y toda la Zona Colonial.",
    tags: ["vistas", "historia", "centro"]
  },
  {
    id: "los-tres-ojos", name: "Los Tres Ojos", province: "Santo Domingo", town: "Santo Domingo Este",
    lat: 18.4780, lng: -69.8294, type: "naturaleza", dwell: 90, price: 4, priceNote: "Balsa aparte RD$25",
    hours: { from: "08:30", to: "17:00" }, best: "manana",
    desc: "Cuatro lagos subterráneos de agua dulce en una caverna abierta, dentro del Parque Mirador del Este.",
    tip: "Son cuatro ojos, no tres. Al cuarto se llega en una balsa tirada a mano que se paga aparte y vale la pena.",
    tags: ["familia", "cueva", "cerca-capital"]
  },
  {
    id: "faro-a-colon", name: "Faro a Colón", province: "Santo Domingo", town: "Santo Domingo Este",
    lat: 18.4762, lng: -69.8361, type: "cultura", dwell: 60, price: 2,
    hours: { from: "09:00", to: "16:30" }, best: "cualquiera",
    desc: "Monumento de hormigón en forma de cruz tumbada, de 210 m de largo, que guarda los supuestos restos de Colón.",
    tip: "Cierra los lunes. La escala del edificio por dentro es lo que impresiona; los museos laterales son irregulares.",
    tags: ["cierra-lunes", "arquitectura"]
  },
  {
    id: "malecon-sd", name: "Malecón de Santo Domingo", province: "Distrito Nacional", town: "Santo Domingo",
    lat: 18.4608, lng: -69.9000, type: "noche", dwell: 90, price: 0,
    hours: null, best: "atardecer",
    desc: "Catorce kilómetros de avenida junto al Caribe, con el obelisco y la vida nocturna de la ciudad.",
    tip: "Al atardecer se llena de gente corriendo y de música. Los domingos cierran un tramo al tráfico.",
    tags: ["atardecer", "noche", "paseo"]
  },
  {
    id: "jardin-botanico-sd", name: "Jardín Botánico Nacional", province: "Distrito Nacional", town: "Santo Domingo",
    lat: 18.5019, lng: -69.9511, type: "naturaleza", dwell: 120, price: 3, priceNote: "Trenecito incluido",
    hours: { from: "09:00", to: "17:00" }, best: "manana",
    desc: "Dos kilómetros cuadrados de jardines en medio de la ciudad, con el mayor jardín japonés del Caribe.",
    tip: "El trenecito da la vuelta completa en 35 min y está incluido. Perfecto con niños o con calor.",
    tags: ["familia", "verde", "cerca-capital"]
  },
  {
    id: "acuario-nacional", name: "Acuario Nacional", province: "Santo Domingo", town: "Santo Domingo Este",
    lat: 18.4651, lng: -69.8321, type: "naturaleza", dwell: 90, price: 3,
    hours: { from: "09:30", to: "17:30" }, best: "cualquiera",
    desc: "Acuario con un túnel de cristal por debajo del tanque principal y manatíes rescatados.",
    tip: "Cierra los lunes. Modesto pero muy querido por los niños; se ve en hora y media.",
    tags: ["familia", "cierra-lunes"]
  },
  {
    id: "plaza-cultura", name: "Plaza de la Cultura", province: "Distrito Nacional", town: "Santo Domingo",
    lat: 18.4728, lng: -69.9122, type: "cultura", dwell: 120, price: 3,
    hours: { from: "09:00", to: "17:00" }, best: "cualquiera",
    desc: "Cuatro museos nacionales y el Teatro Nacional en un mismo recinto arbolado.",
    tip: "El Museo del Hombre Dominicano es el que explica de verdad la isla: taínos, colonia y vudú dominicano. Cierran los lunes.",
    tags: ["museo", "cierra-lunes"]
  },
  {
    id: "mercado-modelo", name: "Mercado Modelo", province: "Distrito Nacional", town: "Santo Domingo",
    lat: 18.4761, lng: -69.8875, type: "compras", dwell: 60, price: 0,
    hours: { from: "08:00", to: "17:00" }, best: "manana",
    desc: "Mercado de artesanía, ámbar, larimar, tabaco y mamajuana en el borde de la Zona Colonial.",
    tip: "Se regatea siempre: empieza por la mitad de lo que pidan. Ojo con el ámbar falso, pide factura en las tiendas serias.",
    tags: ["compras", "regatear"]
  },
  {
    id: "parque-mirador-sur", name: "Parque Mirador Sur", province: "Distrito Nacional", town: "Santo Domingo",
    lat: 18.4428, lng: -69.9461, type: "naturaleza", dwell: 60, price: 0,
    hours: { from: "06:00", to: "20:00" }, best: "atardecer",
    desc: "Siete kilómetros de parque sobre un acantilado de roca caliza, con cuevas y ceibas enormes.",
    tip: "Cierran la avenida al tráfico de 6:00 a 9:00 y de 17:00 a 20:00: es cuando la ciudad entera viene a caminar.",
    tags: ["paseo", "verde", "atardecer"]
  },
  {
    id: "boca-chica", name: "Playa Boca Chica", province: "Santo Domingo", town: "Boca Chica",
    lat: 18.4506, lng: -69.6097, type: "playa", dwell: 150, price: 0,
    hours: null, best: "manana",
    desc: "Laguna de agua turquesa y poca profundidad protegida por un arrecife, a 30 km de la capital.",
    tip: "La playa de la capital: entre semana tranquila, los domingos imposible. Se puede caminar hasta la isla La Matica.",
    tags: ["familia", "sin-olas", "cerca-capital"]
  }
];
