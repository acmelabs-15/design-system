import { property } from "lit/decorators.js";
import type { HelpAlign, HelpSide } from "../../shared/anchored-help";
import { AcmeHoverHelp } from "../../shared/hover-help";
/** Supplementary noninteractive preview for a trigger with its own destination.
 * @slot - Native trigger, usually a navigation link.
 * @slot content - Supplementary preview content; actions belong in Toggle Tip.
 * @csspart root - Trigger wrapper.
 * @csspart content - Native preview surface.
 * @csspart arrow - Decorative pointing arrow.
 * @fires {CustomEvent<{open:boolean,reason:string}>} acme-open-change - User visibility changes.
 */
export class AcmeHoverCard extends AcmeHoverHelp {
  protected override get initialValues() {
    return { side: "bottom", align: "start", openDelay: 600, closeDelay: 300 } as const;
  }
  /** @default "bottom" */
  @property({ noAccessor: true, useDefault: true }) get side(): HelpSide {
    return super.side;
  }
  set side(value: HelpSide) {
    super.side = value;
  }
  /** @default "start" */
  @property({ noAccessor: true, useDefault: true }) get align(): HelpAlign {
    return super.align;
  }
  set align(value: HelpAlign) {
    super.align = value;
  }
  /** @default 600 */
  @property({ noAccessor: true, useDefault: true, type: Number, attribute: "open-delay" }) get openDelay(): number {
    return super.openDelay;
  }
  set openDelay(value: number) {
    super.openDelay = value;
  }
  /** @default 300 */
  @property({ noAccessor: true, useDefault: true, type: Number, attribute: "close-delay" }) get closeDelay(): number {
    return super.closeDelay;
  }
  set closeDelay(value: number) {
    super.closeDelay = value;
  }
  protected get kind() {
    return "hover-card" as const;
  }
  protected previewText() {
    return "";
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-hover-card": AcmeHoverCard;
  }
}
