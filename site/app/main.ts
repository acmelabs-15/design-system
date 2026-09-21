// Entry for the docs app bundle: the design system (compiled), the router app, and the
// "Show code" toggle. Bundled by site/build.ts into _site/app.js.
import { createToastQueue, registerTheme, toasts } from "../../dist/index";
import "../../dist/all";
import { AcmeDocsApp, DocsFormDemo, DocsSwatch, DocsTokens } from "./docs-app";

customElements.define("docs-tokens", DocsTokens);
customElements.define("docs-swatch", DocsSwatch);
customElements.define("docs-form-demo", DocsFormDemo);
customElements.define("acme-docs-app", AcmeDocsApp);

declare global {
  interface Window {
    acme: { toasts: typeof toasts; createToastQueue: typeof createToastQueue };
  }
}
window.acme = { toasts, createToastQueue };
registerTheme("docs-ocean", { colors: { "ds-blue-700": "#0068d6" }, spacing: { 2: "0.75rem" } });

document.addEventListener("click", (e) => {
  const sb = (e.target as HTMLElement).closest(".showbar");
  if (!sb) return;
  const sc = sb.closest(".showcase") as HTMLElement;
  const open = sc.dataset.open === "true";
  sc.dataset.open = String(!open);
  sb.setAttribute("aria-expanded", String(!open));
  if (sb.lastChild) sb.lastChild.textContent = open ? "Show code" : "Hide code";
});
