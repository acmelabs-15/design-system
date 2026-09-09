import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base.js";
import { legendCss } from "../legend/legend.styles.js";
import { chartCss } from "./chart.styles.js";

/** House chart frame: the plot is a slotted inline SVG; the frame draws the grid, axes, legend and tooltip. */
@customElement("acme-chart")
export class AcmeChart extends AcmeElement {
  static styles = [sharedCss, chartCss, legendCss, css`:host{display:block} ::slotted(svg){display:block;width:100%;height:100%;overflow:visible}`];
  @property({ type: Number }) height = 180;
  render() {
    return html`<div class="chart" part="chart"><slot name="head"></slot><div class="plot" style=${`min-height:${this.height}px;height:${this.height}px`}><slot></slot><slot name="tip"></slot></div><slot name="legend"></slot></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-chart": AcmeChart;
  }
}
