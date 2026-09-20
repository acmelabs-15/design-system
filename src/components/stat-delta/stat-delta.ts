import { statDeltaStructureCss } from "../../generated/components/stat-delta/stat-delta-structure.styles";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { statCss } from "../../generated/components/stat/stat.styles";
import { trendCss } from "../../generated/components/trend/trend.styles";

@customElement("acme-stat-delta")
export class AcmeStatDelta extends AcmeElement {
  static styles = [
    sharedCss,
    statCss,
    trendCss,
    statDeltaStructureCss,
  ];
  @property() tone: "" | "good" | "bad" = "";
  render() {
    return html`<dd class=${this.cls("delta", { [this.tone]: !!this.tone })}><slot></slot></dd>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-stat-delta": AcmeStatDelta;
  }
}
