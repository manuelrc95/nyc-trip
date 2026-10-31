/* Navegación por pestañas, con la barra abajo (lo natural en iOS).
   Mantiene el hash de la URL para que el botón atrás funcione. */

import trip from "./views/trip.js";
import explore from "./views/explore.js";
import itinerary from "./views/itinerary.js";
import budget from "./views/budget.js";
import summary from "./views/summary.js";
import { park } from "./map-host.js";

export const VIEWS = [trip, explore, itinerary, budget, summary];

let current = null;
let viewHost = null;
let tabHost = null;

export function initTabs({ view, tabbar }) {
  viewHost = view;
  tabHost = tabbar;

  tabHost.innerHTML = "";
  VIEWS.forEach((v) => {
    tabHost.append(Object.assign(document.createElement("button"), {
      className: "tab",
      innerHTML: `<span class="tab-icon">${v.icon}</span><span class="tab-label">${v.label}</span>`,
      onclick: () => goTo(v.id)
    }));
    tabHost.lastChild.dataset.view = v.id;
  });

  window.addEventListener("hashchange", () => {
    const id = location.hash.replace("#", "");
    if (id && id !== current?.id) goTo(id, { silent: true });
  });

  const initial = location.hash.replace("#", "");
  goTo(VIEWS.some((v) => v.id === initial) ? initial : "trip", { silent: true });
}

export function goTo(id, { silent = false } = {}) {
  const next = VIEWS.find((v) => v.id === id);
  if (!next || !viewHost) return;
  if (current && current !== next) {
    current.onLeave?.();
    if (current.id === "explore" || current.id === "itinerary") park();
  }
  current = next;

  [...tabHost.children].forEach((b) => b.classList.toggle("is-on", b.dataset.view === id));
  viewHost.innerHTML = "";
  viewHost.dataset.view = id;
  next.render(viewHost);
  next.onEnter?.(viewHost);
  if (!silent) history.replaceState(null, "", `#${id}`);
  window.scrollTo({ top: 0, behavior: "instant" });
}

export function currentView() {
  return current;
}

export function rerender() {
  if (current && viewHost) current.render(viewHost);
}
