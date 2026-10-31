/* Reordenar arrastrando, con Pointer Events para que funcione igual con dedo en
   iOS y con ratón. No usa la API nativa de drag & drop porque en Safari móvil
   no existe. Se arrastra desde el asa (⠿) para no pelearse con el scroll.      */

const EDGE = 90;        // px desde el borde donde empieza el autoscroll
const SPEED = 14;       // px por frame

export function makeSortable({ containers, handle = ".drag-handle", item = "[data-sortable-id]", onDrop }) {
  const zones = () => (typeof containers === "function" ? containers() : containers);
  let session = null;
  let raf = null;

  function onPointerDown(e) {
    if (e.button != null && e.button !== 0) return;
    const grip = e.target.closest(handle);
    if (!grip) return;
    const node = grip.closest(item);
    if (!node) return;

    e.preventDefault();
    const rect = node.getBoundingClientRect();
    const placeholder = document.createElement("div");
    placeholder.className = "sort-placeholder";
    placeholder.style.height = `${rect.height}px`;

    session = {
      node, placeholder, grip,
      pointerId: e.pointerId,
      dx: e.clientX - rect.left,
      dy: e.clientY - rect.top,
      width: rect.width,
      lastY: e.clientY,
      id: node.dataset.sortableId,
      from: node.parentElement
    };

    node.after(placeholder);
    node.classList.add("is-dragging");
    node.style.width = `${rect.width}px`;
    node.style.left = `${rect.left}px`;
    node.style.top = `${rect.top}px`;
    document.body.classList.add("is-sorting");

    grip.setPointerCapture(e.pointerId);
    grip.addEventListener("pointermove", onPointerMove);
    grip.addEventListener("pointerup", onPointerUp);
    grip.addEventListener("pointercancel", onPointerUp);
    loop();
  }

  function onPointerMove(e) {
    if (!session || e.pointerId !== session.pointerId) return;
    e.preventDefault();
    session.lastY = e.clientY;
    session.node.style.left = `${e.clientX - session.dx}px`;
    session.node.style.top = `${e.clientY - session.dy}px`;
    reposition(e.clientX, e.clientY);
  }

  function reposition(x, y) {
    const target = zones().find((z) => {
      const r = z.getBoundingClientRect();
      return x >= r.left - 24 && x <= r.right + 24 && y >= r.top - 12 && y <= r.bottom + 12;
    });
    if (!target) return;

    const siblings = [...target.children].filter(
      (c) => c !== session.placeholder && c !== session.node && c.matches(item)
    );
    let before = null;
    for (const sib of siblings) {
      const r = sib.getBoundingClientRect();
      if (y < r.top + r.height / 2) { before = sib; break; }
    }
    if (before) target.insertBefore(session.placeholder, before);
    else target.append(session.placeholder);
  }

  /* Autoscroll cuando se arrastra cerca del borde de la pantalla. */
  function loop() {
    if (!session) { raf = null; return; }
    const y = session.lastY;
    const h = window.innerHeight;
    if (y < EDGE) window.scrollBy(0, -SPEED * (1 - y / EDGE));
    else if (y > h - EDGE) window.scrollBy(0, SPEED * (1 - (h - y) / EDGE));
    raf = requestAnimationFrame(loop);
  }

  function onPointerUp(e) {
    if (!session) return;
    const { node, placeholder, grip, id } = session;
    grip.removeEventListener("pointermove", onPointerMove);
    grip.removeEventListener("pointerup", onPointerUp);
    grip.removeEventListener("pointercancel", onPointerUp);
    if (raf) cancelAnimationFrame(raf);
    raf = null;

    const target = placeholder.parentElement;
    const index = [...target.children]
      .filter((c) => c === placeholder || (c.matches(item) && c !== node))
      .indexOf(placeholder);

    node.classList.remove("is-dragging");
    node.style.cssText = "";
    document.body.classList.remove("is-sorting");
    placeholder.replaceWith(node);
    session = null;

    if (onDrop) onDrop({ id, container: target, index: Math.max(0, index) });
  }

  function attach() {
    for (const z of zones()) {
      z.removeEventListener("pointerdown", onPointerDown);
      z.addEventListener("pointerdown", onPointerDown);
    }
  }

  attach();
  return { attach };
}
