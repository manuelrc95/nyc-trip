/* Avisos cortos. Uno a la vez, sin bloquear nada (nada de alert() en móvil). */

let host = null;
let timer = null;

function ensure() {
  if (!host) {
    host = document.createElement("div");
    host.className = "toast-host";
    host.setAttribute("role", "status");
    host.setAttribute("aria-live", "polite");
    document.body.append(host);
  }
  return host;
}

export function toast(message, { kind = "info", ms = 2800 } = {}) {
  const node = ensure();
  node.className = `toast-host is-${kind} is-visible`;
  node.textContent = message;
  clearTimeout(timer);
  timer = setTimeout(() => node.classList.remove("is-visible"), ms);
}

export const ok = (m) => toast(m, { kind: "ok" });
export const warn = (m) => toast(m, { kind: "warn" });
export const err = (m) => toast(m, { kind: "err", ms: 5000 });
