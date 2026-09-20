import { subnavStructureCss } from "../../generated/components/subnav/subnav-structure.styles";
import { html } from "lit";
import { customElement } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { subnavCss } from "../../generated/components/subnav/subnav.styles";

/** Vercel sub-nav: 32px links under a top bar. */
@customElement("acme-subnav")
export class AcmeSubnav extends AcmeElement {
  static styles = [
    sharedCss,
    subnavCss,
    subnavStructureCss,
  ];
  render() {
    return html`<nav class="subnav" style="padding:0"><slot></slot></nav>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-subnav": AcmeSubnav;
  }
}
