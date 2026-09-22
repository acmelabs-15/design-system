import { html } from "lit";
import { property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { atomState } from "../../shared/atom-state";
import { badgeCss } from "../../generated/components/badge/badge.styles";
import { badgeStructureCss } from "../../generated/components/badge/badge-structure.styles";
export type BadgeVariant = "gray" | "blue" | "purple" | "amber" | "red" | "pink" | "green" | "teal" | "inverted" | "trial" | "turbo";
export type BadgeSize = "small" | "medium" | "large";
/** A passive status or category label.
 * @slot - Label content.
 * @slot start - Leading content.
 * @slot end - Trailing content.
 * @csspart root - The label surface.
 */
export class AcmeBadge extends AcmeElement {
  static styles = [sharedCss, badgeCss, badgeStructureCss];
  @atomState() @property({ noAccessor: true, useDefault: true }) variant: BadgeVariant = "gray";
  @atomState() @property({ noAccessor: true, useDefault: true }) contrast: "high" | "low" = "high";
  @atomState() @property({ noAccessor: true, useDefault: true }) size: BadgeSize = "medium";
  render() {
    return html`<span class=${this.cls("badge", { [this.variant]: this.variant !== "gray", subtle: this.contrast === "low", sm: this.size === "small", lg: this.size === "large" })} part="root"><slot name="start"></slot><span class="label"><slot></slot></span><slot name="end"></slot></span>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-badge": AcmeBadge;
  }
}
