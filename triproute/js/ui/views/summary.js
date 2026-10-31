/* Vista "Resumen": el itinerario listo para compartir, imprimir o pasar al calendario. */

import { el, formatDateLong, capitalize, plural } from "../../util.js";
import { getState } from "../../store.js";
import { buildItinerary } from "../../core/planner.js";
import { toText, printItinerary, toICS, download, share, slug } from "../../core/exporters.js";
import { ok, err, toast } from "../toast.js";

export function render(host) {
  const state = getState();
  const itinerary = buildItinerary(state);
  const stops = itinerary.reduce((s, d) => s + d.items.length, 0);
  host.innerHTML = "";

  if (!stops) {
    host.append(el("div", { class: "card" }, [
      el("p", { class: "empty", text: "No hay nada que resumir todavía. Elige lugares y ordénalos primero." })
    ]));
    return;
  }

  const text = toText(state, itinerary);
  const name = slug(state.trip.destination || "itinerario-rd");

  host.append(el("section", { class: "card" }, [
    el("h2", { class: "card-title", text: "Compartir" }),
    el("p", { class: "card-hint", text: `${plural("parada", stops)} · ${plural("día", itinerary.filter((d) => d.items.length).length)} · desde el ${formatDateLong(state.trip.startDate)}` }),
    el("div", { class: "btn-row" }, [
      el("button", {
        class: "btn btn-primary", text: "Compartir / WhatsApp",
        onclick: async () => {
          const r = await share(text);
          if (r === "compartido") ok("Compartido");
          else if (r === "copiado") ok("Copiado al portapapeles, pégalo donde quieras");
        }
      }),
      el("button", {
        class: "btn btn-ghost", text: "Copiar texto",
        onclick: async () => {
          try { await navigator.clipboard.writeText(text); ok("Texto copiado"); }
          catch { toast("Selecciona el texto de abajo y cópialo a mano"); }
        }
      }),
      el("button", {
        class: "btn btn-ghost", text: "Guardar como PDF",
        onclick: () => {
          printItinerary(state, itinerary);
          toast("En el iPhone: Compartir → Imprimir → pellizca para guardar en PDF", { ms: 5000 });
        }
      }),
      el("button", {
        class: "btn btn-ghost", text: "Al calendario (.ics)",
        onclick: () => {
          try {
            download(`${name}.ics`, "text/calendar", toICS(state, itinerary));
            ok("Archivo .ics descargado: ábrelo para añadirlo al calendario");
          } catch (e) { err(e.message); }
        }
      }),
      el("button", {
        class: "btn btn-ghost", text: "Descargar texto",
        onclick: () => download(`${name}.txt`, "text/plain", text)
      })
    ])
  ]));

  host.append(el("section", { class: "card" }, [
    el("h2", { class: "card-title", text: "Vista previa" }),
    el("pre", { class: "exportbox", text })
  ]));

  const links = el("div", { class: "linklist" });
  itinerary.forEach((day, i) => {
    if (!day.items.length) return;
    const points = day.items.map((it) => `${it.place.lat},${it.place.lng}`);
    const origin = state.trip.base ? `${state.trip.base.lat},${state.trip.base.lng}` : points[0];
    const destination = points.at(-1);
    const waypoints = points.slice(0, -1).join("|");
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${waypoints ? `&waypoints=${encodeURIComponent(waypoints)}` : ""}&travelmode=driving`;
    links.append(el("a", { class: "btn btn-ghost", href: url, target: "_blank", rel: "noopener", text: `Día ${i + 1} en Google Maps · ${plural("parada", day.items.length)}` }));
  });
  host.append(el("section", { class: "card" }, [
    el("h2", { class: "card-title", text: "Abrir la ruta de cada día" }),
    el("p", { class: "card-hint", text: "Se abre Google Maps con todas las paradas del día en orden, listo para navegar." }),
    links
  ]));
}

export default { id: "summary", label: "Resumen", icon: "📤", render };
