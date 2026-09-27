import { createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { DeliveryTableReact } from "./react";

class ReactTableExample extends HTMLElement {
  private root?: Root;
  connectedCallback() {
    this.root ??= createRoot(this);
    this.root.render(
      createElement(DeliveryTableReact, {
        ready: () => {
          /* This example does not retain the consumer API. */
        },
      }),
    );
  }
  disconnectedCallback() {
    this.root?.unmount();
    this.root = undefined;
  }
}
export function registerReactTableExample(): void {
  customElements.define("docs-table-react", ReactTableExample);
}
