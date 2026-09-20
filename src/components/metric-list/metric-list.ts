import { metricListStructureCss } from "../../generated/components/metric-list/metric-list-structure.styles";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import type { AcmeMetric } from "../metric/metric";
import { metricListCss } from "../../generated/components/metric-list/metric-list.styles";

/** Vercel metric list: a column of selectable metric cards. */
@customElement("acme-metric-list")
export class AcmeMetricList extends AcmeElement {
  static styles = [
    sharedCss,
    metricListCss,
    metricListStructureCss,
  ];
  @property() value = "";
  render() {
    return html`<div class="metric-list" role="tablist" @acme-metric-select=${(e: CustomEvent) => {
      this.value = e.detail;
      for (const i of this.querySelectorAll<AcmeMetric>("acme-metric")) i.selected = i.value === this.value;
      this.dispatchEvent(new CustomEvent("acme-change", { detail: { value: this.value }, bubbles: true }));
    }}><slot></slot></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-metric-list": AcmeMetricList;
  }
}
