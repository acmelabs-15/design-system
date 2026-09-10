import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { pillCss } from "./pill.styles";

/** Geist Pill: the badge shape as a link, white with an inset ring, sm 20 · md 24 · lg 32; a logo may lead in the `icon` slot. */
@customElement("acme-pill")
export class AcmePill extends AcmeElement {
  static styles = [sharedCss, pillCss];
  /** sm · md · lg (small · medium · large also work). */
  @property() size: "sm" | "md" | "lg" | "small" | "medium" | "large" = "md";
  @property({ type: Boolean }) solid = false;
  @property({ type: Boolean }) count = false;
  @property() href = "";
  render() {
    const c = this.cls("pill", { sm: this.size === "sm" || this.size === "small", lg: this.size === "lg" || this.size === "large", solid: this.solid, count: this.count });
    const inner = html`<slot name="icon"></slot><slot></slot>`;
    return this.href ? html`<a class=${c} href=${this.href} part="pill">${inner}</a>` : html`<span class=${c} part="pill">${inner}</span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-pill": AcmePill;
  }
}
