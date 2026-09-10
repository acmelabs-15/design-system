import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";

@customElement("acme-bar-rows")
export class AcmeBarRows extends AcmeElement {
  static styles = [
    sharedCss,
    css`
      :host {
        display: flex;
        flex-direction: column;
      }
      :host([lined]) ::slotted(acme-bar-row) {
        border-bottom: 1px solid var(--hair);
      }
      :host([lined]) ::slotted(acme-bar-row:last-child) {
        border-bottom: 0;
      }
    `,
  ];
  @property({ type: Boolean, reflect: true }) lined = false;
  render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-bar-rows": AcmeBarRows;
  }
}
