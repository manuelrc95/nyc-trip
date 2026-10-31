/* Capa de abstracción del mapa.
   La app habla siempre con esta interfaz; debajo puede estar Leaflet (sin clave)
   o Google Maps (con clave). Cambiar de uno a otro no toca ninguna vista.

   Interfaz:
     setMarkers(items)   items: { id, lat, lng, label, color, title, active, dim, picked }
     setRoute(points)    points: [{lat,lng}] o null
     focus(lat,lng,zoom) fitTo(points)
     onMarkerClick(cb)   onMapClick(cb)
     invalidateSize()    destroy()
*/

import { createLeafletMap } from "./leaflet.js";
import { createGoogleMap } from "./google.js";
import { googleMapsEnabled } from "../config.js";

export const RD_CENTER = { lat: 18.95, lng: -70.4 };

export async function createMap(container, { center = RD_CENTER, zoom = 8 } = {}) {
  if (googleMapsEnabled()) {
    try {
      return await createGoogleMap(container, { center, zoom });
    } catch (e) {
      console.warn("[TripRoute] Google Maps no disponible, se usa OpenStreetMap:", e.message);
      container.innerHTML = "";
    }
  }
  return createLeafletMap(container, { center, zoom });
}
