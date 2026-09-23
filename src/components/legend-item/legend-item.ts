import { legendItemStructureCss } from "../../generated/components/legend-item/legend-item-structure.styles";
import { html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { legendCss } from "../../generated/components/legend/legend.styles";

export class AcmeLegendItem extends AcmeElement {
  static styles = [
    sharedCss,
    legendCss,
    legendItemStructureCss,
  ];
  @property() hue = "";
  @property({ type: Number }) series = 0;
  @property() value = "";
  render() {
    const color = this.series ? `var(--chart-${this.series})` : this.hue ? `var(--ds-${this.hue}-900)` : "var(--accent)";
    return html`<span class="dot" style=${`color:${color}`}></span><slot></slot>${this.value ? html`<span class="value">${this.value}</span>` : nothing}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-legend-item": AcmeLegendItem;
  }
}
