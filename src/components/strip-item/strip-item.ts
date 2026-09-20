import { stripItemStructureCss } from "../../generated/components/strip-item/strip-item-structure.styles";
import { html } from "lit";
import { property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { badgeCss } from "../../generated/components/badge/badge.styles";
import { statStripCss } from "../../generated/components/stat-strip/stat-strip.styles";

export class AcmeStripItem extends AcmeElement {
  static styles = [
    sharedCss,
    statStripCss,
    badgeCss,
    stripItemStructureCss,
  ];
  @property() value = "";
  @property() label = "";
  @property({ type: Boolean, reflect: true }) selected = false;
  render() {
    return html`<div class="stat-strip"><button role="tab" aria-selected=${this.selected} @click=${() => this.dispatchEvent(new CustomEvent("acme-strip-select", { detail: this.value, bubbles: true, composed: true }))}><span class="label">${this.label}</span><span class="value"><slot></slot></span></button></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-strip-item": AcmeStripItem;
  }
}
