import { toolbarStructureCss } from "../../generated/components/toolbar/toolbar-structure.styles";
import { html } from "lit";

import { AcmeElement, sharedCss } from "../../base";
import { toolbarCss } from "../../generated/components/toolbar/toolbar.styles";

export class AcmeToolbar extends AcmeElement {
  static styles = [
    sharedCss,
    toolbarCss,
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
