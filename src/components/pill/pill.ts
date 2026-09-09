import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base.js";
import { pillCss } from "./pill.styles.js";

/** Geist Pill: the badge shape as a link, white with an inset ring. */
@customElement("acme-pill")
export class AcmePill extends AcmeElement {
  static styles = [sharedCss, pillCss];
  @property() size: "small" | "medium" | "large" = "medium";
  @property({ type: Boolean }) solid = false;
  @property({ type: Boolean }) count = false;
  @property() href = "";
  render() {
    const c = this.cls("pill", { sm: this.size === "small", lg: this.size === "large", solid: this.solid, count: this.count });
    const inner = html`<slot name="icon"></slot><slot></slot>`;
    return this.href ? html`<a class=${c} href=${this.href} part="pill">${inner}</a>` : html`<span class=${c} part="pill">${inner}</span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-pill": AcmePill;
  }
}
