import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base.js";
import { panelCss } from "../panel/panel.styles.js";

@customElement("acme-panels")
export class AcmePanels extends AcmeElement {
  static styles = [
    sharedCss,
    panelCss,
    css`:host{display:block} .panels{grid-template-columns:repeat(var(--ds-cols,2),minmax(0,1fr))} @media (max-width:900px){.panels{grid-template-columns:minmax(0,1fr)}}`,
  ];
  @property({ type: Number }) columns = 2;
  render() {
    return html`<div class="panels" style=${`--ds-cols:${this.columns}`}><slot></slot></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-panels": AcmePanels;
  }
}
