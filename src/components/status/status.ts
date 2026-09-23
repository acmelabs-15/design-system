import { type Animate, AnimateController, animate } from "@lit-labs/motion";
import { html, type PropertyValues } from "lit";
import { property } from "lit/decorators.js";
import { keyed } from "lit/directives/keyed.js";
import { sharedCss } from "../../base";
import { statusCss } from "../../generated/components/status/status.styles";
import { atomState } from "../../shared/atom-state";
import { optionalString } from "../../shared/attributes";
import { AcmeSemanticElement } from "../../shared/semantic-element";
export type StatusVariant = "neutral" | "info" | "success" | "warning" | "error";
/** Application-defined status with a decorative indicator and readable text.
 * @slot - Visible label instead of label or value text.
 * @csspart root - Status wrapper.
 * @csspart indicator - Decorative status indicator.
 * @csspart label - Visible label.
 */
export class AcmeStatus extends AcmeSemanticElement {
  static styles = [sharedCss, statusCss];
  /** Required application status identifier. @default "" */
  @atomState() @property({ noAccessor: true, useDefault: true }) value = "";
  @atomState() @property({ noAccessor: true, converter: optionalString }) label?: string;
  @atomState() private treatment: StatusVariant = "neutral";
  /** @default "neutral" */
  @property({ noAccessor: true, useDefault: true }) get variant(): StatusVariant {
    return this.treatment;
  }
  set variant(value: StatusVariant) {
    if (!["neutral", "info", "success", "warning", "error"].includes(value)) throw new TypeError("Invalid Status variant");
    const previous = this.treatment;
    this.treatment = value;
    this.requestUpdate("variant", previous);
  }
  @atomState() @property({ noAccessor: true, type: Boolean }) pulse = false;
  @atomState() private reduced = false;
  @atomState() private generation = 0;
  private media?: MediaQueryList;
  private readonly motion = new AnimateController(this, {});
  private readonly directives = new Set<Animate>();
  private restart() {
    this.motion.cancel();
    for (const directive of this.directives) this.removeController(directive);
    this.directives.clear();
    this.generation++;
  }
  private preference = () => {
    this.reduced = this.media?.matches ?? false;
    this.restart();
  };
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
  protected willUpdate(changes: PropertyValues) {
    if (changes.has("pulse")) this.restart();
  }
  render() {
    const generation = this.generation,
      frames = [{ opacity: 1 }, { opacity: 0.4 }, { opacity: 1 }];
    return html`<span part="root" data-variant=${this.variant}>${keyed(
      generation,
      html`<span part="indicator" aria-hidden="true" ${animate({
        properties: ["opacity"],
        disabled: !this.pulse || this.reduced,
        in: frames,
        onStart: (directive) => {
          if (generation === this.generation && this.isConnected) this.directives.add(directive);
          else this.removeController(directive);
        },
        onFrames: () => (this.isConnected && this.pulse && !this.reduced && generation === this.generation ? frames : undefined),
        keyframeOptions: { duration: 1400, iterations: Infinity, easing: "ease-in-out" },
      })}></span>`,
    )}<span part="label"><slot>${this.label || this.value}</slot></span></span>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-status": AcmeStatus;
  }
}
