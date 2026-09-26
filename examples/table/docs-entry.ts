import "./definitions";
import { createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { DeliveryTableLit } from "./lit";
import { DeliveryTableReact } from "./react";
import { VirtualDeliveryLit } from "./virtual-lit";

class ReactTableExample extends HTMLElement {
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
export function registerTableExamples(): void {
  customElements.define("docs-table-lit", DeliveryTableLit);
  customElements.define("docs-table-react", ReactTableExample);
  customElements.define("docs-table-virtual", VirtualDeliveryLit);
}
