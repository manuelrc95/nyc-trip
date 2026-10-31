/* Vista "Itinerario": el plan día a día, reordenable a mano y optimizable. */

import { el, toHHMM, humanDuration, formatDateLong, money, capitalize, plural } from "../../util.js";
import { typeInfo } from "../../data/catalog.js";
import {
  getState, setPlan, moveItem, unpickPlace, resolvePlace, setPickField
} from "../../store.js";
import { optimize, buildItinerary } from "../../core/planner.js";
import { refineLegs } from "../../services/travel.js";
import { routesEnabled, apiKey } from "../../services/config.js";
import { makeSortable } from "../dragsort.js";
import { openPlaceSheet, directionsUrl } from "../place-sheet.js";
import { ok, err, warn, toast } from "../toast.js";
import { attachTo } from "../map-host.js";
import { select } from "./trip.js";
import { goTo } from "../tabs.js";

let host = null;
let mapApi = null;
let activeDay = 0;

export function render(target) {
  host = target || host;
  if (!host) return;
  const state = getState();
  host.innerHTML = "";

  const itinerary = buildItinerary(state);
  const totalStops = itinerary.reduce((s, d) => s + d.items.length, 0);
  const pending = state.plan.unassigned;

  /* ---------- barra de acciones ---------- */
  host.append(el("div", { class: "card actionbar" }, [
    el("div", { class: "btn-row" }, [
      el("button", {
        class: "btn btn-primary",
        text: "Optimizar itinerario",
        onclick: () => {
          const { days, report } = optimize(getState());
          setPlan(days);
          render();
          if (!report.stops) warn("Primero agrega lugares en la pestaña Lugares");
          else ok(`${plural("parada", report.stops)} en ${plural("día", report.days)} · ${report.km} km`);
        }
      }),
      routesEnabled()
        ? el("button", {
            class: "btn btn-ghost", text: "Tiempos reales (Google)",
            onclick: (e) => refineWithGoogle(e.currentTarget)
          })
        : null,
      el("button", {
        class: "btn btn-ghost", text: "Vaciar días",
        onclick: () => {
          if (!totalStops) return;
          if (!confirm("Las paradas vuelven a la bandeja de pendientes. ¿Seguir?")) return;
          setPlan(getState().plan.days.map(() => []));
          render();
        }
      })
    ]),
    el("p", { class: "card-hint", text: state.plan.manual
      ? "Has tocado el orden a mano. Al optimizar se recalcula todo de nuevo."
      : "El optimizador agrupa por zonas, respeta horarios de apertura, horas fijas y la mejor franja de cada sitio." })
  ]));

  if (!totalStops && !pending.length) {
    host.append(el("div", { class: "card" }, [
      el("p", { class: "empty", text: "Todavía no hay paradas en este viaje." }),
      el("div", { class: "btn-row" }, [
        el("button", { class: "btn btn-primary", text: "Elegir lugares", onclick: () => goTo("explore") })
      ])
    ]));
    return;
  }

  /* ---------- mapa del día ---------- */
  const mapCard = el("div", { class: "card card-flush" });
  const mapSlot = el("div", { class: "map-slot is-short" });
  mapCard.append(mapSlot);
  host.append(mapCard);

  /* ---------- pendientes ---------- */
  const zones = [];
  if (pending.length) {
    const tray = el("div", { class: "stoplist", dataset: { dayIndex: "" } });
    pending.forEach((id, i) => tray.append(stopRow({ id, index: i, dayIndex: null })));
    zones.push(tray);
    host.append(el("section", { class: "card card-pending" }, [
      el("h2", { class: "card-title", text: `Pendientes · ${plural("parada", pending.length)}` }),
      el("p", { class: "card-hint", text: "Sin día asignado. Arrástralas a un día o usa Optimizar." }),
      tray
    ]));
  }

  /* ---------- días ---------- */
  itinerary.forEach((day, i) => {
    const d = state.days[i];
    const list = el("div", { class: "stoplist", dataset: { dayIndex: String(i) } });
    day.items.forEach((item, idx) => {
      list.append(stopRow({ id: item.id, index: idx, dayIndex: i, item, day }));
      if (day.lunchBreak && day.lunchBreak.afterIndex === idx) {
        list.append(el("div", { class: "breakrow", text: `🍽️ Comer · ${toHHMM(day.lunchBreak.at)} (${day.lunchBreak.min} min)` }));
      }
    });
    if (!day.items.length) {
      list.append(el("p", { class: "empty empty-drop", text: d.kind === "libre" ? "Día libre" : "Arrastra paradas aquí" }));
    }
    zones.push(list);

    const warnCount = day.items.reduce((s, it) => s + it.warnings.length, 0);

    host.append(el("section", { class: `card daysection ${i === activeDay ? "is-active" : ""}`, dataset: { day: String(i) } }, [
      el("header", { class: "daysection-head", onclick: () => { activeDay = i; drawMap(); highlight(); } }, [
        el("div", {}, [
          el("b", { text: `Día ${i + 1} · ${capitalize(formatDateLong(d.date))}` }),
          el("small", { text: d.note || (d.kind === "viaje" ? "Día de traslado" : d.kind === "libre" ? "Día libre" : "") })
        ]),
        el("div", { class: "daysection-stats" }, [
          el("span", { class: "pill", text: plural("parada", day.items.length) }),
          day.items.length ? el("span", { class: "pill", text: `${day.totals.km} km` }) : null,
          day.items.length ? el("span", { class: "pill", text: humanDuration(day.totals.driveMin) }) : null,
          warnCount ? el("span", { class: "pill is-warn", text: plural("aviso", warnCount) }) : null
        ])
      ]),
      el("div", { class: "daysection-times", text: day.items.length
        ? `${toHHMM(day.startMin)} → ${toHHMM(day.finishMin)}${day.back ? ` · vuelta ${day.back.km} km` : ""}`
        : "" }),
      list
    ]));
  });

  /* ---------- arrastrar para reordenar ---------- */
  makeSortable({
    containers: zones,
    onDrop: ({ id, container, index }) => {
      const raw = container.dataset.dayIndex;
      moveItem(id, raw === "" || raw == null ? null : Number(raw), index);
      render();
    }
  });

  attachTo(mapSlot).then((api) => {
    mapApi = api;
    api.onMarkerClick((id) => openPlaceSheet(id, { onChange: render }));
    api.onMapClick(() => {});
    drawMap();
  });

  highlight();
}

