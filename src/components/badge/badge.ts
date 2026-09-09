import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base.js";
import { badgeCss } from "./badge.styles.js";

export type Hue = "gray" | "blue" | "purple" | "amber" | "red" | "pink" | "green" | "teal";

/** Geist Badge: sm 20 · md 24 · lg 32, capitalized, solid (900 step) or subtle, one hue per meaning. */
@customElement("acme-badge")
export class AcmeBadge extends AcmeElement {
  static styles = [sharedCss, badgeCss];
  @property() hue: Hue = "gray";
  @property() size: "small" | "medium" | "large" = "medium";
  @property({ type: Boolean }) subtle = false;
  @property({ type: Boolean }) inverted = false;
  @property({ type: Boolean }) outline = false;
  render() {
    const c = this.cls("badge", { [this.hue]: this.hue !== "gray", subtle: this.subtle, inverted: this.inverted, outline: this.outline, sm: this.size === "small", lg: this.size === "large" });
    return html`<span class=${c} part="badge"><slot name="icon"></slot><slot></slot></span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-badge": AcmeBadge;
  }
}
