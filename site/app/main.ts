import { createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
// Entry for the docs app bundle: the design system (compiled), the router app, and the
// "Show code" toggle. Bundled by site/build.ts into _site/app.js.
import { createToastStore, registerTheme } from "../../dist/index";
import { DeliveryTableLit } from "../../examples/table/lit";
import { DeliveryTableReact } from "../../examples/table/react";
import { VirtualDeliveryLit } from "../../examples/table/virtual-lit";
import "../../dist/all";
import { AcmeDocsApp, DocsFormDemo, DocsSwatch, DocsTokens } from "./docs-app";

declare global {
  interface Window {
    acme: { createToastStore: typeof createToastStore };
  }
}

class DocsReactTable extends HTMLElement {
  private root?: Root;
  connectedCallback() {
    this.root ??= createRoot(this);
    this.root.render(createElement(DeliveryTableReact, { ready: () => {} }));
  }
  disconnectedCallback() {
    this.root?.unmount();
    this.root = undefined;
  }
}

export function startDocs(): void {
  customElements.define("docs-table-lit", DeliveryTableLit);
  customElements.define("docs-table-react", DocsReactTable);
  customElements.define("docs-table-virtual", VirtualDeliveryLit);
  customElements.define("docs-tokens", DocsTokens);
  customElements.define("docs-swatch", DocsSwatch);
  customElements.define("docs-form-demo", DocsFormDemo);
  customElements.define("acme-docs-app", AcmeDocsApp);

  window.acme = { createToastStore };
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
}
