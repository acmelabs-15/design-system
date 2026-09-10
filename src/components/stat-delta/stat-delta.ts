import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { statCss } from "../stat/stat.styles";
import { trendCss } from "../trend/trend.styles";

@customElement("acme-stat-delta")
export class AcmeStatDelta extends AcmeElement {
  static styles = [
    sharedCss,
    statCss,
    trendCss,
    css`
      :host {
        display: block;
      }
      dd {
        margin: 0;
      }
    `,
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
