/* Vista "Lugares": mapa + catálogo con filtros, búsqueda y alta de lugares propios. */

import { el, debounce, money, humanDuration } from "../../util.js";
import { TYPES, STYLES, typeInfo } from "../../data/catalog.js";
import { PROVINCES, REGION_LIST } from "../../data/places/index.js";
import {
  getState, isPicked, pickPlace, unpickPlace, addCustomPlace, setTrip
} from "../../store.js";
import { searchLocal, searchGoogle } from "../../services/places-api.js";
import { placesEnabled } from "../../services/config.js";
import { attachTo } from "../map-host.js";
import { openPlaceSheet, field } from "../place-sheet.js";
import { openSheet, close } from "../modal.js";
import { ok, err, toast } from "../toast.js";
import { select } from "./trip.js";

const filters = { q: "", province: "", type: "", region: "", onlyPicked: false };
let googleResults = [];
let mapApi = null;
let listHost = null;
let countHost = null;
let chipHost = null;
let provinceSel = null;
let typeSel = null;

export function render(host) {
  host.innerHTML = "";

  /* ---------- barra de filtros ---------- */
  const search = el("input", {
    type: "search", placeholder: "Buscar playa, cascada, pueblo...", value: filters.q,
    oninput: debounce((e) => { filters.q = e.target.value; refresh(); }, 180)
  });

  provinceSel = select([["", "Todas las provincias"], ...PROVINCES.map((p) => [p, p])], filters.province,
    (v) => { filters.province = v; refresh(); });
  provinceSel.setAttribute("aria-label", "Filtrar por provincia");

  typeSel = select([["", "Todas las categorías"], ...Object.entries(TYPES).map(([k, v]) => [k, `${v.emoji} ${v.label}`])],
    filters.type, (v) => { filters.type = v; refresh(); });
  typeSel.setAttribute("aria-label", "Filtrar por categoría");

  const bar = el("div", { class: "card filterbar" }, [
    el("div", { class: "input-row" }, [
      search,
      placesEnabled()
        ? el("button", { class: "btn btn-ghost btn-sm", text: "Google", onclick: () => runGoogle(search.value) })
        : null
    ]),
    el("div", { class: "input-row" }, [provinceSel, typeSel]),
    chipHost = el("div", { class: "chiprow" }, [
      chip("Todo el país", filters.region === "", () => { filters.region = ""; refresh(); }, { region: "" }),
      ...REGION_LIST.map((r) =>
        chip(r.label, filters.region === r.id, () => { filters.region = r.id; refresh(); }, { region: r.id })),
      chip("Solo mi selección", filters.onlyPicked, () => { filters.onlyPicked = !filters.onlyPicked; refresh(); },
        { kind: "alt", toggle: "picked" })
    ])
  ]);
  host.append(bar);

  /* ---------- mapa ---------- */
  const mapCard = el("div", { class: "card card-flush" });
  const mapSlot = el("div", { class: "map-slot" });
  mapCard.append(mapSlot);
  mapCard.append(el("p", { class: "card-hint map-hint", text: "Toca un pin para ver la ficha. Toca cualquier punto del mapa para agregar un lugar tuyo o fijar donde duermes." }));
  host.append(mapCard);

  countHost = el("div", { class: "count-row" });
  host.append(countHost);

  listHost = el("div", { class: "cardgrid" });
  host.append(listHost);

  attachTo(mapSlot).then((api) => {
    mapApi = api;
    api.onMarkerClick((id) => {
      if (String(id).startsWith("g:")) return openGoogleResult(String(id).slice(2));
      openPlaceSheet(id, { onChange: syncPicked });
    });
    api.onMapClick((pos) => openMapPointSheet(pos));
    refresh({ fit: true });
  });

  refresh();
}

function chip(label, active, onClick, { kind = "", region, toggle } = {}) {
  return el("button", {
    class: `chip chip-btn ${active ? "is-on" : ""} ${kind === "alt" ? "is-alt" : ""}`,
    "aria-pressed": active ? "true" : "false",
    dataset: toggle ? { toggle } : { region: region ?? "" },
    onclick: onClick, text: label
  });
}

/* ---------- lista y marcadores ---------- */

function visiblePlaces() {
  const state = getState();
  let list = searchLocal(filters.q, filters);
  if (filters.onlyPicked) list = list.filter((p) => isPicked(p.id));
  // Lo elegido primero, y después lo que encaja con el tipo de viaje.
  const favor = new Set(STYLES[state.trip.style]?.favor || []);
  return list.sort((a, b) => {
    const pa = isPicked(a.id) ? 0 : 1;
    const pb = isPicked(b.id) ? 0 : 1;
    if (pa !== pb) return pa - pb;
    const fa = favor.has(a.type) ? 0 : 1;
    const fb = favor.has(b.type) ? 0 : 1;
    if (fa !== fb) return fa - fb;
    return a.name.localeCompare(b.name, "es");
  });
}

