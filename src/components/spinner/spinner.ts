import { animate } from "@lit-labs/motion";
import { html, nothing, type PropertyValues } from "lit";
import { property } from "lit/decorators.js";
import { keyed } from "lit/directives/keyed.js";
import { AcmeElement, sharedCss } from "../../base";
import { spinnerStructureCss } from "../../generated/components/spinner/spinner-structure.styles";
import { atomState } from "../../shared/atom-state";
import { RepeatingMotion } from "../../shared/repeating-motion";

export type SpinnerSize = "small" | "medium" | "large" | "extraLarge" | "extraExtraLarge";
const sizes: Record<SpinnerSize, { blades: number; duration: number }> = {
  small: { blades: 8, duration: 1000 },
  medium: { blades: 10, duration: 1000 },
  large: { blades: 12, duration: 1200 },
  extraLarge: { blades: 12, duration: 1200 },
  extraExtraLarge: { blades: 15, duration: 1200 },
};

/** Indeterminate activity. Supply label when this element owns the status announcement.
 * @csspart root - The spinner surface.
 */
export class AcmeSpinner extends AcmeElement {
  static styles = [sharedCss, spinnerStructureCss];
  @atomState() @property({ noAccessor: true, useDefault: true }) size: SpinnerSize = "medium";
  @atomState() @property({ noAccessor: true, useDefault: true }) label = "";
  private readonly motion = new RepeatingMotion(this, () => true);
  protected willUpdate(changed: PropertyValues) {
    if (changed.has("size")) this.motion.reset();
  }
  render() {
    const size = Object.hasOwn(sizes, this.size) ? this.size : "medium",
      geometry = sizes[size],
      generation = this.motion.key;
    const label = this.label.trim();
    return html`<span class="spinner" data-size=${size} part="root" role=${label ? "status" : nothing} aria-labelledby=${label ? "status-label" : nothing} aria-atomic=${label ? "true" : nothing} aria-hidden=${label ? nothing : "true"}>${keyed(
      generation,
      Array.from(
        { length: geometry.blades },
        (_, index) =>
          html`<span class="blade" aria-hidden="true" ${animate(this.motion.options([{ opacity: 1 }, { opacity: 0.15 }], { duration: geometry.duration, easing: "linear", delay: -Math.round((geometry.duration * (geometry.blades - 1 - index)) / geometry.blades) }))}></span>`,
      ),
    )}${label ? html`<span id="status-label" class="sr">${label}</span>` : nothing}</span>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-spinner": AcmeSpinner;
  }
}
