import { linkCardStructureCss } from "../../generated/components/link-card/link-card-structure.styles";
import { html } from "lit";
import { property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { badgeCss } from "../../generated/components/badge/badge.styles";
import { linkCardCss } from "../../generated/components/link-card/link-card.styles";

/** Vercel link card: a title and one-line description, raised on hover. */

export class AcmeLinkCard extends AcmeElement {
  static styles = [
    sharedCss,
    linkCardCss,
    badgeCss,
    linkCardStructureCss,
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
