import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base.js";
import { avatarCss } from "./avatar.styles.js";

/** Geist Avatar: 16 / 24 / 32 / 48 / 64, round; letters at weight 500 on a gray fill. */
@customElement("acme-avatar")
export class AcmeAvatar extends AcmeElement {
  static styles = [sharedCss, avatarCss, css`:host{display:inline-flex}`];
  @property() src = "";
  @property() alt = "";
  @property() size: "xs" | "sm" | "md" | "lg" | "xl" | number = "md";
  @property({ type: Boolean }) placeholder = false;
  @property({ type: Boolean }) square = false;
  @property() hue: "" | "blue" | "amber" | "green" | "purple" = "";
  @property() presence: "" | "on" | "away" | "off" = "";
  render() {
    const sizes: Record<string, number> = { xs: 16, sm: 24, md: 32, lg: 48, xl: 64 };
    const px = typeof this.size === "number" ? this.size : (sizes[this.size] ?? 32);
    const av = html`<span class=${this.cls("avatar", { placeholder: this.placeholder, square: this.square, [`hue-${this.hue}`]: !!this.hue })} style=${`--size:${px}px`} part="avatar">${this.src ? html`<img src=${this.src} alt=${this.alt}>` : html`<slot></slot>`}</span>`;
    return this.presence ? html`<span class="avatar-wrap">${av}<span class=${this.cls("presence", { away: this.presence === "away", off: this.presence === "off" })}></span></span>` : av;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-avatar": AcmeAvatar;
  }
}
