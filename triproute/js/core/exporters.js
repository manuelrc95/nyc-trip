/* Salidas del itinerario: texto para WhatsApp, PDF (vía impresión del navegador),
   calendario .ics para el iPhone y copia de seguridad en JSON. */

import { toHHMM, humanDuration, formatDateLong, money, esc, parseISO, capitalize, plural } from "../util.js";
import { budgetModel } from "./budget.js";

/* ---------- Texto plano para compartir ---------- */

export function toText(state, itinerary) {
  const t = state.trip;
  const cur = t.currency;
  const L = [];
  const rule = "————————————————";

  L.push("🌴 *ITINERARIO TRIPROUTE RD*");
  if (t.destination) L.push(`📍 ${t.destination}`);
  L.push(`📅 ${capitalize(formatDateLong(t.startDate))} → ${formatDateLong(t.endDate)} (${plural("día", state.days.length)})`);
  L.push(`👥 ${plural("persona", t.people)}`);
  if (t.base?.name) L.push(`🛏️ Base: ${t.base.name}`);
  L.push(rule);

  itinerary.forEach((day, i) => {
    if (!day.items.length) return;
    L.push("");
    L.push(`*DÍA ${i + 1} · ${formatDateLong(day.day.date).toUpperCase()}*`);
    if (day.day.note) L.push(`_${day.day.note}_`);
    L.push(`🚗 ${day.totals.km} km · ${humanDuration(day.totals.driveMin)} al volante`);
    L.push("");

    day.items.forEach((it, n) => {
      if (it.travel.min) L.push(`   ↓ ${it.travel.km} km · ${humanDuration(it.travel.min)}`);
      L.push(`${n + 1}. *${it.place.name}* (${it.place.province})`);
      L.push(`   🕒 ${toHHMM(it.arrive)} – ${toHHMM(it.leave)}${it.place.fixedStart ? " · hora fijada" : ""}`);
      const costLine = [];
      if (it.place.cost) costLine.push(money(it.place.cost, cur) + " p/p");
      else costLine.push("gratis");
      if (it.place.hours) costLine.push(`abre ${it.place.hours.from}–${it.place.hours.to}`);
      L.push(`   💵 ${costLine.join(" · ")}`);
      if (it.mealHere) L.push("   🍽️ Aquí se come");
      const tip = it.place.note || it.place.tip;
      if (tip) L.push(`   💡 ${tip}`);
      it.warnings.forEach((w) => L.push(`   ⚠️ ${w}`));
      L.push("");
    });

    if (day.lunchBreak) L.push(`   🍽️ Parada para comer ~${toHHMM(day.lunchBreak.at)}`);
    if (day.back) L.push(`   ↩️ Vuelta a la base: ${day.back.km} km · ${humanDuration(day.back.min)}`);
    L.push(`   🏁 Fin del día ~${toHHMM(day.finishMin)}`);
  });

  const b = budgetModel(state, itinerary);
  L.push("");
  L.push(rule);
  L.push("*PRESUPUESTO ESTIMADO*");
  b.lines.forEach((l) => L.push(`${l.label}: ${money(l.value, cur)}`));
  L.push(`*Total: ${money(b.total, cur)}*`);
  L.push(`Por persona: ${money(b.perPerson, cur)}`);
  if (b.budget) {
    L.push(b.diff >= 0
      ? `Te sobran ${money(b.diff, cur)} del presupuesto`
      : `Te pasas ${money(Math.abs(b.diff), cur)} del presupuesto`);
  }
  L.push("");
  L.push("Generado con TripRoute RD 🇩🇴");
  return L.join("\n");
}

/* ---------- PDF: se construye una hoja limpia y se manda a imprimir ---------- */

