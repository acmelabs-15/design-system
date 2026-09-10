import { css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { pageHeadCss } from "../page-head/page-head.styles";

@customElement("acme-toolbar")
export class AcmeToolbar extends AcmeElement {
  static styles = [
    sharedCss,
    pageHeadCss,
    css`
      :host {
        display: block;
      }
      .grow {
        flex: 1;
      }
    `,
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
