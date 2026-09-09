import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base.js";
import { badgeCss } from "../badge/badge.styles.js";
import { statStripCss } from "../stat-strip/stat-strip.styles.js";

@customElement("acme-strip-item")
export class AcmeStripItem extends AcmeElement {
  static styles = [sharedCss, statStripCss, badgeCss, css`:host{display:contents} .stat-strip{display:contents;background:none;margin:0}`];
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
