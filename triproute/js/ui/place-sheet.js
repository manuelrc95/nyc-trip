/* Ficha de un lugar: lo que se abre al tocar un pin o una tarjeta.
   Desde aquí se agrega al viaje, se escriben notas y se ajustan duración,
   coste y hora fija. */

import { el, esc, humanDuration, money } from "../util.js";
import { typeInfo, WINDOWS } from "../data/catalog.js";
import {
  getState, isPicked, pickPlace, unpickPlace, setPickField,
  resolvePlace, overrideCoords, getPlace
} from "../store.js";
import { openSheet, close } from "./modal.js";
import { ok, err, toast } from "./toast.js";
import { refineOne } from "../services/places-api.js";
import { placesEnabled } from "../services/config.js";

export function directionsUrl(place) {
  return `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}&travelmode=driving`;
}

export function openPlaceSheet(placeId, { onChange } = {}) {
  const render = () => {
    const state = getState();
    const place = resolvePlace(placeId) || getPlace(placeId);
    if (!place) return;
    const info = typeInfo(place.type);
    const picked = isPicked(placeId);
    const cur = state.trip.currency;

    const root = el("div", { class: "ps" });

    root.append(el("div", { class: "ps-head" }, [
      el("span", { class: "ps-emoji", style: `--c:${info.color}`, text: info.emoji }),
      el("div", {}, [
        el("h2", { class: "ps-title", text: place.name }),
        el("p", { class: "ps-sub", text: [place.town, place.province].filter(Boolean).join(" · ") })
      ])
    ]));

    const chips = el("div", { class: "chips" }, [
      el("span", { class: "chip", text: info.label }),
      el("span", { class: "chip", text: place.hours ? `Abre ${place.hours.from}–${place.hours.to}` : "Todo el día" }),
      el("span", { class: "chip", text: WINDOWS[place.best]?.label || "A cualquier hora" }),
      place.cost ? el("span", { class: "chip is-cost", text: `${money(place.cost, cur)} p/p` }) : el("span", { class: "chip is-free", text: "Gratis" }),
      place.rating ? el("span", { class: "chip", text: `★ ${place.rating}` }) : null,
      place.source === "google" ? el("span", { class: "chip is-google", text: "Google" }) : null,
      place.source === "corregido" ? el("span", { class: "chip", text: "GPS corregido" }) : null
    ]);
    root.append(chips);

    if (place.desc) root.append(el("p", { class: "ps-desc", text: place.desc }));
    if (place.priceNote) root.append(el("p", { class: "ps-note", text: `💵 ${place.priceNote}` }));
    if (place.tip) root.append(el("div", { class: "tipbox", html: `<b>Tip</b> ${esc(place.tip)}` }));

    /* --- ajustes de la parada (solo si está en el viaje) --- */
    if (picked) {
      const over = state.picked[placeId] || {};
      const grid = el("div", { class: "field-grid" });

      grid.append(field("Duración de la visita", el("div", { class: "input-row" }, [
        el("input", {
          type: "number", min: "10", step: "5", inputmode: "numeric",
          value: over.dwell ?? place.rawDwell,
          oninput: (e) => setPickField(placeId, "dwell", Number(e.target.value) || null)
        }),
        el("span", { class: "unit", text: "min" })
      ]), `Por defecto ${humanDuration(place.rawDwell)}`));

      grid.append(field("Hora fija (reserva, tour, barco)", el("input", {
        type: "time", value: over.fixedStart || "",
        onchange: (e) => {
          setPickField(placeId, "fixedStart", e.target.value || null);
          toast(e.target.value ? "El optimizador respetará esa hora" : "Hora fija quitada");
        }
      }), "Déjalo vacío si da igual la hora"));

      grid.append(field(`Coste por persona (${cur})`, el("input", {
        type: "number", min: "0", step: "1", inputmode: "decimal",
        value: over.cost ?? place.price ?? 0,
        oninput: (e) => setPickField(placeId, "cost", Number(e.target.value) || 0)
      }), "Entra en el presupuesto"));

      root.append(grid);

      root.append(field("Tu observación", el("textarea", {
        rows: "3", placeholder: "Lo que no quieres olvidar de este sitio...",
        value: over.note || "",
        oninput: (e) => setPickField(placeId, "note", e.target.value)
      }), "Sustituye al tip en el resumen que compartes"));
    }

    /* --- acciones --- */
    const actions = el("div", { class: "ps-actions" });

    actions.append(el("button", {
      class: picked ? "btn btn-danger" : "btn btn-primary",
      onclick: () => {
        if (picked) { unpickPlace(placeId); ok(`${place.name} fuera del viaje`); }
        else { pickPlace(placeId); ok(`${place.name} agregado`); }
        onChange?.();
        render();
      },
      text: picked ? "Quitar del viaje" : "Agregar al viaje"
    }));

    actions.append(el("a", {
      class: "btn btn-ghost", href: directionsUrl(place), target: "_blank", rel: "noopener", text: "Cómo llegar"
    }));

    if (placesEnabled()) {
      actions.append(el("button", {
        class: "btn btn-ghost",
        onclick: async (e) => {
          const btn = e.currentTarget;
          btn.disabled = true;
          btn.textContent = "Buscando...";
          try {
            const hit = await refineOne(place);
            if (!hit) { toast("Google no encontró este sitio"); return; }
            overrideCoords(place.id, hit.lat, hit.lng, { hours: hit.hours || place.hours });
            ok("Coordenadas y horario actualizados");
            onChange?.();
            render();
          } catch (e2) {
            err(e2.message);
          } finally {
            btn.disabled = false;
            btn.textContent = "Ajustar GPS";
          }
        },
        text: "Ajustar GPS"
      }));
    }

    actions.append(el("button", { class: "btn btn-ghost", onclick: close, text: "Cerrar" }));
    root.append(actions);

    openSheet(root);
  };

  render();
}

function field(label, control, hint) {
  return el("label", { class: "field" }, [
    el("span", { class: "field-label", text: label }),
    control,
    hint ? el("span", { class: "field-hint", text: hint }) : null
  ]);
}

export { field };
