import { css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, glyph, sharedCss } from "../../base";
import { buttonCss } from "../button/button.styles";
import { pageHeadCss } from "./page-head.styles";

/** Vercel page head: title, meta line and actions. */
@customElement("acme-page-head")
export class AcmePageHead extends AcmeElement {
  static styles = [
    sharedCss,
    pageHeadCss,
    buttonCss,
    css`
      :host {
        display: block;
      }
    `,
  ];
  @property() heading = "";
  @property() back = "";
  @property({ attribute: "back-href" }) backHref = "";
  render() {
    return html`<div class="page-head" part="head"><div class="titles">${this.back ? html`<a class="back" href=${this.backHref}>${glyph("back")}${this.back}</a>` : nothing}<h1>${this.heading}<slot name="heading"></slot></h1><div class="meta"><slot name="meta"></slot></div></div><div class="actions"><slot name="actions"></slot></div></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-page-head": AcmePageHead;
  }
}