export function printItinerary(state, itinerary) {
  const t = state.trip;
  const cur = t.currency;
  const b = budgetModel(state, itinerary);
  const host = document.getElementById("print-root");
  if (!host) return;

  const dayBlocks = itinerary.map((day, i) => {
    if (!day.items.length) return "";
    const rows = day.items.map((it, n) => `
      <tr>
        <td class="p-time">${toHHMM(it.arrive)}<br><span>${toHHMM(it.leave)}</span></td>
        <td class="p-main">
          <strong>${n + 1}. ${esc(it.place.name)}</strong>
          <span class="p-meta">${esc(it.place.province)}${it.place.town ? " · " + esc(it.place.town) : ""} · ${humanDuration(it.place.dwell)} · ${it.place.cost ? esc(money(it.place.cost, cur)) + " p/p" : "gratis"}</span>
          ${it.place.desc ? `<span class="p-desc">${esc(it.place.desc)}</span>` : ""}
          ${(it.place.note || it.place.tip) ? `<span class="p-tip">💡 ${esc(it.place.note || it.place.tip)}</span>` : ""}
          ${it.warnings.length ? `<span class="p-warn">⚠ ${esc(it.warnings.join(" · "))}</span>` : ""}
        </td>
        <td class="p-travel">${it.travel.min ? `${it.travel.km} km<br><span>${humanDuration(it.travel.min)}</span>` : "—"}</td>
      </tr>
      ${day.lunchBreak && day.lunchBreak.afterIndex === n
        ? `<tr class="p-break"><td class="p-time">${toHHMM(day.lunchBreak.at)}</td><td class="p-main">🍽️ Parada para comer (${day.lunchBreak.min} min)</td><td class="p-travel">—</td></tr>`
        : ""}`).join("");

    return `
      <section class="p-day">
        <h2>Día ${i + 1} · ${esc(capitalize(formatDateLong(day.day.date)))}</h2>
        <p class="p-daymeta">${day.totals.stops} paradas · ${day.totals.km} km · ${humanDuration(day.totals.driveMin)} al volante · fin ~${toHHMM(day.finishMin)}</p>
        ${day.day.note ? `<p class="p-note">${esc(day.day.note)}</p>` : ""}
        <table><tbody>${rows}</tbody></table>
      </section>`;
  }).join("");

  host.innerHTML = `
    <div class="p-sheet">
      <header class="p-head">
        <h1>${esc(t.destination || "Viaje por República Dominicana")}</h1>
        <p>${esc(capitalize(formatDateLong(t.startDate)))} → ${esc(formatDateLong(t.endDate))} · ${plural("día", state.days.length)} · ${plural("persona", t.people)}${t.base?.name ? " · base: " + esc(t.base.name) : ""}</p>
      </header>
      ${dayBlocks || "<p>Itinerario vacío.</p>"}
      <section class="p-day p-budget">
        <h2>Presupuesto estimado</h2>
        <table><tbody>
          ${b.lines.map((l) => `<tr><td>${esc(l.label)}</td><td class="p-num">${esc(money(l.value, cur))}</td></tr>`).join("")}
          <tr class="p-total"><td>Total</td><td class="p-num">${esc(money(b.total, cur))}</td></tr>
          <tr><td>Por persona (${b.people})</td><td class="p-num">${esc(money(b.perPerson, cur))}</td></tr>
        </tbody></table>
      </section>
      <footer class="p-foot">TripRoute RD · Horarios, distancias y precios aproximados</footer>
    </div>`;

  document.body.classList.add("printing");
  const cleanup = () => {
    document.body.classList.remove("printing");
    window.removeEventListener("afterprint", cleanup);
  };
  window.addEventListener("afterprint", cleanup);
  setTimeout(() => window.print(), 80);
  setTimeout(cleanup, 60000);
}

/* ---------- Calendario .ics (se abre en la app Calendario del iPhone) ---------- */

function icsDate(iso, minutes) {
  const d = parseISO(iso);
  if (!d) return null;
  d.setMinutes(d.getMinutes() + Math.round(minutes));
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}T${p(d.getHours())}${p(d.getMinutes())}00`;
}

function icsEscape(s) {
  return String(s || "").replace(/[\;,]/g, (c) => "\\" + c).replace(/\n/g, "\\n");
}

export function toICS(state, itinerary) {
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//TripRoute RD//ES", "CALSCALE:GREGORIAN"];
  itinerary.forEach((day) => {
    day.items.forEach((it, n) => {
      const start = icsDate(day.day.date, it.arrive);
      const end = icsDate(day.day.date, it.leave);
      if (!start || !end) return;
      const desc = [
        it.place.desc,
        it.place.note || it.place.tip,
        it.travel.min ? `Traslado previo: ${it.travel.km} km (~${humanDuration(it.travel.min)})` : "",
        `https://www.google.com/maps/dir/?api=1&destination=${it.place.lat},${it.place.lng}`
      ].filter(Boolean).join("\n");
      lines.push(
        "BEGIN:VEVENT",
        `UID:${day.day.date}-${n}-${it.place.id}@triproute`,
        `DTSTART:${start}`,
        `DTEND:${end}`,
        `SUMMARY:${icsEscape(it.place.name)}`,
        `LOCATION:${icsEscape([it.place.name, it.place.town, it.place.province, "República Dominicana"].filter(Boolean).join(", "))}`,
        `GEO:${it.place.lat};${it.place.lng}`,
        `DESCRIPTION:${icsEscape(desc)}`,
        "END:VEVENT"
      );
    });
  });
  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

/* ---------- Descargas y compartir ---------- */

export function download(filename, mime, content) {
  const blob = new Blob([content], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export async function share(text, title = "Itinerario TripRoute RD") {
  if (navigator.share) {
    try {
      await navigator.share({ title, text });
      return "compartido";
    } catch (e) {
      if (e.name === "AbortError") return "cancelado";
    }
  }
  await navigator.clipboard.writeText(text);
  return "copiado";
}

export function slug(s) {
  return String(s || "itinerario")
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "itinerario";
}