let shown = [];

export function refresh({ fit = false } = {}) {
  if (!listHost) return;
  shown = visiblePlaces();

  listHost.innerHTML = "";
  if (!shown.length && !googleResults.length) {
    listHost.append(el("p", { class: "empty", text: "Nada con esos filtros. Prueba a quitar la provincia o la categoría." }));
  }
  googleResults.forEach((r) => listHost.append(googleCard(r)));
  shown.forEach((p) => listHost.append(placeCard(p)));

  paintFilters();
  paintCount();
  paintMarkers({ fit });
}

/* Los controles se pintan una vez y la lista se refresca muchas: hay que
   volver a marcar cuál está activo o se quedan con el aspecto inicial. */
function paintFilters() {
  if (provinceSel) provinceSel.value = filters.province;
  if (typeSel) typeSel.value = filters.type;
  if (!chipHost) return;
  chipHost.querySelectorAll(".chip-btn").forEach((b) => {
    const on = b.dataset.toggle === "picked"
      ? filters.onlyPicked
      : filters.region === (b.dataset.region || "");
    b.classList.toggle("is-on", on);
    b.setAttribute("aria-pressed", on ? "true" : "false");
  });
}

function paintCount() {
  if (!countHost) return;
  const pickedCount = Object.keys(getState().picked).length;
  countHost.innerHTML = "";
  countHost.append(
    el("span", { text: `${shown.length} lugar${shown.length === 1 ? "" : "es"}` }),
    el("span", { class: "count-sep", text: "·" }),
    el("b", { text: `${pickedCount} en el viaje` })
  );
}

function paintMarkers({ fit = false } = {}) {
  if (!mapApi) return;
  const state = getState();
  const markers = shown.map((p) => {
    const info = typeInfo(p.type);
    const picked = isPicked(p.id);
    return {
      id: p.id, lat: p.lat, lng: p.lng, title: p.name,
      label: picked ? "✓" : info.emoji, color: info.color,
      picked, dim: !picked && filters.onlyPicked
    };
  });
  googleResults.forEach((r) => markers.push({
    id: `g:${r.externalId}`, lat: r.lat, lng: r.lng, title: r.name, label: "G", color: "#ef4444"
  }));
  if (state.trip.base) {
    markers.push({ id: "__base", lat: state.trip.base.lat, lng: state.trip.base.lng, title: state.trip.base.name, label: "🛏", color: "#475569" });
  }
  mapApi.setMarkers(markers);
  mapApi.setRoute(null);
  if (fit && markers.length) mapApi.fitTo(markers);
}

/* Actualiza marcas de "está en el viaje" sin reconstruir la lista entera.
   Si se repintara, la tarjeta que acabas de tocar saltaría de posición. */
export function syncPicked() {
  if (!listHost) return;
  listHost.querySelectorAll("[data-place]").forEach((card) => {
    const id = card.dataset.place;
    const picked = isPicked(id);
    card.classList.toggle("is-picked", picked);
    const btn = card.querySelector(".pcard-add");
    if (btn) {
      btn.classList.toggle("is-on", picked);
      btn.textContent = picked ? "✓" : "+";
      btn.setAttribute("aria-label", picked ? "Quitar del viaje" : "Agregar al viaje");
    }
  });
  paintCount();
  paintMarkers();
}

function placeCard(p) {
  const info = typeInfo(p.type);
  const picked = isPicked(p.id);
  return el("article", {
    class: `pcard ${picked ? "is-picked" : ""}`,
    style: `--c:${info.color}`,
    dataset: { place: p.id }
  }, [
    el("button", {
      class: "pcard-main",
      onclick: () => openPlaceSheet(p.id, { onChange: syncPicked })
    }, [
      el("div", { class: "pcard-top" }, [
        el("span", { class: "pcard-emoji", text: info.emoji }),
        el("div", {}, [
          el("h3", { text: p.name }),
          el("small", { text: [p.town, p.province].filter(Boolean).join(" · ") })
        ])
      ]),
      el("p", { class: "pcard-desc", text: p.desc || "" }),
      el("div", { class: "pcard-meta" }, [
        el("span", { text: humanDuration(p.dwell || info.dwell) }),
        el("span", { text: p.price ? money(p.price, getState().trip.currency) : "Gratis" }),
        el("span", { text: p.hours ? `${p.hours.from}–${p.hours.to}` : "Todo el día" })
      ])
    ]),
    el("button", {
      class: `pcard-add ${picked ? "is-on" : ""}`,
      "aria-label": picked ? "Quitar del viaje" : "Agregar al viaje",
      onclick: (e) => {
        e.stopPropagation();
        if (isPicked(p.id)) { unpickPlace(p.id); toast(`${p.name} fuera del viaje`); }
        else { pickPlace(p.id); ok(`${p.name} agregado`); }
        // Con el filtro de "solo mi selección" puesto, lo que acabas de quitar
        // ya no pertenece a la lista: ahí sí toca reconstruirla.
        if (filters.onlyPicked) refresh(); else syncPicked();
      },
      text: picked ? "✓" : "+"
    })
  ]);
}

