import { property } from "lit/decorators.js";
import { atomState } from "../../shared/atom-state";
import { AcmeHoverHelp } from "../../shared/hover-help";
/** Short noninteractive descriptions on hover or keyboard focus.
 * @slot - Trigger content; its native focus behavior is preserved.
 * @slot content - Optional noninteractive formatting instead of content text.
 * @csspart root - Trigger wrapper.
 * @csspart content - Native tooltip surface.
 * @csspart arrow - Decorative pointing arrow.
 * @fires {CustomEvent<{open:boolean,reason:string}>} acme-open-change - User visibility changes.
 */
export class AcmeTooltip extends AcmeHoverHelp {
  @atomState() @property({ noAccessor: true, useDefault: true }) content = "";
  protected get kind() {
    return "tooltip" as const;
  }
  protected previewText() {
    return this.content;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-tooltip": AcmeTooltip;
  }
}
