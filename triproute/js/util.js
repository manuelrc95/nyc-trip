/* Utilidades sin dependencias: DOM, texto, fechas y horas. */

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

export function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === "class") node.className = v;
    else if (k === "html") node.innerHTML = v;
    else if (k === "text") node.textContent = v;
    else if (k === "dataset") Object.assign(node.dataset, v);
    else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v === true ? "" : v);
  }
  for (const c of [].concat(children)) {
    if (c == null || c === false) continue;
    node.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return node;
}

export function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}

/* Quita tildes y pasa a minúsculas, para buscar sin preocuparse de la ortografía. */
export function norm(s) {
  return String(s ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

export function debounce(fn, ms = 250) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

export function uid(prefix = "id") {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

/* ---------- Horas en minutos desde medianoche ---------- */

export function toMinutes(hhmm) {
  if (typeof hhmm === "number") return hhmm;
  const m = /^(\d{1,2}):(\d{2})$/.exec(String(hhmm || "").trim());
  if (!m) return null;
  return Number(m[1]) * 60 + Number(m[2]);
}

export function toHHMM(min) {
  if (min == null || !isFinite(min)) return "--:--";
  const m = ((Math.round(min) % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
}

export function humanDuration(min) {
  const m = Math.max(0, Math.round(min || 0));
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const r = m % 60;
  return r ? `${h} h ${r} min` : `${h} h`;
}

/* ---------- Fechas (ISO yyyy-mm-dd, sin zonas horarias) ---------- */

export function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function parseISO(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || ""));
  if (!m) return null;
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
}

export function addDaysISO(iso, n) {
  const d = parseISO(iso);
  if (!d) return iso;
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function daysBetween(a, b) {
  const da = parseISO(a);
  const db = parseISO(b);
  if (!da || !db) return null;
  return Math.round((db - da) / 86400000);
}

const WEEKDAYS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const MONTHS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

export function formatDateLong(iso) {
  const d = parseISO(iso);
  if (!d) return "";
  return `${WEEKDAYS[d.getDay()]} ${d.getDate()} de ${MONTHS[d.getMonth()]}`;
}

export function formatDateShort(iso) {
  const d = parseISO(iso);
  if (!d) return "";
  return `${WEEKDAYS[d.getDay()].slice(0, 3)} ${d.getDate()}`;
}

/* 0 = domingo. Se usa para avisar de los museos que cierran los lunes. */
export function weekday(iso) {
  const d = parseISO(iso);
  return d ? d.getDay() : null;
}

export function capitalize(s) {
  const str = String(s ?? "");
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/* plural("parada", 1) → "1 parada" · plural("parada", 3) → "3 paradas" */
export function plural(word, n, pluralWord = null) {
  return `${n} ${n === 1 ? word : pluralWord || word + "s"}`;
}

/* ---------- Dinero ---------- */

export function money(n, currency = "USD") {
  const v = Math.round((Number(n) || 0) * 100) / 100;
  const s = v % 1 === 0 ? String(v) : v.toFixed(2);
  return currency === "DOP" ? `RD$${s}` : `US$${s}`;
}
