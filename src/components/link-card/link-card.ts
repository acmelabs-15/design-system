import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { badgeCss } from "../badge/badge.styles";
import { linkCardCss } from "./link-card.styles";

/** Vercel link card: a title and one-line description, raised on hover. */
@customElement("acme-link-card")
export class AcmeLinkCard extends AcmeElement {
  static styles = [
    sharedCss,
    linkCardCss,
    badgeCss,
    css`
      :host {
        display: block;
      }
    `,
  ];
  @property() href = "#";
  @property() heading = "";
  render() {
    return html`<a class="link-card" href=${this.href} part="card"><span class="title">${this.heading}</span><span class="desc"><slot></slot></span><slot name="badge"></slot></a>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-link-card": AcmeLinkCard;
  }
}
