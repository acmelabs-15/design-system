import { topbarStructureCss } from "../../generated/components/topbar/topbar-structure.styles";
import { html } from "lit";
import { property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { shellCss } from "../../generated/components/shell/shell.styles";

export class AcmeTopbar extends AcmeElement {
  static styles = [
    sharedCss,
    shellCss,
    topbarStructureCss,
  ];
  @property() center = "";
  render() {
    return html`<div class="topbar"><slot name="start"></slot><div class="center">${this.center}<slot name="center"></slot></div><slot name="end"></slot></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-topbar": AcmeTopbar;
  }
}
