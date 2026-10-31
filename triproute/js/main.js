/* Arranque de TripRoute RD. */

import { getState, subscribe } from "./store.js";
import { initTabs, goTo, currentView, rerender } from "./ui/tabs.js";
import { openSettings } from "./ui/views/settings.js";
import { toast } from "./ui/toast.js";
import { $, plural } from "./util.js";

function paintHeader() {
  const t = getState().trip;
  const sub = $("#app-sub");
  if (sub) {
    const days = getState().days.length;
    const stops = Object.keys(getState().picked).length;
    sub.textContent = t.destination
      ? `${t.destination} · ${plural("día", days)} · ${plural("parada", stops)}`
      : "Asistente de viajes por República Dominicana";
  }
}

function boot() {
  initTabs({ view: $("#view"), tabbar: $("#tabbar") });
  paintHeader();

  $("#btn-settings").addEventListener("click", () => openSettings({
    onChange: () => { rerender(); paintHeader(); }
  }));

  subscribe(() => paintHeader());

  if (getState()._importedLegacy) {
    setTimeout(() => toast("Hemos recuperado el viaje que tenías guardado en la versión anterior", { ms: 5000 }), 600);
    getState()._importedLegacy = false;
  }

  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    navigator.serviceWorker.register("./sw.js").catch(() => { /* sin offline, no pasa nada */ });
  }
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
else boot();

/* Para depurar desde la consola del navegador. */
window.TripRoute = { getState, goTo, currentView, rerender };
