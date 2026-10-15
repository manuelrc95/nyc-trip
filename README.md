# NYC — Manu Rodriguez & Manu Acosta

Itinerario interactivo para el viaje a Nueva York del 15 al 19 de octubre de 2026.

Web estática, sin dependencias que instalar. Mapa con [Leaflet](https://leafletjs.com/) y tiles de CARTO sobre OpenStreetMap.

## Qué hace

- Itinerario día a día, con horas, direcciones y qué cuesta cada cosa.
- Mapa interactivo: al pulsar una parada el mapa vuela hasta ella, y al pulsar un pin se resalta la tarjeta.
- Botón de *Cómo llegar* en cada parada, que abre Google Maps.
- Casillas para ir tachando lo hecho. Se guarda en el navegador, así que cada móvil lleva su propia cuenta.
- El día de hoy se selecciona solo al abrir la web.

## Ver en local

```bash
python3 -m http.server 4173
```

Y abrir <http://localhost:4173>.

## Cambiar el itinerario

Todo el contenido está en [`js/data.js`](js/data.js). Cada parada lleva hora, categoría, coste, coordenadas y el texto que se busca en Google Maps. No hace falta tocar el HTML ni el JavaScript para añadir o mover paradas.
