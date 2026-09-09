import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base.js";
import { gaugeCss } from "./gauge.styles.js";

/** Geist Gauge: tiny 20 · sm 32 · md 64 · lg 128; the arc color follows the value unless set. */
@customElement("acme-gauge")
export class AcmeGauge extends AcmeElement {
  static styles = [sharedCss, gaugeCss, css`:host{display:inline-grid}`];
  @property({ type: Number }) value = 0;
  @property() size: "tiny" | "small" | "medium" | "large" = "small";
  @property() color: "" | "low" | "mid" | "high" | "accent" = "";
  @property({ type: Boolean, attribute: "show-value" }) showValue = false;
  render() {
    const tone = this.color || (this.value >= 80 ? "high" : this.value >= 34 ? "mid" : "low");
    const g = html`<span class=${this.cls("gauge", { tiny: this.size === "tiny", md: this.size === "medium", lg: this.size === "large", [tone]: true })} style=${`--pct:${this.value}%`} role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow=${this.value} part="gauge"></span>`;
    return this.showValue
      ? html`<span class=${this.cls("gauge-wrap", { sm: this.size !== "medium" && this.size !== "large", lg: this.size === "large" })}>${g}<span class="value">${Math.round(this.value)}</span></span>`
      : g;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-gauge": AcmeGauge;
  }
}
