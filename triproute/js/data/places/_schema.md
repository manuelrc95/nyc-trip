# Cómo añadir lugares

Cada archivo de esta carpeta exporta un array de lugares. Para añadir uno nuevo basta
con copiar un bloque y cambiar los datos. No hay que tocar nada más del código.

```js
{
  id: "playa-caleton",            // único en toda la app, sin espacios ni tildes
  name: "Playa Caletón",
  province: "María Trinidad Sánchez",
  town: "Río San Juan",           // municipio o zona, opcional
  lat: 19.6389, lng: -70.0686,    // aproximadas; se pueden corregir con el botón "Ajustar GPS"
  type: "playa",                  // ver js/data/catalog.js → TYPES
  dwell: 120,                     // minutos de visita recomendados
  price: 0,                       // USD por persona (0 = gratis)
  priceNote: "Parqueo RD$100",    // opcional
  hours: null,                    // null = todo el día, o { from: "08:00", to: "17:00" }
  best: "manana",                 // manana | tarde | atardecer | noche | cualquiera
  desc: "Una frase corta de qué es.",
  tip: "El consejo que de verdad sirve estando allí.",
  tags: ["bano", "comida-cerca"]  // libres, se usan para buscar
}
```

Los precios y horarios son orientativos: en RD cambian a menudo. La app los trata como
estimaciones y permite sobreescribir la duración y el coste de cada parada en el itinerario.
