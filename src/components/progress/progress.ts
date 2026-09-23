import { animate } from "@lit-labs/motion";
import { html, nothing, type PropertyValues } from "lit";
import { property } from "lit/decorators.js";
import { keyed } from "lit/directives/keyed.js";
import { sharedCss } from "../../base";
import { progressSurfaceCss } from "../../generated/components/progress/progress-surface.styles";
import { atomState } from "../../shared/atom-state";
import { numberAttribute, optionalString } from "../../shared/attributes";
import { resolveProgress } from "../../shared/measurement";
import { readMotionSpring } from "../../shared/motion-spring";
import { Places } from "../../shared/places";
import { RepeatingMotion } from "../../shared/repeating-motion";
import { AcmeSemanticElement } from "../../shared/semantic-element";
import { SpringValue } from "../../shared/spring-value";
export type ProgressVariant = "default" | "success" | "error" | "warning" | "secondary";
/** Task completion with native progress semantics and an explicit indeterminate state.
 * @slot - Optional visible label; otherwise label supplies the accessible name.
 * @csspart root - Progress wrapper.
 * @csspart track - Decorative track.
 * @csspart range - Decorative completed or indeterminate range.
 * @csspart label - Visible label region.
 */
export class AcmeProgress extends AcmeSemanticElement {
  static styles = [sharedCss, progressSurfaceCss];
  @atomState() @property({ noAccessor: true, type: Number, converter: numberAttribute }) value?: number;
  @atomState() @property({ noAccessor: true, type: Number, useDefault: true }) max = 100;
  @atomState() @property({ noAccessor: true, useDefault: true }) label = "";
  @atomState() @property({ noAccessor: true, attribute: "value-text", converter: optionalString }) valueText?: string;
  @atomState() private treatment: ProgressVariant = "default";
  /** @default "default" */
  @property({ noAccessor: true, useDefault: true }) get variant(): ProgressVariant {
    return this.treatment;
  }
  set variant(value: ProgressVariant) {
    if (!["default", "success", "error", "warning", "secondary"].includes(value)) throw new TypeError("Invalid Progress variant");
    const previous = this.treatment;
    this.treatment = value;
    this.requestUpdate("variant", previous);
  }
  @atomState() private shapeValue: "linear" = "linear";
  /** @default "linear" */
  @property({ noAccessor: true, useDefault: true }) get shape(): "linear" {
    return this.shapeValue;
  }
  set shape(value: "linear") {
    if (value !== "linear") throw new TypeError("Progress supports the linear shape");
    const previous = this.shapeValue;
    this.shapeValue = value;
    this.requestUpdate("shape", previous);
  }
  private readonly places = new Places(this, { places: [""] });
  private readonly movement = new SpringValue(
    this,
    () => {
      const reading = this.reading;
      return reading.kind === "determinate" ? reading.ratio : 0;
    },
    () => readMotionSpring(this, "standard", "spatial", "fast"),
  );
  private readonly loop = new RepeatingMotion(this, () => this.reading.kind === "indeterminate");
  private previousKind?: string;
  private diagnostic = "";
  private get reading() {
    return resolveProgress(this.value, this.max);
  }
  protected get semanticTarget() {
    return this.renderRoot?.querySelector<HTMLProgressElement>("progress") ?? undefined;
  }
  protected get semanticDefaults() {
    return this.places.has("") ? { labelledByElements: [this.renderRoot.querySelector<HTMLElement>("[part=label]")!] } : { label: this.label || undefined };
  }
  protected willUpdate(_changes: PropertyValues) {
    const reading = this.reading;
    if (reading.kind !== this.previousKind) {
      this.loop.reset();
      this.previousKind = reading.kind;
    }
    this.movement.update();
    const code = reading.kind === "invalid" ? reading.code : reading.kind === "determinate" && reading.clamped ? "progress-value-clamped" : "";
    if (code && code !== this.diagnostic) console.warn(this.localName, { code });
    this.diagnostic = code;
  }
  protected updated() {
    this.renderRoot.querySelector<HTMLElement>("[part=track]")?.style.setProperty("--_progress-ratio", String(Math.max(0, Math.min(1, this.movement.value))));
  }
  render() {
    const reading = this.reading;
    return html`<div part="root" data-variant=${this.variant} data-invalid=${String(reading.kind === "invalid")}><span part="label" ?hidden=${!this.places.has("")}><slot></slot></span>${reading.kind !== "invalid" ? html`<progress class="sr" max=${reading.max} value=${reading.kind === "determinate" ? reading.value : nothing} aria-valuetext=${this.valueText || nothing}></progress>` : nothing}<div part="track" aria-hidden="true">${reading.kind === "indeterminate" ? keyed(this.loop.key, html`<span part="range" class="indeterminate" ${animate(this.loop.options([{ transform: "translateX(calc(var(--_progress-direction,1) * -100%))" }, { transform: "translateX(calc(var(--_progress-direction,1) * 300%))" }], { duration: 1500, easing: "ease-in-out" }, ["transform"]))}></span>`) : html`<span part="range" class="determinate" ?hidden=${reading.kind === "invalid"}></span>`}</div></div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-progress": AcmeProgress;
  }
}
