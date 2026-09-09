import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, glyph, sharedCss } from "../../base.js";
import { buttonCss } from "../button/button.styles.js";
import { showMoreCss } from "./show-more.styles.js";

/** Geist Show More: progressive disclosure of one long list. */
@customElement("acme-show-more")
export class AcmeShowMore extends AcmeElement {
  static styles = [sharedCss, showMoreCss, buttonCss, css`:host{display:block}`];
  @property({ type: Boolean, reflect: true }) expanded = false;
  @property({ type: Number }) count = 0;
  @property({ type: Boolean, attribute: "no-border" }) noBorder = false;
  render() {
    return html`<div class=${this.cls("show-more", { "no-border": this.noBorder })}><button class="btn" aria-expanded=${this.expanded} @click=${() => {
      this.expanded = !this.expanded;
      this.dispatchEvent(new CustomEvent("acme-toggle", { detail: { expanded: this.expanded }, bubbles: true }));
    }}>${glyph("chev-d")}${this.expanded ? "Show Less" : this.count ? `Show ${this.count} More` : "Show More"}</button></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-show-more": AcmeShowMore;
  }
}
