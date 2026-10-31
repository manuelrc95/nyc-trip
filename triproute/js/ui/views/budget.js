/* Vista "Gastos": presupuesto estimado a partir del itinerario, línea a línea. */

import { el, money, humanDuration, plural } from "../../util.js";
import { getState, setBudgetOverride, setAssumption, setTrip } from "../../store.js";
import { budgetModel } from "../../core/budget.js";
import { buildItinerary } from "../../core/planner.js";
import { field } from "../place-sheet.js";

export function render(host) {
  const state = getState();
  const cur = state.trip.currency;
  const itinerary = buildItinerary(state);
  const b = budgetModel(state, itinerary);
  host.innerHTML = "";

  /* ---------- totales ---------- */
  const pct = b.budget ? Math.min(100, Math.round((b.total / b.budget) * 100)) : 0;
  host.append(el("section", { class: "card" }, [
    el("div", { class: "totals" }, [
      el("div", {}, [
        el("span", { class: "totals-label", text: "Total estimado" }),
        el("b", { class: "totals-big", text: money(b.total, cur) })
      ]),
      el("div", {}, [
        el("span", { class: "totals-label", text: `Por persona (${b.people})` }),
        el("b", { class: "totals-big is-alt", text: money(b.perPerson, cur) })
      ])
    ]),
    b.budget ? el("div", { class: "bar" }, [el("i", { style: `width:${pct}%`, class: b.diff < 0 ? "is-over" : "" })]) : null,
    b.budget
      ? el("p", { class: `budget-diff ${b.diff < 0 ? "is-over" : "is-ok"}`, text: b.diff >= 0
          ? `Te sobran ${money(b.diff, cur)} de los ${money(b.budget, cur)} previstos`
          : `Te pasas ${money(Math.abs(b.diff), cur)} de los ${money(b.budget, cur)} previstos` })
      : el("p", { class: "card-hint", text: "Pon un presupuesto en la pestaña Viaje para comparar." }),
    el("p", { class: "card-hint", text: `Sobre ${b.km} km, ${humanDuration(b.driveMin)} al volante, ${plural("noche", b.nights)} y ${plural("habitación", b.rooms, "habitaciones")}.` })
  ]));

  /* ---------- líneas ---------- */
  const lines = el("div", { class: "budget-lines" });
  b.lines.forEach((l) => {
    const input = el("input", {
      type: "number", min: "0", step: "5", inputmode: "decimal", value: Math.round(l.value * 100) / 100,
      oninput: (e) => { setBudgetOverride(l.id, e.target.value); refreshTotals(host); }
    });
    lines.append(el("div", { class: `budget-line ${l.overridden ? "is-manual" : ""}` }, [
      el("div", { class: "budget-line-head" }, [
        el("b", { text: l.label }),
        l.auto
          ? el("small", { text: l.overridden ? `A mano · la app estimaba ${money(l.estimated, cur)}` : "Calculado por la app" })
          : el("small", { text: "Lo pones tú" })
      ]),
      el("div", { class: "input-row" }, [
        input,
        l.overridden
          ? el("button", {
              class: "btn btn-ghost btn-sm", text: "Volver a estimar",
              onclick: () => { setBudgetOverride(l.id, null); render(host); }
            })
          : null
      ])
    ]));
  });
  host.append(el("section", { class: "card" }, [
    el("h2", { class: "card-title", text: "Partidas" }),
    el("p", { class: "card-hint", text: "Cambia cualquier número y se queda fijo. El botón lo devuelve al cálculo automático." }),
    lines
  ]));

  /* ---------- supuestos ---------- */
  const a = b.assumptions;
  host.append(el("section", { class: "card" }, [
    el("h2", { class: "card-title", text: "Supuestos del cálculo" }),
    el("p", { class: "card-hint", text: "Ajusta estos valores y todas las partidas automáticas se recalculan." }),
    el("div", { class: "field-grid" }, [
      field(`Gasolina (${cur}/litro)`, numberInput(a.fuelPricePerLiter, 0.1, (v) => setAssumption("fuelPricePerLiter", v), host)),
      field("Consumo (l/100 km)", numberInput(a.litersPer100km, 0.5, (v) => setAssumption("litersPer100km", v), host)),
      field(`Peajes por día (${cur})`, numberInput(a.tollsPerDay, 1, (v) => setAssumption("tollsPerDay", v), host)),
      field(`Alojamiento por noche (${cur})`, numberInput(a.lodgingPerNight, 5, (v) => setAssumption("lodgingPerNight", v), host)),
      field(`Comida por persona y día (${cur})`, numberInput(a.foodPerPersonDay, 5, (v) => setAssumption("foodPerPersonDay", v), host)),
      field(`Presupuesto total (${cur})`, numberInput(state.trip.budgetTotal, 50, (v) => setTrip({ budgetTotal: v }), host))
    ])
  ]));

  /* ---------- entradas por lugar ---------- */
  const paid = itinerary.flatMap((d) => d.items).filter((it) => it.place.cost > 0);
  if (paid.length) {
    host.append(el("section", { class: "card" }, [
      el("h2", { class: "card-title", text: "Entradas y tours del itinerario" }),
      el("div", { class: "pricelist" }, paid.map((it) => el("div", { class: "pricerow" }, [
        el("span", { text: it.place.name }),
        el("b", { text: `${money(it.place.cost, cur)} × ${b.people}` })
      ]))),
      el("p", { class: "card-hint", text: `Suma ${money(b.tickets * b.people, cur)}. Se cambia el precio de cada sitio desde su ficha.` })
    ]));
  }
}

function numberInput(value, step, onChange, host) {
  return el("input", {
    type: "number", min: "0", step: String(step), inputmode: "decimal", value,
    oninput: (e) => { onChange(Number(e.target.value) || 0); refreshTotals(host); }
  });
}

/* Recalcular los totales sin repintar todo (si no, se pierde el foco del input). */
function refreshTotals(host) {
  const state = getState();
  const b = budgetModel(state);
  const cur = state.trip.currency;
  const bigs = host.querySelectorAll(".totals-big");
  if (bigs[0]) bigs[0].textContent = money(b.total, cur);
  if (bigs[1]) bigs[1].textContent = money(b.perPerson, cur);
  const bar = host.querySelector(".bar i");
  if (bar && b.budget) {
    bar.style.width = `${Math.min(100, Math.round((b.total / b.budget) * 100))}%`;
    bar.className = b.diff < 0 ? "is-over" : "";
  }
  const diff = host.querySelector(".budget-diff");
  if (diff && b.budget) {
    diff.className = `budget-diff ${b.diff < 0 ? "is-over" : "is-ok"}`;
    diff.textContent = b.diff >= 0
      ? `Te sobran ${money(b.diff, cur)} de los ${money(b.budget, cur)} previstos`
      : `Te pasas ${money(Math.abs(b.diff), cur)} de los ${money(b.budget, cur)} previstos`;
  }
}

export default { id: "budget", label: "Gastos", icon: "💰", render };
