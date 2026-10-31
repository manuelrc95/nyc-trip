/* Vista "Viaje": los datos del viaje y la configuración de cada día. */

import { el, humanDuration, formatDateLong, daysBetween, addDaysISO, money, capitalize, plural } from "../../util.js";
import { STYLES, PACES, MODES } from "../../data/catalog.js";
import { getState, setTrip, setDayField, tripDayCount, exportState, importState, resetAll } from "../../store.js";
import { buildItinerary } from "../../core/planner.js";
import { budgetModel } from "../../core/budget.js";
import { field } from "../place-sheet.js";
import { ok, err, warn } from "../toast.js";
import { download, slug } from "../../core/exporters.js";
import { searchGoogle } from "../../services/places-api.js";
import { placesEnabled } from "../../services/config.js";
import { goTo } from "../tabs.js";

function section(title, children, hint) {
  return el("section", { class: "card" }, [
    el("h2", { class: "card-title", text: title }),
    hint ? el("p", { class: "card-hint", text: hint }) : null,
    ...[].concat(children)
  ]);
}

export function render(host) {
  const state = getState();
  const t = state.trip;
  host.innerHTML = "";

  /* ---------- Resumen de arriba ---------- */
  const itinerary = buildItinerary(state);
  const stops = itinerary.reduce((s, d) => s + d.items.length, 0);
  const km = Math.round(itinerary.reduce((s, d) => s + d.totals.km, 0) * 10) / 10;
  const drive = itinerary.reduce((s, d) => s + d.totals.driveMin, 0);
  const b = budgetModel(state, itinerary);

  host.append(el("div", { class: "statgrid" }, [
    stat("Días", String(state.days.length)),
    stat("Paradas", String(stops)),
    stat("Kilómetros", String(km)),
    stat("Al volante", humanDuration(drive)),
    stat("Estimado", money(b.total, t.currency)),
    stat("Por persona", money(b.perPerson, t.currency))
  ]));

  /* ---------- Datos del viaje ---------- */
  const destInput = el("input", {
    type: "text", placeholder: "Ej: Río San Juan y Cabrera", value: t.destination,
    oninput: (e) => setTrip({ destination: e.target.value })
  });

  const grid = el("div", { class: "field-grid" });
  grid.append(field("Destino o zona", destInput, "Solo es el título del viaje"));

  grid.append(field("Fecha de inicio", el("input", {
    type: "date", value: t.startDate,
    onchange: (e) => {
      const start = e.target.value;
      if (!start) return;
      const span = daysBetween(t.startDate, t.endDate) ?? 0;
      setTrip({ startDate: start, endDate: addDaysISO(start, Math.max(0, span)) });
      render(host);
    }
  })));

  grid.append(field("Fecha de fin", el("input", {
    type: "date", value: t.endDate, min: t.startDate,
    onchange: (e) => {
      const end = e.target.value;
      if (!end) return;
      if ((daysBetween(t.startDate, end) ?? -1) < 0) { warn("La fecha de fin no puede ser anterior al inicio"); return; }
      setTrip({ endDate: end });
      render(host);
    }
  }), plural("día", tripDayCount(t))));

  grid.append(field("Personas", el("input", {
    type: "number", min: "1", max: "20", inputmode: "numeric", value: t.people,
    oninput: (e) => setTrip({ people: Math.max(1, Number(e.target.value) || 1) })
  })));

  grid.append(field("Tipo de viaje", select(
    Object.entries(STYLES).map(([k, v]) => [k, v.label]), t.style,
    (v) => setTrip({ style: v })
  ), "Resalta los lugares que encajan"));

  grid.append(field(`Presupuesto total (${t.currency})`, el("input", {
    type: "number", min: "0", step: "10", inputmode: "numeric", value: t.budgetTotal,
    oninput: (e) => setTrip({ budgetTotal: Number(e.target.value) || 0 })
  })));

  grid.append(field("Moneda", select([["USD", "Dólares (US$)"], ["DOP", "Pesos (RD$)"]], t.currency,
    (v) => { setTrip({ currency: v }); render(host); })));

  host.append(section("Datos del viaje", grid));

  /* ---------- Cómo se planifica ---------- */
  const plan = el("div", { class: "field-grid" });

  plan.append(field("Ritmo", select(
    Object.entries(PACES).map(([k, v]) => [k, v.label]), t.pace,
    (v) => { setTrip({ pace: v }); render(host); }
  ), `Colchón de ${PACES[t.pace]?.buffer} min entre paradas`));

  plan.append(field("Forma de viajar", select(
    Object.entries(MODES).map(([k, v]) => [k, v.label]), t.mode,
    (v) => { setTrip({ mode: v }); render(host); }
  ), MODES[t.mode]?.hint));

  plan.append(field("Empiezo el día a las", el("input", {
    type: "time", value: t.dayStart,
    onchange: (e) => { setTrip({ dayStart: e.target.value || "08:30" }); render(host); }
  })));

  plan.append(field("Quiero terminar a las", el("input", {
    type: "time", value: t.dayEnd,
    onchange: (e) => { setTrip({ dayEnd: e.target.value || "19:00" }); render(host); }
  })));

  plan.append(el("label", { class: "field field-check" }, [
    el("input", {
      type: "checkbox", checked: !!t.lunch,
      onchange: (e) => { setTrip({ lunch: e.target.checked }); render(host); }
    }),
    el("span", {}, [
      el("b", { text: "Reservar una hora para comer" }),
      el("small", { text: "Si una visita larga cae a mediodía, se asume que comes allí" })
    ])
  ]));

  host.append(section("Cómo quieres viajar", plan));

  /* ---------- Base / alojamiento ---------- */
  const baseBox = el("div", {});
  if (t.base) {
    baseBox.append(el("div", { class: "baserow" }, [
      el("div", {}, [
        el("b", { text: t.base.name }),
        el("small", { text: `${t.base.lat.toFixed(4)}, ${t.base.lng.toFixed(4)}` })
      ]),
      el("button", { class: "btn btn-ghost btn-sm", text: "Quitar", onclick: () => { setTrip({ base: null }); render(host); } })
    ]));
  } else {
    baseBox.append(el("p", { class: "empty", text: "Sin base definida: el itinerario empieza en la primera parada del día." }));
  }

  const baseSearch = el("input", { type: "text", placeholder: "Nombre del hotel o del pueblo donde duermes" });
  const baseResults = el("div", { class: "mini-results" });

  const doSearch = async () => {
    const q = baseSearch.value.trim();
    if (q.length < 3) { warn("Escribe al menos 3 letras"); return; }
    baseResults.innerHTML = "";
    if (!placesEnabled()) {
      baseResults.append(el("p", { class: "empty", text: "Para buscar por nombre hace falta activar Places API en Ajustes. Mientras, puedes fijar la base tocando el mapa en la pestaña Lugares." }));
      return;
    }
    baseResults.append(el("p", { class: "empty", text: "Buscando..." }));
    try {
      const results = await searchGoogle(q);
      baseResults.innerHTML = "";
      if (!results.length) { baseResults.append(el("p", { class: "empty", text: "Sin resultados" })); return; }
      results.slice(0, 6).forEach((r) => {
        baseResults.append(el("button", {
          class: "mini-result",
          onclick: () => {
            setTrip({ base: { name: r.name, lat: r.lat, lng: r.lng } });
            ok("Base fijada");
            render(host);
          }
        }, [el("b", { text: r.name }), el("small", { text: r.desc || r.province })]));
      });
    } catch (e) {
      baseResults.innerHTML = "";
      baseResults.append(el("p", { class: "empty", text: e.message }));
    }
  };

  baseSearch.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); doSearch(); } });

  baseBox.append(el("div", { class: "input-row" }, [
    baseSearch,
    el("button", { class: "btn btn-ghost btn-sm", text: "Buscar", onclick: doSearch })
  ]));
  baseBox.append(baseResults);

  host.append(section("Dónde duermes", baseBox,
    "La base es el punto desde el que sales y al que vuelves cada día. Mejora mucho el cálculo de horarios."));

  /* ---------- Días ---------- */
  const days = el("div", { class: "daylist" });
  state.days.forEach((d, i) => {
    const count = state.plan.days[i]?.length || 0;
    days.append(el("div", { class: `daycard is-${d.kind}` }, [
      el("div", { class: "daycard-head" }, [
        el("b", { text: `Día ${i + 1} · ${capitalize(formatDateLong(d.date))}` }),
        el("span", { class: "pill", text: plural("parada", count) })
      ]),
      el("div", { class: "daycard-body" }, [
        field("Tipo de día", select([
          ["normal", "Día normal"],
          ["viaje", "Día de traslado (medio día útil)"],
          ["libre", "Día libre (sin paradas)"]
        ], d.kind, (v) => { setDayField(i, "kind", v); render(host); })),
        field("Nota del día", el("input", {
          type: "text", placeholder: "Ej: salida del hotel a las 7, vuelo por la tarde...",
          value: d.note, oninput: (e) => setDayField(i, "note", e.target.value)
        })),
        field("Empiezo", el("input", {
          type: "time", value: d.dayStart || state.trip.dayStart,
          onchange: (e) => { setDayField(i, "dayStart", e.target.value || null); render(host); }
        })),
        field("Termino", el("input", {
          type: "time", value: d.dayEnd || state.trip.dayEnd,
          onchange: (e) => { setDayField(i, "dayEnd", e.target.value || null); render(host); }
        }))
      ])
    ]));
  });
  host.append(section("Los días del viaje", days,
    "Marca como traslado o libre los días que no son de turismo y el optimizador los respetará."));

  /* ---------- Datos guardados ---------- */
  const fileInput = el("input", {
    type: "file", accept: "application/json", class: "hidden",
    onchange: async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        importState(await file.text());
        ok("Viaje importado");
        render(host);
      } catch (e2) { err("No se pudo importar: " + e2.message); }
    }
  });

  host.append(section("Copia de seguridad", el("div", { class: "btn-row" }, [
    el("button", {
      class: "btn btn-ghost", text: "Descargar viaje (.json)",
      onclick: () => download(`triproute-${slug(t.destination)}.json`, "application/json", exportState())
    }),
    el("button", { class: "btn btn-ghost", text: "Importar viaje", onclick: () => fileInput.click() }),
    el("button", {
      class: "btn btn-danger", text: "Empezar de cero",
      onclick: () => {
        if (!confirm("Esto borra el viaje, las paradas y las notas. ¿Seguro?")) return;
        resetAll();
        ok("Todo limpio");
        goTo("trip");
      }
    }),
    fileInput
  ]), "Todo se guarda solo en este teléfono. Descarga el archivo si quieres pasarlo a otro dispositivo."));
}

function stat(label, value) {
  return el("div", { class: "stat" }, [
    el("span", { class: "stat-value", text: value }),
    el("span", { class: "stat-label", text: label })
  ]);
}

function select(options, value, onChange) {
  const s = el("select", { onchange: (e) => onChange(e.target.value) });
  for (const [v, label] of options) {
    s.append(el("option", { value: v, selected: v === value, text: label }));
  }
  return s;
}

export default { id: "trip", label: "Viaje", icon: "🧭", render };
export { select, section, stat };
