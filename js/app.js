(function () {
  "use strict";

  const STORE = "nyc-trip-done";
  const $ = (s) => document.querySelector(s);

  let done = loadDone();
  let activeDay = pickInitialDay();
  let activeStop = null;
  let markers = [];

  function loadDone() {
    try { return JSON.parse(localStorage.getItem(STORE)) || {}; }
    catch (e) { return {}; }
  }

  function saveDone() {
    try { localStorage.setItem(STORE, JSON.stringify(done)); }
    catch (e) { /* modo privado: seguimos sin guardar */ }
  }

  function todayISO() {
    const d = new Date();
    const p = (n) => String(n).padStart(2, "0");
    return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
  }

  function pickInitialDay() {
    const t = todayISO();
    const match = TRIP.days.findIndex((d) => d.date === t);
    return match >= 0 ? match : 0;
  }

  function mapsUrl(q) {
    return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(q);
  }

  function key(dayId, i) { return dayId + ":" + i; }

  /* ---------- Mapa ---------- */

  const map = L.map("map", { zoomControl: true, scrollWheelZoom: false })
    .setView([40.7420, -73.9900], 12);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19
  }).addTo(map);

  function drawMarkers(day) {
    markers.forEach((m) => map.removeLayer(m));
    markers = [];

    day.stops.forEach((stop, i) => {
      const color = (CATS[stop.cat] || {}).color || "#8b94a7";
      const icon = L.divIcon({
        className: "",
        html: '<div class="pin" style="background:' + color + '">' + (i + 1) + "</div>",
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const m = L.marker(stop.coords, { icon: icon }).addTo(map);
      m.bindPopup(
        "<b>" + escapeHtml(stop.title) + "</b>" +
        '<span style="color:#8b94a7">' + escapeHtml(stop.time + " · " + stop.address) + "</span><br>" +
        '<a href="' + mapsUrl(stop.maps) + '" target="_blank" rel="noopener">Abrir en Google Maps →</a>'
      );
      m.on("click", () => selectStop(i, false));
      markers.push(m);
    });

    if (markers.length) {
      const group = L.featureGroup(markers);
      map.fitBounds(group.getBounds().pad(0.22));
    }
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }

  /* ---------- Render ---------- */

  function renderHero() {
    $("#subtitle").textContent = TRIP.subtitle;
    $("#heroMeta").innerHTML =
      '<span class="chip">Hotel <b>' + escapeHtml(TRIP.hotel.name.replace("DoubleTree by Hilton ", "DoubleTree ")) + "</b></span>" +
      '<span class="chip">Atardecer <b>' + TRIP.sunset + "</b></span>" +
      '<span class="chip">Metro <b>$2.90 · OMNY</b></span>' +
      '<span class="chip"><a href="' + mapsUrl(TRIP.hotel.maps) + '" target="_blank" rel="noopener">Ver hotel en el mapa</a></span>';
  }

  function renderDaybar() {
    const t = todayISO();
    $("#daybar").innerHTML = TRIP.days.map((d, i) =>
      '<button class="daytab' + (i === activeDay ? " active" : "") + '" data-i="' + i + '">' +
      escapeHtml(d.label) + (d.date === t ? '<span class="dot"></span>' : "") +
      "</button>"
    ).join("");

    $("#daybar").querySelectorAll(".daytab").forEach((b) => {
      b.addEventListener("click", () => {
        activeDay = Number(b.dataset.i);
        activeStop = null;
        render();
      });
    });
  }

  function renderDay() {
    const day = TRIP.days[activeDay];

    $("#dayTitle").textContent = day.title;
    $("#dayNote").textContent = day.note;

    $("#stops").innerHTML = day.stops.map((stop, i) => {
      const cat = CATS[stop.cat] || { label: stop.cat, color: "#8b94a7" };
      const cost = COSTS[stop.cost] || { label: "", cls: "" };
      const isDone = !!done[key(day.id, i)];

      return '<article class="stop' + (isDone ? " is-done" : "") + '" data-i="' + i + '" style="--cat:' + cat.color + '">' +
        '<button class="check' + (isDone ? " on" : "") + '" data-check="' + i + '" aria-label="Marcar como hecho">✓</button>' +
        '<div class="stop-time">' + escapeHtml(stop.time) + '<span class="stop-num">' + (i + 1) + "</span></div>" +
        "<div>" +
          '<h3 class="stop-title">' + escapeHtml(stop.title) + "</h3>" +
          '<p class="stop-desc">' + escapeHtml(stop.desc) + "</p>" +
          '<div class="stop-tags">' +
            '<span class="tag tag-cat">' + escapeHtml(cat.label) + "</span>" +
            '<span class="tag ' + cost.cls + '">' + escapeHtml(cost.label) + "</span>" +
            '<span class="tag">' + escapeHtml(stop.address) + "</span>" +
          "</div>" +
          (stop.warn ? '<div class="warn">' + escapeHtml(stop.warn) + "</div>" : "") +
          '<div class="stop-links">' +
            '<a class="btn" href="' + mapsUrl(stop.maps) + '" target="_blank" rel="noopener">Cómo llegar</a>' +
            (stop.link ? '<a class="btn" href="' + stop.link + '" target="_blank" rel="noopener">Web oficial</a>' : "") +
          "</div>" +
        "</div>" +
      "</article>";
    }).join("");

    $("#stops").querySelectorAll(".stop").forEach((el) => {
      el.addEventListener("click", (ev) => {
        if (ev.target.closest(".check") || ev.target.closest("a")) return;
        selectStop(Number(el.dataset.i), true);
      });
    });

    $("#stops").querySelectorAll(".check").forEach((b) => {
      b.addEventListener("click", (ev) => {
        ev.stopPropagation();
        const i = Number(b.dataset.check);
        const k = key(day.id, i);
        done[k] = !done[k];
        if (!done[k]) delete done[k];
        saveDone();
        // Solo se actualiza esta tarjeta: un renderDay() completo perdería la
        // parada seleccionada y devolvería el mapa a su encuadre inicial.
        b.classList.toggle("on", !!done[k]);
        b.closest(".stop").classList.toggle("is-done", !!done[k]);
        renderProgress(day);
      });
    });

    renderProgress(day);
    drawMarkers(day);
  }

  function renderProgress(day) {
    const total = day.stops.length;
    const n = day.stops.filter((_, i) => done[key(day.id, i)]).length;
    const pct = total ? Math.round((n / total) * 100) : 0;
    $("#progressBar").style.width = pct + "%";
    $("#progressLabel").textContent = n + " de " + total + " hechas";
  }

  function selectStop(i, fly) {
    activeStop = i;
    const day = TRIP.days[activeDay];

    $("#stops").querySelectorAll(".stop").forEach((el) => {
      el.classList.toggle("is-active", Number(el.dataset.i) === i);
    });

    markers.forEach((m, j) => {
      const el = m.getElement();
      if (el) {
        const pin = el.querySelector(".pin");
        if (pin) pin.classList.toggle("is-active", j === i);
      }
    });

    if (markers[i]) {
      if (fly) map.flyTo(day.stops[i].coords, 15, { duration: .6 });
      markers[i].openPopup();
    }
  }

  function renderFlights() {
    $("#flights").innerHTML = TRIP.flights.map((f) =>
      '<div class="flight">' +
        "<b>" + escapeHtml(f.who) + "</b>" +
        '<span class="when">' + escapeHtml(f.when) + "</span>" +
        "<span>" + escapeHtml(f.from) + "</span>" +
        '<span class="leave">' + escapeHtml(f.leave) + "</span>" +
      "</div>"
    ).join("");
  }

  function renderEssentials() {
    $("#essentials").innerHTML = TRIP.essentials.map((e) =>
      '<div class="card"><h3>' + escapeHtml(e.title) + "</h3><p>" + escapeHtml(e.body) + "</p></div>"
    ).join("");
  }

  function render() {
    renderDaybar();
    renderDay();
  }

  renderHero();
  renderFlights();
  renderEssentials();
  render();

  map.on("click", () => {
    activeStop = null;
    $("#stops").querySelectorAll(".stop").forEach((el) => el.classList.remove("is-active"));
  });
})();
