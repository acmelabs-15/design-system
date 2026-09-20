import { sideNavStructureCss } from "../../generated/components/side-nav/side-nav-structure.styles";
import { html } from "lit";
import { customElement } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { shellCss } from "../../generated/components/shell/shell.styles";

@customElement("acme-side-nav")
export class AcmeSideNav extends AcmeElement {
  static styles = [
    sharedCss,
    shellCss,
    sideNavStructureCss,
  ];
  render() {
    return html`<nav class="side-nav"><slot></slot></nav>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-side-nav": AcmeSideNav;
  }
}
