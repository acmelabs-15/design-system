import { css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, glyph, sharedCss } from "../../base.js";
import { foldCss } from "./fold.styles.js";

/** Vercel fold: a section that shows tiles closed and charts open. Slots: closed, open. */
@customElement("acme-fold")
export class AcmeFold extends AcmeElement {
  static styles = [sharedCss, foldCss, css`:host{display:block}`];
  @property() heading = "";
  @property({ type: Boolean, reflect: true }) open = false;
  @property({ type: Number }) count = 0;
  private toggle() {
    this.open = !this.open;
    this.dispatchEvent(new CustomEvent("acme-toggle", { detail: { open: this.open }, bubbles: true }));
  }
  render() {
    return html`<div class="fold" data-open=${this.open} part="fold">${this.count ? html`<span class="count-dot">${this.count}</span>` : nothing}<button class="fold-h" aria-expanded=${this.open} @click=${this.toggle}>${this.heading}<span class="caret"></span></button><div class="fold-closed"><slot name="closed"></slot></div><div class="fold-open"><slot name="open"></slot></div>${this.open ? nothing : html`<button class="expand" @click=${this.toggle}>${glyph("chev-d", "ic")}Expand</button>`}</div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-fold": AcmeFold;
  }
}
