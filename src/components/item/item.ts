import { itemStructureCss } from "../../generated/components/item/item-structure.styles";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { badgeCss } from "../../generated/components/badge/badge.styles";
import { buttonCss } from "../../generated/components/button/button.styles";
import { itemCss } from "../../generated/components/item/item.styles";

/** House item row: avatar, title and meta, amount and badge, actions. */
@customElement("acme-item")
export class AcmeItem extends AcmeElement {
  static styles = [
    sharedCss,
    itemCss,
    badgeCss,
    buttonCss,
    itemStructureCss,
  ];
  @property() href = "";
  @property() amount = "";
  @property({ type: Boolean }) large = false;
  render() {
    return html`<div class="item" part="item"><slot name="lead"></slot><div class="body"><div class="title">${this.href ? html`<a class="title" href=${this.href}><slot></slot></a>` : html`<slot></slot>`}<slot name="title-extra"></slot></div><div class="meta"><slot name="meta"></slot></div><slot name="tags"></slot></div><div class="end"><slot name="end">${this.amount ? html`<span class=${this.cls("amount", { lg: this.large })}>${this.amount}</span>` : nothing}</slot></div><span class="actions"><slot name="actions"></slot></span><slot name="chev"></slot></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-item": AcmeItem;
  }
}
