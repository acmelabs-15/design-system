import { html, nothing, type PropertyValues } from "lit";
import { property } from "lit/decorators.js";
import { keyed } from "lit/directives/keyed.js";
import { AnimateController, animate, type Animate } from "@lit-labs/motion";
import { AcmeElement, sharedCss } from "../../base";
import { atomState } from "../../shared/atom-state";
import { spinnerStructureCss } from "../../generated/components/spinner/spinner-structure.styles";

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
  @atomState() private reduced = false;
  @atomState() private generation = 0;
  private media?: MediaQueryList;
  private readonly motion = new AnimateController(this, {});
  private readonly directives = new Set<Animate>();
  private readonly preference = () => {
    this.reduced = this.media?.matches ?? false;
    this.restart();
  };
  private restart() {
    this.motion.cancel();
    for (const directive of this.directives) this.removeController(directive);
    this.directives.clear();
    this.generation++;
  }
  connectedCallback() {
    super.connectedCallback();
    this.media = this.ownerDocument.defaultView?.matchMedia?.("(prefers-reduced-motion: reduce)");
    this.media?.addEventListener("change", this.preference);
    this.preference();
  }
  disconnectedCallback() {
    this.media?.removeEventListener("change", this.preference);
    this.media = undefined;
    this.restart();
    super.disconnectedCallback();
  }
  protected willUpdate(changed: PropertyValues) {
    if (changed.has("size")) this.restart();
  }
  render() {
    const size = Object.hasOwn(sizes, this.size) ? this.size : "medium",
      geometry = sizes[size],
      generation = this.generation;
    const frames = (index: number) => (this.isConnected && !this.reduced && generation === this.generation && index < geometry.blades ? [{ opacity: 1 }, { opacity: 0.15 }] : undefined);
    const label = this.label.trim();
    return html`<span class="spinner" data-size=${size} part="root" role=${label ? "status" : nothing} aria-labelledby=${label ? "status-label" : nothing} aria-atomic=${label ? "true" : nothing} aria-hidden=${label ? nothing : "true"}>${keyed(
      generation,
      Array.from(
        { length: geometry.blades },
        (_, index) =>
          html`<span class="blade" aria-hidden="true" ${animate({
            properties: ["opacity"],
            disabled: this.reduced,
            in: [{ opacity: 1 }, { opacity: 0.15 }],
            onStart: (directive) => {
              if (generation === this.generation && this.isConnected) this.directives.add(directive);
              else this.removeController(directive);
            },
            onFrames: () => frames(index),
            keyframeOptions: { duration: geometry.duration, iterations: Infinity, easing: "linear", delay: -Math.round((geometry.duration * (geometry.blades - 1 - index)) / geometry.blades) },
          })}></span>`,
      ),
    )}${label ? html`<span id="status-label" class="sr">${label}</span>` : nothing}</span>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-spinner": AcmeSpinner;
  }
}
