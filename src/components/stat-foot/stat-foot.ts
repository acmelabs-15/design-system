import { statFootStructureCss } from "../../generated/components/stat-foot/stat-foot-structure.styles";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { statCss } from "../../generated/components/stat/stat.styles";

@customElement("acme-stat-foot")
export class AcmeStatFoot extends AcmeElement {
  static styles = [
    sharedCss,
    statCss,
    statFootStructureCss,
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
