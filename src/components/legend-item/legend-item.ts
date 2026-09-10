import { css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { legendCss } from "../legend/legend.styles";
import { statusDotCss } from "../status-dot/status-dot.styles";

@customElement("acme-legend-item")
export class AcmeLegendItem extends AcmeElement {
  static styles = [
    sharedCss,
    legendCss,
    statusDotCss,
    css`
      :host {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        min-width: 0;
      }
      .value {
        margin-left: auto;
      }
      .dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        flex: none;
        background: currentColor;
      }
    `,
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
