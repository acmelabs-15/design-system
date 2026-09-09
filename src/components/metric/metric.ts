import { css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base.js";
import { metricListCss } from "../metric-list/metric-list.styles.js";

@customElement("acme-metric")
export class AcmeMetric extends AcmeElement {
  static styles = [sharedCss, metricListCss, css`:host{display:contents} .metric-list{display:contents;box-shadow:none;background:none} .threshold{display:flex}`];
  @property() value = "";
  @property() label = "";
  @property() unit = "";
  @property({ type: Boolean, reflect: true }) selected = false;
  @property() grade: "" | "good" | "mid" | "bad" = "";
  render() {
    return html`<div class="metric-list"><button role="tab" aria-selected=${this.selected} @click=${() => this.dispatchEvent(new CustomEvent("acme-metric-select", { detail: this.value, bubbles: true, composed: true }))}><span class="label">${this.label}</span><div class="value"><slot></slot>${this.unit ? html`<small>${this.unit}</small>` : nothing}</div>${this.grade ? html`<div class="threshold"><i class=${this.grade === "good" ? "good" : ""}></i><i class=${this.grade === "mid" ? "mid" : ""}></i><i class=${this.grade === "bad" ? "bad" : ""}></i></div>` : nothing}</button></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-metric": AcmeMetric;
  }
}
