import { toolbarStructureCss } from "../../generated/components/toolbar/toolbar-structure.styles";
import { html } from "lit";
import { customElement } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { pageHeadCss } from "../../generated/components/page-head/page-head.styles";

@customElement("acme-toolbar")
export class AcmeToolbar extends AcmeElement {
  static styles = [
    sharedCss,
    pageHeadCss,
    toolbarStructureCss,
  ];
  render() {
    return html`<div class="toolbar"><slot></slot><span class="grow"></span><slot name="end"></slot></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-toolbar": AcmeToolbar;
  }
}
