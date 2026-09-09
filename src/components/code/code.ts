import { css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base.js";
import { codeCss } from "./code.styles.js";

/** Geist Code (inline). */
@customElement("acme-code")
export class AcmeCode extends AcmeElement {
  static styles = [sharedCss, codeCss, css`:host{display:inline}`];
  render() {
    return html`<code class="inline"><slot></slot></code>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-code": AcmeCode;
  }
}
