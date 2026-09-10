import { css, html } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { badgeCss } from "./badge.styles";

export type BadgeVariant = "gray" | "blue" | "purple" | "amber" | "red" | "pink" | "green" | "teal" | "inverted" | "trial" | "turbo";
export type BadgeSize = "sm" | "md" | "lg";

/**
 * Badge: a short capitalized label in a pill. The root carries the size, variant and contrast
 * classes; the text sits in its own span; an icon in the `icon` slot leads the text and is sized
 * per size (12 / 14 / 16). Sizes sm 20 · md 24 · lg 32. A hue variant is solid on the hue's
 * strong step with the contrast foreground; `contrast="low"` keeps the hue for the text over a
 * tinted layer. `inverted` is the foreground on the background; `trial` and `turbo` are gradients.
 * A circular glyph icon (`data-glyph="circular"`) pulls in closer; the slot mirrors the marker so
 * the root's rule sees it.
 */
@customElement("acme-badge")
export class AcmeBadge extends AcmeElement {
  static styles = [
    sharedCss,
    badgeCss,
    css`
      :host {
        display: inline-flex;
      }
    `,
  ];
  /** gray · blue · purple · amber · red · pink · green · teal · inverted · trial · turbo. */
  @property() variant: BadgeVariant = "gray";
  /** `low` is the subtle tint: the hue for the text over the hue's light layer. */
  @property() contrast: "high" | "low" = "high";
  /** sm · md · lg. */
  @property() size: BadgeSize = "md";
  @query('slot[name="icon"]') private iconSlot!: HTMLSlotElement;

  /** Mirrors a circular glyph marker from the slotted icon onto the slot, so the root's padding rule can see it. */
  private onIcon = () => {
    const circular = this.iconSlot.assignedElements({ flatten: true }).some((el) => el.matches('[data-glyph="circular"], :has([data-glyph="circular"])'));
    this.iconSlot.toggleAttribute("data-glyph", circular);
    if (circular) this.iconSlot.setAttribute("data-glyph", "circular");
  };

  render() {
    const c = this.cls("badge", {
      [this.variant]: this.variant !== "gray",
      subtle: this.contrast === "low",
      sm: this.size === "sm",
      lg: this.size === "lg",
    });
    return html`<span class=${c} part="badge"><slot name="icon" @slotchange=${this.onIcon}></slot><span class="label"><slot></slot></span></span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-badge": AcmeBadge;
  }
}
