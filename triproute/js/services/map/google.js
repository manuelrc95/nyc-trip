/* Implementación del mapa con Google Maps JavaScript API.
   Misma interfaz que la de Leaflet, así que el resto de la app no cambia. */

import { loadGoogleMaps, settings } from "../config.js";

export async function createGoogleMap(container, { center, zoom }) {
  const maps = await loadGoogleMaps();
  const mapId = (settings().googleMapId || "").trim();

  const map = new maps.Map(container, {
    center: { lat: center.lat, lng: center.lng },
    zoom,
    mapId: mapId || undefined,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    gestureHandling: "greedy",
    clickableIcons: false
  });

  const useAdvanced = !!mapId && !!maps.marker?.AdvancedMarkerElement;
  let markers = new Map();
  let route = null;
  const handlers = { marker: null, map: null };

  map.addListener("click", (e) => {
    if (handlers.map && e.latLng) handlers.map({ lat: e.latLng.lat(), lng: e.latLng.lng() });
  });

  function makePin(item) {
    const node = document.createElement("div");
    node.className = ["tr-pin", item.active ? "is-active" : "", item.dim ? "is-dim" : "", item.picked ? "is-picked" : ""].join(" ");
    node.style.setProperty("--pin", item.color || "#0ea5e9");
    node.innerHTML = `<span>${item.label == null ? "" : item.label}</span>`;
    return node;
  }

  function create(item) {
    if (useAdvanced) {
      const marker = new maps.marker.AdvancedMarkerElement({
        map, position: { lat: item.lat, lng: item.lng }, content: makePin(item), title: item.title || ""
      });
      marker.addListener("click", () => handlers.marker && handlers.marker(item.id));
      return marker;
    }
    const marker = new maps.Marker({
      map, position: { lat: item.lat, lng: item.lng }, title: item.title || "",
      label: item.label == null ? undefined : { text: String(item.label), color: "#fff", fontSize: "12px", fontWeight: "700" },
      icon: {
        path: maps.SymbolPath.CIRCLE,
        scale: item.active ? 15 : 12,
        fillColor: item.color || "#0ea5e9",
        fillOpacity: item.dim ? 0.45 : 1,
        strokeColor: "#fff",
        strokeWeight: 2
      }
    });
    marker.addListener("click", () => handlers.marker && handlers.marker(item.id));
    return marker;
  }

  return {
    provider: "google",
    raw: map,

    setMarkers(items) {
      // Google no deja mutar el contenido tan barato como Leaflet: se recrea.
      for (const m of markers.values()) {
        if (useAdvanced) m.map = null; else m.setMap(null);
      }
      markers = new Map();
      for (const item of items) markers.set(item.id, create(item));
    },

    setRoute(points) {
      if (route) { route.setMap(null); route = null; }
      if (!points || points.length < 2) return;
      route = new maps.Polyline({
        map,
        path: points.map((p) => ({ lat: p.lat, lng: p.lng })),
        strokeColor: "#0ea5e9",
        strokeOpacity: 0,
        icons: [{
          icon: { path: "M 0,-1 0,1", strokeOpacity: 0.8, strokeColor: "#0ea5e9", strokeWeight: 4, scale: 2 },
          offset: "0", repeat: "14px"
        }]
      });
    },

    focus(lat, lng, z = 14) {
      map.panTo({ lat, lng });
      map.setZoom(z);
    },

    fitTo(points) {
      if (!points || !points.length) return;
      if (points.length === 1) {
        map.setCenter({ lat: points[0].lat, lng: points[0].lng });
        map.setZoom(13);
        return;
      }
      const b = new maps.LatLngBounds();
      points.forEach((p) => b.extend({ lat: p.lat, lng: p.lng }));
      map.fitBounds(b, 48);
    },

    onMarkerClick(cb) { handlers.marker = cb; },
    onMapClick(cb) { handlers.map = cb; },
    invalidateSize() { maps.event.trigger(map, "resize"); },
    destroy() { this.setMarkers([]); container.innerHTML = ""; }
  };
}
