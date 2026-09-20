import { legendStructureCss } from "../../generated/components/legend/legend-structure.styles";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { legendCss } from "../../generated/components/legend/legend.styles";

/** House legend: dot, label and a value; `list` stacks them. Items: acme-legend-item with `hue` or `series`. */
@customElement("acme-legend")
export class AcmeLegend extends AcmeElement {
  static styles = [
    sharedCss,
    legendCss,
    legendStructureCss,
  ];
  @property({ type: Boolean }) list = false;
  render() {
    return html`<div class=${this.cls("legend", { list: this.list })} part="legend"><slot></slot></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-legend": AcmeLegend;
  }
}
