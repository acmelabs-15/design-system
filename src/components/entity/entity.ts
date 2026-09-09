import { css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base.js";
import { avatarCss } from "../avatar/avatar.styles.js";
import { buttonCss } from "../button/button.styles.js";
import { checkboxCss } from "../checkbox/checkbox.styles.js";
import { itemCss } from "../item/item.styles.js";
import { skeletonCss } from "../skeleton/skeleton.styles.js";

/** Geist Entity: a row of content with one or two controls at the right. Slots: left, default (title), description, right. */
@customElement("acme-entity")
export class AcmeEntity extends AcmeElement {
  static styles = [sharedCss, itemCss, avatarCss, checkboxCss, buttonCss, skeletonCss, css`:host{display:block} .item .title{font-weight:600}`];
  @property({ type: Boolean }) selectable = false;
  @property({ type: Boolean, reflect: true }) selected = false;
  @property({ type: Boolean }) loading = false;
  @property() label = "";
  render() {
    if (this.loading)
      return html`<div class="item"><span class="skeleton pill" style="width:32px;height:32px;min-height:0"></span><div class="body" style="display:flex;flex-direction:column;gap:8px"><span class="skeleton" style="width:60%;height:20px;min-height:0"></span><span class="skeleton" style="width:40%;height:16px;min-height:0"></span></div></div>`;
    return html`<div class=${this.cls("item", { selectable: this.selectable })} part="item">${
      this.selectable
        ? html`<label class="checkbox"><input type="checkbox" .checked=${this.selected} aria-label=${`Select ${this.label}`} @change=${(e: Event) => {
            this.selected = (e.target as HTMLInputElement).checked;
            this.dispatchEvent(new CustomEvent("acme-change", { detail: { selected: this.selected }, bubbles: true, composed: true }));
          }}></label>`
        : nothing
    }<slot name="left"></slot><div class="body"><div class="title"><slot></slot></div><div class="meta" style="font-size:14px;line-height:20px;margin-top:0"><slot name="description"></slot></div></div><div class="end row" style="color:var(--text-2);font-size:14px"><slot name="right"></slot></div></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-entity": AcmeEntity;
  }
}