/* ---------- resultados de Google ---------- */

async function runGoogle(query) {
  const q = (query || "").trim();
  if (q.length < 3) { toast("Escribe al menos 3 letras"); return; }
  try {
    googleResults = await searchGoogle(q);
    if (!googleResults.length) toast("Google no encontró nada por aquí");
    refresh();
  } catch (e) {
    err(e.message);
  }
}

function googleCard(r) {
  const info = typeInfo(r.type);
  return el("article", { class: "pcard is-google", style: `--c:#ef4444` }, [
    el("button", { class: "pcard-main", onclick: () => openGoogleResult(r.externalId) }, [
      el("div", { class: "pcard-top" }, [
        el("span", { class: "pcard-emoji", text: info.emoji }),
        el("div", {}, [
          el("h3", { text: r.name }),
          el("small", { text: `Google · ${r.province}${r.rating ? ` · ★ ${r.rating}` : ""}` })
        ])
      ]),
      el("p", { class: "pcard-desc", text: r.desc || "" })
    ]),
    el("button", {
      class: "pcard-add", "aria-label": "Agregar al viaje",
      onclick: (e) => { e.stopPropagation(); adoptGoogle(r); },
      text: "+"
    })
  ]);
}

function openGoogleResult(externalId) {
  const r = googleResults.find((x) => x.externalId === externalId);
  if (r) adoptGoogle(r);
}

function adoptGoogle(r) {
  const place = addCustomPlace({ ...r, dwell: typeInfo(r.type).dwell, price: 0 });
  pickPlace(place.id);
  googleResults = googleResults.filter((x) => x.externalId !== r.externalId);
  ok(`${r.name} agregado desde Google`);
  refresh();
}

/* ---------- tocar el mapa ---------- */

function openMapPointSheet(pos) {
  const root = el("div", { class: "ps" });
  root.append(el("h2", { class: "ps-title", text: "Este punto del mapa" }));
  root.append(el("p", { class: "ps-sub", text: `${pos.lat.toFixed(5)}, ${pos.lng.toFixed(5)}` }));

  const name = el("input", { type: "text", placeholder: "Ej: Casa de tía Mari, comedor de la carretera..." });
  const type = select(Object.entries(TYPES).map(([k, v]) => [k, `${v.emoji} ${v.label}`]), "personalizado", () => {});
  const province = el("input", { type: "text", placeholder: "Provincia (opcional)" });
  const dwell = el("input", { type: "number", min: "10", step: "5", value: "60", inputmode: "numeric" });
  const note = el("textarea", { rows: "2", placeholder: "Qué es o qué quieres recordar" });

  root.append(el("div", { class: "field-grid" }, [
    field("Nombre", name),
    field("Categoría", type),
    field("Provincia", province),
    field("Duración (min)", dwell)
  ]));
  root.append(field("Nota", note));

  root.append(el("div", { class: "ps-actions" }, [
    el("button", {
      class: "btn btn-primary", text: "Agregar al viaje",
      onclick: () => {
        if (!name.value.trim()) { toast("Ponle un nombre"); return; }
        const place = addCustomPlace({
          name: name.value.trim(),
          province: province.value.trim() || "Personalizado",
          lat: pos.lat, lng: pos.lng,
          type: type.value,
          dwell: Number(dwell.value) || 60,
          desc: note.value.trim()
        });
        pickPlace(place.id);
        close();
        ok(`${place.name} agregado`);
        refresh();
      }
    }),
    el("button", {
      class: "btn btn-ghost", text: "Fijar aquí mi alojamiento",
      onclick: () => {
        setTrip({ base: { name: name.value.trim() || "Mi alojamiento", lat: pos.lat, lng: pos.lng } });
        close();
        ok("Base fijada en este punto");
        refresh();
      }
    }),
    el("button", { class: "btn btn-ghost", text: "Cancelar", onclick: close })
  ]));

  openSheet(root);
}

export default {
  id: "explore", label: "Lugares", icon: "🗺️", render,
  onLeave() { mapApi = null; listHost = null; chipHost = null; provinceSel = null; typeSel = null; }
};