function highlight() {
  document.querySelectorAll(".daysection").forEach((s) => {
    s.classList.toggle("is-active", Number(s.dataset.day) === activeDay);
  });
}

function drawMap() {
  if (!mapApi) return;
  const state = getState();
  const itinerary = buildItinerary(state);
  const day = itinerary[activeDay];
  const markers = [];
  const route = [];

  if (state.trip.base) {
    markers.push({ id: "__base", lat: state.trip.base.lat, lng: state.trip.base.lng, title: state.trip.base.name, label: "🛏", color: "#475569" });
    if (day?.items.length) route.push(state.trip.base);
  }
  day?.items.forEach((it, i) => {
    markers.push({
      id: it.place.id, lat: it.place.lat, lng: it.place.lng, title: it.place.name,
      label: String(i + 1), color: typeInfo(it.place.type).color, picked: true
    });
    route.push({ lat: it.place.lat, lng: it.place.lng });
  });
  if (state.trip.base && day?.back) route.push(state.trip.base);

  // Las paradas de los otros días se ven en gris, para situarse.
  itinerary.forEach((d, idx) => {
    if (idx === activeDay) return;
    d.items.forEach((it) => markers.push({
      id: `o-${it.place.id}`, lat: it.place.lat, lng: it.place.lng, title: `${it.place.name} (día ${idx + 1})`,
      label: String(idx + 1), color: "#94a3b8", dim: true
    }));
  });

  mapApi.setMarkers(markers);
  mapApi.setRoute(route.length > 1 ? route : null);
  if (route.length) mapApi.fitTo(route);
}

/* ---------- una parada ---------- */

