import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { statCss } from "../stat/stat.styles";

@customElement("acme-stat-foot")
export class AcmeStatFoot extends AcmeElement {
  static styles = [
    sharedCss,
    statCss,
    css`
      :host {
        display: block;
        margin-top: auto;
      }
      dd {
        margin: 0;
      }
    `,
  ];
  @property({ type: Boolean }) bar = false;
  render() {
    return html`<dd class=${this.cls("foot", { bar: this.bar })}><slot></slot></dd>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-stat-foot": AcmeStatFoot;
  }
}
