import { statDescStructureCss } from "../../generated/components/stat-desc/stat-desc-structure.styles";
import { html } from "lit";

import { AcmeElement, sharedCss } from "../../base";
import { statCss } from "../../generated/components/stat/stat.styles";

export class AcmeStatDesc extends AcmeElement {
  static styles = [
    sharedCss,
    statCss,
    statDescStructureCss,
  ];
  render() {
    return html`<dd class="desc"><slot></slot></dd>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-stat-desc": AcmeStatDesc;
  }
}
