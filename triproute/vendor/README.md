# vendor/

Copias locales de librerías de terceros, para que la app funcione sin CDN y
sin conexión (importante en una PWA que se usa de viaje, con mala cobertura).

- `leaflet/` — Leaflet 1.9.4 (BSD-2-Clause), tal cual sale del paquete npm
  `leaflet@1.9.4` (`dist/leaflet.js`, `dist/leaflet.css` e `dist/images/`).

Para actualizar:

```bash
npm pack leaflet@<version>
tar xzf leaflet-<version>.tgz
cp package/dist/leaflet.js package/dist/leaflet.css vendor/leaflet/
cp package/dist/images/*.png vendor/leaflet/images/
```

Los tiles del mapa sí vienen de la red (CARTO sobre OpenStreetMap); sin conexión
el mapa se queda en gris, pero el resto de la app sigue funcionando.
