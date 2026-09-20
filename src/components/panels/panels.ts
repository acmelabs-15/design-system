import { panelsStructureCss } from "../../generated/components/panels/panels-structure.styles";
import { html } from "lit";
import { property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { panelCss } from "../../generated/components/panel/panel.styles";

export class AcmePanels extends AcmeElement {
  static styles = [
    sharedCss,
    panelCss,
    panelsStructureCss,
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
