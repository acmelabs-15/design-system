import { createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { ManagedFormReact } from "./react";

class ReactManagedFormExample extends HTMLElement {
  private root?: Root;
  connectedCallback() {
    this.root ??= createRoot(this);
    this.root.render(createElement(ManagedFormReact));
  }
  disconnectedCallback() {
    this.root?.unmount();
    this.root = undefined;
  }
}
export function registerReactManagedFormExample(): void {
  customElements.define("docs-form-react", ReactManagedFormExample);
}
