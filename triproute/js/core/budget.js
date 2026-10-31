/* Presupuesto. Parte de lo que ya sabe el itinerario (km, noches, entradas) y
   deja que el usuario sobreescriba cualquier línea a mano. */

import { BUDGET_LINES, BUDGET_ASSUMPTIONS } from "../data/catalog.js";
import { buildItinerary } from "./planner.js";

export function assumptionsOf(state) {
  return { ...BUDGET_ASSUMPTIONS, ...(state.budget.assumptions || {}) };
}

export function budgetModel(state, itinerary = null) {
  const days = itinerary || buildItinerary(state);
  const a = assumptionsOf(state);
  const people = Math.max(1, Number(state.trip.people) || 1);
  const nights = Math.max(0, state.days.length - 1);
  const rooms = Math.ceil(people / 2);
  const drivingDays = days.filter((d) => d.totals.driveMin > 0).length;

  const km = days.reduce((s, d) => s + d.totals.km, 0);
  const driveMin = days.reduce((s, d) => s + d.totals.driveMin, 0);
  const tickets = days.reduce((s, d) => s + d.totals.cost, 0);

  const estimates = {
    transporte: (km / 100) * a.litersPer100km * a.fuelPricePerLiter,
    peajes: drivingDays * a.tollsPerDay,
    alojamiento: nights * rooms * a.lodgingPerNight,
    comida: people * state.days.length * a.foodPerPersonDay,
    entradas: tickets * people,
    extras: 0
  };

  const overrides = state.budget.overrides || {};
  const lines = BUDGET_LINES.map((l) => {
    const estimated = Math.round((estimates[l.id] || 0) * 100) / 100;
    const hasOverride = Object.prototype.hasOwnProperty.call(overrides, l.id);
    return {
      ...l,
      estimated,
      value: hasOverride ? Number(overrides[l.id]) : estimated,
      overridden: hasOverride
    };
  });

  const total = lines.reduce((s, l) => s + (Number(l.value) || 0), 0);
  const budget = Number(state.trip.budgetTotal) || 0;

  return {
    lines,
    total,
    perPerson: total / people,
    budget,
    diff: budget - total,
    people,
    nights,
    rooms,
    km: Math.round(km * 10) / 10,
    driveMin,
    tickets,
    assumptions: a
  };
}
