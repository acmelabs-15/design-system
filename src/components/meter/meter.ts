import { html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { sharedCss } from "../../base";
import { meterCss } from "../../generated/components/meter/meter.styles";
import { atomState } from "../../shared/atom-state";
import { numberAttribute, optionalString } from "../../shared/attributes";
import { type MeterSize, meterArcs, resolveMeter } from "../../shared/measurement";
import { message, messageCatalogs } from "../../shared/messages";
import { readMotionSpring } from "../../shared/motion-spring";
import { AcmeSemanticElement } from "../../shared/semantic-element";
import { SpringValue } from "../../shared/spring-value";
import { StoreSelector } from "../../shared/store-connection";

export type { MeterSize } from "../../shared/measurement";
/** Circular measurement with native meter semantics only when a value is known.
 * @csspart root - Circular display wrapper.
 * @csspart track - Remaining arc.
 * @csspart range - Measured arc.
 * @csspart value - Optional visual value or loading/empty indicator.
 */
export class AcmeMeter extends AcmeSemanticElement {
  static styles = [sharedCss, meterCss];
  @atomState() @property({ noAccessor: true, type: Number, converter: numberAttribute }) value?: number;
  @atomState() @property({ noAccessor: true, type: Number, useDefault: true }) min = 0;
  @atomState() @property({ noAccessor: true, type: Number, useDefault: true }) max = 100;
  @atomState() @property({ noAccessor: true, type: Number, converter: numberAttribute }) low?: number;
  @atomState() @property({ noAccessor: true, type: Number, converter: numberAttribute }) high?: number;
  @atomState() @property({ noAccessor: true, type: Number, converter: numberAttribute }) optimum?: number;
  @atomState() @property({ noAccessor: true, type: Boolean, attribute: "show-value" }) showValue = false;
  @atomState() @property({ noAccessor: true, type: Boolean }) loading = false;
  @atomState() @property({ noAccessor: true, useDefault: true }) label = "";
  @atomState() @property({ noAccessor: true, attribute: "value-text", converter: optionalString }) valueText?: string;
  @atomState() private scale: MeterSize = "small";
  /** @default "small" */
  @property({ noAccessor: true, useDefault: true }) get size(): MeterSize {
    return this.scale;
  }
  set size(value: MeterSize) {
    if (!["tiny", "small", "medium", "large"].includes(value)) throw new TypeError("Invalid Meter size");
    const previous = this.scale;
    this.scale = value;
    this.requestUpdate("size", previous);
  }
  private get reading() {
    return resolveMeter({ value: this.value, min: this.min, max: this.max, low: this.low, high: this.high, optimum: this.optimum, loading: this.loading });
  }
  private readonly motion = new SpringValue(
    this,
    () => {
      const reading = this.reading;
      return reading.kind === "known" ? reading.ratio : 0;
    },
    () => readMotionSpring(this, "standard", "spatial", "default"),
  );
  private readonly localeUpdates = new StoreSelector(this, () => this.themeContext.scope.effective);
  private readonly messageUpdates = new StoreSelector(this, () => messageCatalogs);
  private diagnostic = "";
  protected get semanticTarget() {
    return this.renderRoot?.querySelector<HTMLElement>("[data-semantic]") ?? undefined;
  }
  protected get semanticDefaults() {
    const reading = this.reading;
    if (reading.kind === "known") return { label: this.label || undefined };
    const state = message(this.themeContext.scope.effective.get().locale, reading.kind === "loading" ? "meter.loading" : "meter.unavailable", reading.kind === "loading" ? "Loading" : "Unavailable");
    return { role: "img", label: [this.label, state].filter(Boolean).join(": ") };
  }
  protected willUpdate() {
    this.motion.update();
    const reading = this.reading;
    const code = reading.kind === "invalid" ? reading.code : reading.kind === "known" && reading.clamped ? "meter-value-clamped" : "";
    if (code && code !== this.diagnostic) console.warn(this.localName, { code });
    this.diagnostic = code;
  }
  protected updated() {
    const reading = this.reading,
      geometry = meterArcs(reading.kind === "known" ? 100 * this.motion.value : 0, this.size);
    const root = this.renderRoot.querySelector<HTMLElement>("[part=root]")!;
    root.style.setProperty("--_meter-primary", String(geometry.primary));
    root.style.setProperty("--_meter-secondary", String(geometry.secondary));
    root.style.setProperty("--_meter-secondary-rotation", `${geometry.secondaryRotation}deg`);
  }
  render() {
    const reading = this.reading,
      known = reading.kind === "known",
      geometry = meterArcs(known ? 100 * this.motion.value : 0, this.size);
    const value = known && this.showValue ? new Intl.NumberFormat(this.themeContext.scope.effective.get().locale, { notation: "compact", maximumSignificantDigits: 3 }).format(reading.value) : "";
    return html`<span part="root" data-size=${this.size} data-tone=${known ? reading.tone : "neutral"}>${known ? html`<meter data-semantic class="sr" min=${reading.min} max=${reading.max} value=${reading.value} low=${this.low ?? nothing} high=${this.high ?? nothing} optimum=${this.optimum ?? nothing} aria-valuetext=${this.valueText || nothing}></meter>` : html`<span data-semantic class="sr" aria-busy=${String(reading.kind === "loading")}></span>`}<svg viewBox="0 0 100 100" aria-hidden="true" fill="none"><circle part="track" cx="50" cy="50" r=${geometry.radius} pathLength="100" stroke-width=${geometry.stroke} stroke-linecap="round" opacity=${geometry.secondary > 0 ? 1 : 0}></circle><circle part="range" cx="50" cy="50" r=${geometry.radius} pathLength="100" stroke-width=${geometry.stroke} stroke-linecap="round" opacity=${known && geometry.primary > 0 ? 1 : 0}></circle></svg><span part="value" aria-hidden="true">${reading.kind === "loading" ? html`<acme-spinner size=${this.size === "tiny" ? "small" : "medium"}></acme-spinner>` : known ? value : "—"}</span></span>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-meter": AcmeMeter;
  }
}
