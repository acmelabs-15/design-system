// Entry for the docs app bundle: the design system (compiled), the router app, and the
// "Show code" toggle. Bundled by docs-src/build.ts into docs/app.js.
import { createToastQueue, toasts } from "../../dist/index";
import "./docs-app";

declare global {
  interface Window {
    acme: { toasts: typeof toasts; createToastQueue: typeof createToastQueue };
  }
}
window.acme = { toasts, createToastQueue };

document.addEventListener("click", (e) => {
  const sb = (e.target as HTMLElement).closest(".showbar");
  if (!sb) return;
  const sc = sb.closest(".showcase") as HTMLElement;
  const open = sc.dataset.open === "true";
  sc.dataset.open = String(!open);
  sb.setAttribute("aria-expanded", String(!open));
  if (sb.lastChild) sb.lastChild.textContent = open ? "Show code" : "Hide code";
});
