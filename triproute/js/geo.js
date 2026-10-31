/* Geometría sobre la esfera y utilidades de ruta. */

const R = 6371; // km

export function toRad(d) { return (d * Math.PI) / 180; }

/* Distancia en línea recta entre dos puntos {lat,lng}, en km. */
export function haversine(a, b) {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
}

export function centroid(points) {
  if (!points.length) return null;
  const lat = points.reduce((s, p) => s + p.lat, 0) / points.length;
  const lng = points.reduce((s, p) => s + p.lng, 0) / points.length;
  return { lat, lng };
}

export function bounds(points) {
  if (!points.length) return null;
  let n = -90, s = 90, e = -180, w = 180;
  for (const p of points) {
    n = Math.max(n, p.lat); s = Math.min(s, p.lat);
    e = Math.max(e, p.lng); w = Math.min(w, p.lng);
  }
  return { north: n, south: s, east: e, west: w };
}

/* Decodifica una polilínea codificada de Google (para dibujar rutas reales). */
export function decodePolyline(str) {
  const points = [];
  let index = 0, lat = 0, lng = 0;
  while (index < str.length) {
    let b, shift = 0, result = 0;
    do { b = str.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while (b >= 0x20);
    lat += result & 1 ? ~(result >> 1) : result >> 1;
    shift = 0; result = 0;
    do { b = str.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while (b >= 0x20);
    lng += result & 1 ? ~(result >> 1) : result >> 1;
    points.push({ lat: lat / 1e5, lng: lng / 1e5 });
  }
  return points;
}

/* Clustering ligero (k-means con semillas separadas) para repartir lugares por día
   cuando se duerme siempre en el mismo sitio. */
export function kmeans(points, k, iterations = 25) {
  if (k <= 1 || points.length <= k) {
    return points.map((p, i) => (points.length <= k ? i : 0));
  }
  // Semillas: el punto más lejano al conjunto ya elegido (k-means++ simplificado).
  const seeds = [points[0]];
  while (seeds.length < k) {
    let best = null, bestD = -1;
    for (const p of points) {
      const d = Math.min(...seeds.map((s) => haversine(s, p)));
      if (d > bestD) { bestD = d; best = p; }
    }
    seeds.push(best);
  }
  let centers = seeds.map((p) => ({ lat: p.lat, lng: p.lng }));
  let assign = new Array(points.length).fill(0);

  for (let it = 0; it < iterations; it++) {
    let moved = false;
    points.forEach((p, i) => {
      let bi = 0, bd = Infinity;
      centers.forEach((c, ci) => {
        const d = haversine(c, p);
        if (d < bd) { bd = d; bi = ci; }
      });
      if (assign[i] !== bi) { assign[i] = bi; moved = true; }
    });
    centers = centers.map((c, ci) => {
      const own = points.filter((_, i) => assign[i] === ci);
      return own.length ? centroid(own) : c;
    });
    if (!moved) break;
  }
  return assign;
}
