import "../table/definitions";
import { createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { VirtualDeliveryReact } from "../table/virtual-react";

class ReactVirtualTableExample extends HTMLElement {
  private root?: Root;
  connectedCallback() {
    this.root ??= createRoot(this);
    this.root.render(createElement(VirtualDeliveryReact, { ready: () => {} }));
  }
  disconnectedCallback() {
    this.root?.unmount();
    this.root = undefined;
  }
}
export function registerReactVirtualTableExample(): void {
  customElements.define("docs-table-virtual-react", ReactVirtualTableExample);
}
