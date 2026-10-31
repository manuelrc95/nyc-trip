/* Service worker: la app completa queda disponible sin conexión.
   Los tiles del mapa y las llamadas a Google nunca se cachean. */

const VERSION = "triproute-v1";
const SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/app.css",
  "./css/print.css",
  "./js/main.js",
  "./js/store.js",
  "./js/util.js",
  "./js/geo.js",
  "./js/data/catalog.js",
  "./js/data/places/index.js",
  "./js/data/places/norte.js",
  "./js/data/places/este.js",
  "./js/data/places/sur.js",
  "./js/data/places/centro.js",
  "./js/data/places/capital.js",
  "./js/services/config.js",
  "./js/services/travel.js",
  "./js/services/places-api.js",
  "./js/services/map/provider.js",
  "./js/services/map/leaflet.js",
  "./js/services/map/google.js",
  "./js/core/planner.js",
  "./js/core/schedule.js",
  "./js/core/budget.js",
  "./js/core/exporters.js",
  "./js/ui/tabs.js",
  "./js/ui/toast.js",
  "./js/ui/modal.js",
  "./js/ui/dragsort.js",
  "./js/ui/map-host.js",
  "./js/ui/place-sheet.js",
  "./js/ui/views/trip.js",
  "./js/ui/views/explore.js",
  "./js/ui/views/itinerary.js",
  "./js/ui/views/budget.js",
  "./js/ui/views/summary.js",
  "./js/ui/views/settings.js",
  "./icons/icon.svg",
  "./icons/icon-180.png",
  "./icons/icon-192.png",
  "./vendor/leaflet/leaflet.js",
  "./vendor/leaflet/leaflet.css",
  "./icons/icon-512.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(VERSION)
      // addAll falla entero si un recurso falla: se añaden de uno en uno.
      .then((c) => Promise.allSettled(SHELL.map((url) => c.add(new Request(url, { cache: "reload" })))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const { request } = e;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  const isApi = /googleapis\.com$/.test(url.hostname) || /cartocdn\.com$/.test(url.hostname) || /tile\.openstreetmap\.org$/.test(url.hostname);
  if (isApi) return;   // mapa y APIs siempre a la red

  e.respondWith(
    caches.match(request).then((hit) => {
      if (hit) {
        // Revalidación en segundo plano: rápido ahora, actualizado la próxima vez.
        fetch(request).then((res) => {
          if (res && res.ok) caches.open(VERSION).then((c) => c.put(request, res));
        }).catch(() => {});
        return hit;
      }
      return fetch(request)
        .then((res) => {
          if (res && res.ok && url.origin === location.origin) {
            const copy = res.clone();
            caches.open(VERSION).then((c) => c.put(request, copy));
          }
          return res;
        })
        .catch(() => caches.match("./index.html"));
    })
  );
});
