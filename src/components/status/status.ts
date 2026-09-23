import { animate } from "@lit-labs/motion";
import { html, type PropertyValues } from "lit";
import { property } from "lit/decorators.js";
import { keyed } from "lit/directives/keyed.js";
import { sharedCss } from "../../base";
import { statusCss } from "../../generated/components/status/status.styles";
import { atomState } from "../../shared/atom-state";
import { optionalString } from "../../shared/attributes";
import { RepeatingMotion } from "../../shared/repeating-motion";
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
  private readonly motion = new RepeatingMotion(this, () => this.pulse);
  protected willUpdate(changes: PropertyValues) {
    if (changes.has("pulse")) this.motion.reset();
  }
  render() {
    const generation = this.motion.key,
      frames = [{ opacity: 1 }, { opacity: 0.4 }, { opacity: 1 }];
    return html`<span part="root" data-variant=${this.variant}>${keyed(
      generation,
      html`<span part="indicator" aria-hidden="true" ${animate(this.motion.options(frames, { duration: 1400, easing: "ease-in-out" }))}></span>`,
    )}<span part="label"><slot>${this.label || this.value}</slot></span></span>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-status": AcmeStatus;
  }
}
