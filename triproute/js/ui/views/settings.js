/* Ajustes: Google Maps Platform, proveedor de mapa y caché de tramos.
   La clave se guarda solo en este navegador. */

import { el, plural } from "../../util.js";
import { getState, setSettings } from "../../store.js";
import { GOOGLE_APIS, hasKey, resetGoogleMaps } from "../../services/config.js";
import { cachedLegCount, clearLegCache } from "../../services/travel.js";
import { openSheet, close } from "../modal.js";
import { field } from "../place-sheet.js";
import { ok, toast } from "../toast.js";
import { rebuild } from "../map-host.js";

export function openSettings({ onChange } = {}) {
  const render = () => {
    const s = getState().settings;
    const root = el("div", { class: "ps" });

    root.append(el("h2", { class: "ps-title", text: "Ajustes" }));
    root.append(el("p", { class: "ps-sub", text: "Sin configurar nada, la app funciona con OpenStreetMap y cálculos propios." }));

    /* --- clave --- */
    const key = el("input", {
      type: "password", placeholder: "AIza...", value: s.googleKey,
      autocomplete: "off", spellcheck: "false"
    });

    root.append(field("Clave de Google Maps Platform", key,
      "Se guarda solo en este teléfono. Restríngela por referente HTTP en la consola de Google."));

    root.append(field("Map ID (opcional)", el("input", {
      type: "text", placeholder: "Para estilos y marcadores avanzados", value: s.googleMapId,
      oninput: (e) => setSettings({ googleMapId: e.target.value.trim() })
    }), "Solo si creaste un estilo de mapa en la consola de Google."));

    root.append(el("div", { class: "btn-row" }, [
      el("button", {
        class: "btn btn-primary", text: "Guardar clave",
        onclick: () => {
          setSettings({ googleKey: key.value.trim() });
          resetGoogleMaps();
          ok(key.value.trim() ? "Clave guardada" : "Clave borrada");
          render();
        }
      }),
      s.googleKey ? el("button", {
        class: "btn btn-ghost", text: "Borrar clave",
        onclick: () => { setSettings({ googleKey: "", usePlaces: false, useRoutes: false, mapProvider: "leaflet" }); resetGoogleMaps(); rebuild(); onChange?.(); render(); }
      }) : null
    ]));

    /* --- qué se usa --- */
    const toggles = el("div", { class: "togglelist" });

    toggles.append(toggle("Mapa de Google", s.mapProvider === "google", hasKey(), async (on) => {
      setSettings({ mapProvider: on ? "google" : "leaflet" });
      await rebuild();
      onChange?.();
      toast(on ? "Mapa de Google activado" : "Vuelta a OpenStreetMap");
      render();
    }, "Maps JavaScript API"));

    toggles.append(toggle("Buscar lugares con Google", !!s.usePlaces, hasKey(), (on) => {
      setSettings({ usePlaces: on });
      onChange?.();
      render();
    }, "Places API (New)"));

    toggles.append(toggle("Tiempos de conducción reales", !!s.useRoutes, hasKey(), (on) => {
      setSettings({ useRoutes: on });
      onChange?.();
      render();
    }, "Routes API"));

    root.append(el("div", { class: "card-sub" }, [
      el("h3", { text: "Qué activar" }),
      toggles,
      !hasKey() ? el("p", { class: "card-hint", text: "Pega una clave válida para poder activar estas opciones." }) : null
    ]));

    /* --- qué API hace falta --- */
    root.append(el("div", { class: "card-sub" }, [
      el("h3", { text: "APIs que hay que habilitar en Google Cloud" }),
      el("ul", { class: "apilist" }, GOOGLE_APIS.map((a) =>
        el("li", {}, [el("b", { text: a.label }), el("small", { text: a.why })])
      )),
      el("a", {
        class: "btn btn-ghost", target: "_blank", rel: "noopener",
        href: "https://console.cloud.google.com/google/maps-apis/api-list",
        text: "Abrir la consola de Google Maps"
      })
    ]));

    /* --- caché --- */
    root.append(el("div", { class: "card-sub" }, [
      el("h3", { text: "Caché de tramos" }),
      el("p", { class: "card-hint", text: `${plural("tramo", cachedLegCount())} guardados con tiempos reales. Se reutilizan sin volver a gastar cuota.` }),
      el("button", {
        class: "btn btn-ghost", text: "Vaciar caché",
        onclick: () => { clearLegCache(); onChange?.(); toast("Caché vacía"); render(); }
      })
    ]));

    root.append(el("div", { class: "ps-actions" }, [
      el("button", { class: "btn btn-ghost", text: "Cerrar", onclick: close })
    ]));

    openSheet(root);
  };

  render();
}

function toggle(label, on, enabled, onChange, hint) {
  return el("label", { class: `toggle ${enabled ? "" : "is-disabled"}` }, [
    el("input", {
      type: "checkbox", checked: on, disabled: !enabled,
      onchange: (e) => onChange(e.target.checked)
    }),
    el("span", {}, [el("b", { text: label }), hint ? el("small", { text: hint }) : null])
  ]);
}
