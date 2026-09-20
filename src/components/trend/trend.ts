import { trendStructureCss } from "../../generated/components/trend/trend-structure.styles";
import { html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { AcmeElement, glyph, sharedCss } from "../../base";
import { trendCss } from "../../generated/components/trend/trend.styles";

/** House Trend: a signed change with its direction; pill when it stands alone. */

export class AcmeTrend extends AcmeElement {
  static styles = [
    sharedCss,
    trendCss,
    trendStructureCss,
  ];
  @property() direction: "" | "up" | "down" = "";
  @property({ type: Boolean }) pill = false;
  @property({ type: Boolean }) large = false;
  @property() note = "";
  render() {
    return html`<span class=${this.cls("trend", { [this.direction]: !!this.direction, pill: this.pill, lg: this.large })} part="trend">${this.direction ? glyph(this.direction) : nothing}<slot></slot></span>${this.note ? html`<span class="trend-note">${this.note}</span>` : nothing}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-trend": AcmeTrend;
  }
}
