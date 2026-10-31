/* Implementación del mapa con Leaflet + OpenStreetMap. No necesita clave. */

const TILES = {
  url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> · &copy; <a href="https://carto.com/attributions">CARTO</a>',
  maxZoom: 19
};

export function createLeafletMap(container, { center, zoom }) {
  if (!window.L) throw new Error("Leaflet no está cargado");
  const L = window.L;

  const map = L.map(container, {
    zoomControl: true,
    scrollWheelZoom: false,
    tap: true,
    attributionControl: true
  }).setView([center.lat, center.lng], zoom);

  L.tileLayer(TILES.url, { attribution: TILES.attribution, maxZoom: TILES.maxZoom }).addTo(map);

  let markers = new Map();
  let route = null;
  const handlers = { marker: null, map: null };

  map.on("click", (e) => {
    if (handlers.map) handlers.map({ lat: e.latlng.lat, lng: e.latlng.lng });
  });

  function pinHtml(item) {
    const label = item.label == null ? "" : String(item.label);
    const cls = ["tr-pin", item.active ? "is-active" : "", item.dim ? "is-dim" : "", item.picked ? "is-picked" : ""].join(" ");
    return `<div class="${cls}" style="--pin:${item.color || "#0ea5e9"}"><span>${label}</span></div>`;
  }

  return {
    provider: "leaflet",
    raw: map,

    setMarkers(items) {
      const next = new Map();
      for (const item of items) {
        const existing = markers.get(item.id);
        const icon = L.divIcon({
          className: "",
          html: pinHtml(item),
          iconSize: [30, 30],
          iconAnchor: [15, 15],
          popupAnchor: [0, -14]
        });
        let m = existing;
        if (m) {
          m.setLatLng([item.lat, item.lng]);
          m.setIcon(icon);
        } else {
          m = L.marker([item.lat, item.lng], { icon, keyboard: false, title: item.title || "" });
          m.addTo(map);
          m.on("click", () => handlers.marker && handlers.marker(item.id));
        }
        m.setZIndexOffset(item.active ? 1000 : item.picked ? 500 : 0);
        next.set(item.id, m);
      }
      for (const [id, m] of markers) if (!next.has(id)) map.removeLayer(m);
      markers = next;
    },

    setRoute(points) {
      if (route) { map.removeLayer(route); route = null; }
      if (!points || points.length < 2) return;
      route = L.polyline(points.map((p) => [p.lat, p.lng]), {
        color: "#0ea5e9", weight: 4, opacity: 0.75, dashArray: "1 8", lineCap: "round"
      }).addTo(map);
    },

    focus(lat, lng, z = 14) {
      map.flyTo([lat, lng], z, { duration: 0.6 });
    },

    fitTo(points, pad = 0.22) {
      if (!points || !points.length) return;
      if (points.length === 1) return map.setView([points[0].lat, points[0].lng], 13);
      map.fitBounds(L.latLngBounds(points.map((p) => [p.lat, p.lng])).pad(pad));
    },

    onMarkerClick(cb) { handlers.marker = cb; },
    onMapClick(cb) { handlers.map = cb; },
    invalidateSize() { map.invalidateSize(); },
    destroy() { map.remove(); }
  };
}
