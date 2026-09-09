import { css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base.js";

@customElement("acme-menu-divider")
export class AcmeMenuDivider extends AcmeElement {
  static styles = [sharedCss, css`:host{display:block} hr{border:0;border-top:1px solid var(--border);margin:4px 0}`];
  render() {
    return html`<hr role="separator">`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-menu-divider": AcmeMenuDivider;
  }
}
