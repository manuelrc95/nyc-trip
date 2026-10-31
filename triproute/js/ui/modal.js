/* Hoja inferior (bottom sheet), el patrón que se espera en iOS.
   Se cierra arrastrando hacia abajo, tocando el fondo o con el botón. */

let overlay = null;
let sheet = null;
let onClose = null;

function build() {
  overlay = document.createElement("div");
  overlay.className = "sheet-overlay";
  overlay.innerHTML = `
    <div class="sheet" role="dialog" aria-modal="true">
      <div class="sheet-grip" aria-hidden="true"><i></i></div>
      <div class="sheet-body"></div>
    </div>`;
  sheet = overlay.querySelector(".sheet");
  document.body.append(overlay);

  overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });

  // Arrastrar la hoja hacia abajo para cerrarla.
  const grip = overlay.querySelector(".sheet-grip");
  let startY = null;
  grip.addEventListener("pointerdown", (e) => {
    startY = e.clientY;
    grip.setPointerCapture(e.pointerId);
  });
  grip.addEventListener("pointermove", (e) => {
    if (startY == null) return;
    const dy = Math.max(0, e.clientY - startY);
    sheet.style.transform = `translateY(${dy}px)`;
  });
  grip.addEventListener("pointerup", (e) => {
    const dy = startY == null ? 0 : Math.max(0, e.clientY - startY);
    startY = null;
    sheet.style.transform = "";
    if (dy > 90) close();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("is-open")) close();
  });
}

export function openSheet(content, { onClose: cb } = {}) {
  if (!overlay) build();
  const body = overlay.querySelector(".sheet-body");
  body.innerHTML = "";
  body.append(content);
  body.scrollTop = 0;
  onClose = cb || null;
  overlay.classList.add("is-open");
  document.body.classList.add("sheet-open");
  return { close, body };
}

export function close() {
  if (!overlay) return;
  overlay.classList.remove("is-open");
  document.body.classList.remove("sheet-open");
  const cb = onClose;
  onClose = null;
  if (cb) cb();
}

export function isOpen() {
  return !!overlay && overlay.classList.contains("is-open");
}