function stopRow({ id, index, dayIndex, item, day }) {
  const state = getState();
  const place = item?.place || resolvePlace(id);
  if (!place) return el("div");
  const info = typeInfo(place.type);
  const cur = state.trip.currency;
  const dayCount = state.days.length;

  const row = el("article", {
    class: `stop ${item?.warnings.length ? "has-warn" : ""} ${place.done ? "is-done" : ""}`,
    style: `--c:${info.color}`,
    dataset: { sortableId: id }
  });

  row.append(el("button", { class: "drag-handle", "aria-label": "Arrastrar para reordenar", html: "<span></span><span></span><span></span>" }));

  const timeBox = el("div", { class: "stop-time" });
  if (item) {
    timeBox.append(el("b", { text: toHHMM(item.arrive) }));
    timeBox.append(el("small", { text: toHHMM(item.leave) }));
    if (item.travel.min) {
      timeBox.append(el("span", { class: "stop-travel", text: `↑ ${item.travel.km} km · ${humanDuration(item.travel.min)}${item.travel.source === "google" ? " ·  Google" : ""}` }));
    }
  } else {
    timeBox.append(el("b", { text: "—" }));
    timeBox.append(el("small", { text: humanDuration(place.dwell) }));
  }
  row.append(timeBox);

  const body = el("div", { class: "stop-body" });
  body.append(el("button", {
    class: "stop-name", onclick: () => openPlaceSheet(id, { onChange: render }),
    html: `<b>${index + 1}. ${place.name}</b><small>${info.emoji} ${[place.town, place.province].filter(Boolean).join(" · ")}</small>`
  }));

  const meta = el("div", { class: "stop-meta" }, [
    el("span", { text: humanDuration(place.dwell) }),
    el("span", { text: place.cost ? `${money(place.cost, cur)} p/p` : "Gratis" }),
    place.fixedStart ? el("span", { class: "is-fixed", text: `fija ${place.fixedStart}` }) : null,
    item?.wait ? el("span", { text: `espera ${humanDuration(item.wait)}` }) : null,
    item?.mealHere ? el("span", { text: "🍽️ aquí se come" }) : null
  ]);
  body.append(meta);

  const tip = place.note || place.tip;
  if (tip) body.append(el("p", { class: "stop-tip", text: `💡 ${tip}` }));

  (item?.warnings || []).forEach((w) => body.append(el("p", { class: "stop-warn", text: `⚠️ ${w}` })));

  const tools = el("div", { class: "stop-tools" });

  tools.append(el("button", {
    class: `tool is-icon ${place.done ? "is-on" : ""}`, title: place.done ? "Hecho" : "Marcar como hecho",
    "aria-label": "Marcar como hecho",
    onclick: () => { setPickField(id, "done", !place.done); render(); },
    text: "✓"
  }));

  tools.append(el("button", {
    class: "tool is-icon", title: "Subir", "aria-label": "Subir", text: "↑",
    disabled: dayIndex == null || index === 0,
    onclick: () => { moveItem(id, dayIndex, index - 1); render(); }
  }));
  tools.append(el("button", {
    class: "tool is-icon", title: "Bajar", "aria-label": "Bajar", text: "↓",
    disabled: dayIndex == null || !day || index >= day.items.length - 1,
    onclick: () => { moveItem(id, dayIndex, index + 1); render(); }
  }));

  const moveSel = select(
    [["", "Mover a…"], ...Array.from({ length: dayCount }, (_, i) => [String(i), `Día ${i + 1}`]), ["none", "Pendientes"]],
    "", (v) => {
      if (v === "") return;
      moveItem(id, v === "none" ? null : Number(v), null);
      render();
    }
  );
  moveSel.className = "tool-select";
  moveSel.setAttribute("aria-label", "Mover a otro día");
  tools.append(moveSel);

  tools.append(el("a", {
    class: "tool is-icon", href: directionsUrl(place), target: "_blank", rel: "noopener",
    title: "Cómo llegar", "aria-label": "Cómo llegar", text: "➔"
  }));
  tools.append(el("button", {
    class: "tool is-icon is-danger", title: "Quitar del viaje", "aria-label": "Quitar del viaje", text: "✕",
    onclick: () => { unpickPlace(id); toast(`${place.name} fuera del viaje`); render(); }
  }));

  row.append(body);
  row.append(tools);
  return row;
}

/* ---------- Routes API ---------- */

async function refineWithGoogle(button) {
  const state = getState();
  const pairs = [];
  state.plan.days.forEach((ids, i) => {
    const places = ids.map(resolvePlace).filter(Boolean);
    let prev = state.trip.base || null;
    places.forEach((p) => {
      if (prev) pairs.push([prev, p]);
      prev = p;
    });
    if (state.trip.base && prev && (state.trip.mode === "base" || i === state.plan.days.length - 1)) {
      pairs.push([prev, state.trip.base]);
    }
  });

  if (!pairs.length) { warn("No hay tramos que calcular"); return; }
  button.disabled = true;
  const label = button.textContent;
  button.textContent = "Consultando...";
  try {
    const { refined, skipped } = await refineLegs(pairs, { apiKey: apiKey() });
    if (refined) ok(`${plural("tramo", refined)} con tiempos reales de Google${skipped ? `, ${skipped} sin calcular` : ""}`);
    else toast("Todos los tramos ya estaban calculados");
    render();
  } catch (e) {
    err(e.message);
  } finally {
    button.disabled = false;
    button.textContent = label;
  }
}

export default {
  id: "itinerary", label: "Itinerario", icon: "📋", render,
  onLeave() { mapApi = null; }
};
