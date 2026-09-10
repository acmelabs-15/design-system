import { css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { panelHeadCss } from "./panel-head.styles";

/** A card or section head with a title, sub line and actions. */
@customElement("acme-panel-head")
export class AcmePanelHead extends AcmeElement {
  static styles = [
    sharedCss,
    panelHeadCss,
    css`
      :host {
        display: block;
      }
    `,
  ];
  @property() heading = "";
  @property() sub = "";
  render() {
    return html`<div class="panel-head"><div><h3 class="title">${this.heading}<slot name="heading"></slot></h3>${this.sub ? html`<p class="sub">${this.sub}</p>` : nothing}</div><div class="actions"><slot name="actions"></slot></div></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-panel-head": AcmePanelHead;
  }
}
