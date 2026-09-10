import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { trendCss } from "../trend/trend.styles";
import { barRowCss } from "./bar-row.styles";

/** House bar row: label, value, a bar, and the result under it. */
@customElement("acme-bar-row")
export class AcmeBarRow extends AcmeElement {
  static styles = [
    sharedCss,
    barRowCss,
    trendCss,
    css`
      :host {
        display: block;
      }
      .fill {
        background: var(--bar-color, var(--accent));
      }
    `,
  ];
  @property() label = "";
  @property() value = "";
  @property({ type: Number }) percent = 0;
  @property() hue = "";
  @property({ type: Boolean }) small = false;
  render() {
    return html`<div class=${this.cls("bar-row", { sm: this.small })} part="row"><div class="head"><span class="label">${this.label}<slot name="label"></slot></span><span class="value"><slot name="value">${this.value}</slot></span></div><div class="track"><span class="fill" style=${`width:${this.percent}%;${this.hue ? `--bar-color:var(--ds-${this.hue}-900)` : ""}`}></span></div><div class="result"><slot></slot></div></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-bar-row": AcmeBarRow;
  }
}
