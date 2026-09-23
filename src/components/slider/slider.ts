import { createAtom } from "@tanstack/lit-store";
import { html } from "lit";
import { property } from "lit/decorators.js";
import { sharedCss } from "../../base";
import { AcmeFormElement, nativeValidation } from "../../shared/native-form-element";
import { NativeFormController } from "../../shared/native-form";
import { atomState } from "../../shared/atom-state";
import { addDecimal, snapDecimal } from "../../shared/decimal-step";
import { optionalString } from "../../shared/attributes";
import { Interaction } from "../../shared/interaction";
import { SpringValue } from "../../shared/spring-value";
import { readMotionSpring } from "../../shared/motion-spring";
import { message, messageCatalogs } from "../../shared/messages";
import { StoreSelector } from "../../shared/store-connection";
import { sliderStructureCss } from "../../generated/components/slider/slider-structure.styles";
import { sliderBounds, sliderConfigurationValid, sliderMove, sliderNormalize, sliderSnapshot, sameSliderValues, type SliderConfiguration } from "./slider-values";

type Gesture = Readonly<{ pointer: number; index: number; start: readonly number[]; offset: number; target: HTMLElement; coincident: readonly number[]; origin: number }>;
type Configuration = SliderConfiguration & { orientation: "horizontal" | "vertical"; labels: readonly string[] };
const finite = (value: number, name: string): number => {
  if (!Number.isFinite(value)) throw new RangeError(`${name} must be finite`);
  return value;
};
const optionalNumber = { fromAttribute: (value: string | null) => (value === null ? undefined : Number(value)) };
/** One ordered numeric value per native slider thumb.
 * @slot start - Optional controls before the track.
 * @slot end - Optional controls after the track.
 * @csspart root - The named slider group.
 * @csspart track - The full value track.
 * @csspart range - The active portion of the track.
 * @csspart thumb - Each thumb surface.
 * @csspart label - Each thumb's formatted value indicator.
 * @fires {CustomEvent<{value:readonly number[]}>} acme-input - A live user edit.
 * @fires {CustomEvent<{value:readonly number[]}>} acme-change - A completed user edit.
 */
export class AcmeSlider extends AcmeFormElement<readonly number[], Configuration> {
  static styles = [sharedCss, sliderStructureCss];
  static shadowRootOptions = { ...AcmeFormElement.shadowRootOptions, delegatesFocus: true };
  @atomState() private minimum = 0;
  @atomState() private maximum = 100;
  @atomState() private increment = 1;
  @atomState() private largeIncrement = 10;
  @atomState() private minimumSteps = 0;
  @atomState() private axis: "horizontal" | "vertical" = "horizontal";
  @atomState() private names: readonly string[] = Object.freeze([]);
  @atomState() private formatter?: (value: number, index: number) => string;
  @atomState() private focused = -1;
  @atomState() private lastFocused = 0;
  @atomState() private gesture?: Gesture;
  private cleanupGesture?: () => void;
  private readonly nativeEdit = createAtom<readonly number[] | undefined>(undefined);
  private readonly controls: HTMLInputElement[] = [];
  private readonly interactions: Interaction[] = [];
  private readonly constraint = this.ownerDocument.createElement("input");
  private readonly messages = new StoreSelector(this, () => messageCatalogs);
  private readonly localeUpdates = new StoreSelector(this, () => this.themeContext.scope.effective);
  private readonly indicator = new SpringValue(
    this,
    () => (this.focused >= 0 || this.gesture ? 1 : 0),
    () => readMotionSpring(this, "standard", "effects", "fast"),
  );
  private text(key: string, fallback: string): string {
    return message(this.themeContext.scope.effective.get().locale, key, fallback);
  }
  private configuration(): Configuration {
    return { min: this.min, max: this.max, step: this.step, minStepsBetweenValues: this.minStepsBetweenValues, orientation: this.orientation, labels: this.thumbLabels };
  }
  private constraintsChanged(name: string): void {
    this.endGesture(false);
    this.nativeEdit.set(() => undefined);
    this.nativeForm?.sync();
    this.requestUpdate(name);
  }
  /** @default 0 */
  @property({ noAccessor: true, type: Number, converter: optionalNumber }) get min(): number {
    return this.minimum;
  }
  set min(value: number | undefined) {
    this.minimum = finite(value ?? 0, "min");
    this.constraintsChanged("min");
  }
  /** @default 100 */
  @property({ noAccessor: true, type: Number, converter: optionalNumber }) get max(): number {
    return this.maximum;
  }
  set max(value: number | undefined) {
    this.maximum = finite(value ?? 100, "max");
    this.constraintsChanged("max");
  }
  /** @default 1 */
  @property({ noAccessor: true, type: Number, converter: optionalNumber }) get step(): number {
    return this.increment;
  }
  set step(value: number | undefined) {
    const next = finite(value ?? 1, "step");
    if (next <= 0) throw new RangeError("step must be positive");
    this.increment = next;
    this.constraintsChanged("step");
  }
  /** @default 10 */
  @property({ noAccessor: true, attribute: "large-step", converter: optionalNumber }) get largeStep(): number {
    return this.largeIncrement;
  }
  set largeStep(value: number | undefined) {
    const next = finite(value ?? 10, "largeStep");
    if (next <= 0) throw new RangeError("largeStep must be positive");
    this.largeIncrement = next;
    this.constraintsChanged("largeStep");
  }
  /** @default 0 */
  @property({ noAccessor: true, attribute: "min-steps-between-values", converter: optionalNumber }) get minStepsBetweenValues(): number {
    return this.minimumSteps;
  }
  set minStepsBetweenValues(value: number | undefined) {
    const next = value ?? 0;
    if (!Number.isInteger(next) || next < 0) throw new RangeError("minStepsBetweenValues must be a nonnegative integer");
    this.minimumSteps = next;
    this.constraintsChanged("minStepsBetweenValues");
  }
  /** @default "horizontal" */
  @property({ noAccessor: true, converter: optionalString }) get orientation(): "horizontal" | "vertical" {
    return this.axis;
  }
  set orientation(value: "horizontal" | "vertical" | undefined) {
    const next = value ?? "horizontal";
    if (next !== "horizontal" && next !== "vertical") throw new TypeError("Invalid slider orientation");
    this.axis = next;
    this.constraintsChanged("orientation");
  }
  /** @default [] */
  @property({ noAccessor: true, attribute: "thumb-labels", converter: { fromAttribute: (value: string | null) => (value === null ? undefined : JSON.parse(value)) } })
  get thumbLabels(): readonly string[] {
    return this.names;
  }
  set thumbLabels(value: readonly string[] | undefined) {
    if (value !== undefined && (!Array.isArray(value) || value.some((name) => typeof name !== "string"))) throw new TypeError("thumbLabels must be strings");
    this.names = Object.freeze([...(value ?? [])]);
    this.nativeForm?.sync();
    this.requestUpdate("thumbLabels");
  }
  @property({ noAccessor: true, attribute: false }) get formatValue(): ((value: number, index: number) => string) | undefined {
    return this.formatter;
  }
  set formatValue(value: ((value: number, index: number) => string) | undefined) {
    if (value !== undefined && typeof value !== "function") throw new TypeError("formatValue must be a function");
    this.formatter = value;
    this.nativeForm?.sync();
    this.requestUpdate("formatValue");
  }
  protected readonly nativeForm: NativeFormController<readonly number[], Configuration> = new NativeFormController(this, {
    initialValue: Object.freeze([0]),
    valueAttribute: "value",
    normalize: (value) => {
      const next = sliderSnapshot(value),
        current = this.nativeForm?.value;
      return current && sameSliderValues(current, next) ? current : next;
    },
    fromAttribute: (value) => (value === null ? [0] : sliderSnapshot(JSON.parse(value))),
    toAttribute: JSON.stringify,
    extra: () => this.configuration(),
    serialize: (state) => {
      if (!state.name) return null;
      const data = new FormData();
      for (const value of state.value) data.append(state.name, String(value));
      return data;
    },
    restoration: (state) => JSON.stringify(state.value),
    restore: (value) => (typeof value === "string" ? sliderSnapshot(JSON.parse(value)) : [0]),
    changed: (reason) => {
      if (reason !== "user") {
        this.endGesture(false);
        this.nativeEdit.set(() => undefined);
      }
    },
    target: () => {
      const control = this.controls[Math.min(this.lastFocused, this.controls.length - 1)];
      return control && this.renderRoot?.contains(control) ? control : undefined;
    },
    synchronize: (state, config) => {
      this.ensureControls(state.value.length);
      const valid = sliderConfigurationValid(config, state.value.length),
        disabled = state.disabled || state.platformDisabled || !valid;
      if (disabled) this.endGesture(false);
      const displayed = valid ? sliderNormalize(state.value, config) : state.value.map(() => config.min);
      const invalid = !!state.customValidity || Object.keys(this.validation(state.value, config).flags).length > 0 || !!this.field.description.get()?.invalid;
      for (const [index, input] of this.controls.entries()) {
        input.setAttribute("aria-invalid", String(invalid));
        input.disabled = disabled;
        input.min = String(config.min);
        input.max = String(valid ? config.max : config.min);
        input.step = String(config.step);
        input.value = String(displayed[index]);
        const [low, high] = valid ? sliderBounds(displayed, index, config) : [config.min, config.min];
        input.setAttribute("aria-valuemin", String(low));
        input.setAttribute("aria-valuemax", String(high));
        input.setAttribute("aria-valuenow", String(input.valueAsNumber));
        input.setAttribute("aria-valuetext", this.valueText(input.valueAsNumber, index));
        input.setAttribute("aria-orientation", config.orientation);
        const ownName = this.thumbLabels[index] || (state.value.length === 1 ? this.ariaLabel : null);
        input.setAttribute("aria-label", ownName || this.thumbName(index));
        input.ariaLabelledByElements = state.value.length === 1 && !ownName ? (this.ariaLabelledByElements ?? [...(super.semanticDefaults.labelledByElements ?? [])]) : null;
        input.ariaDescribedByElements = [...(super.semanticDefaults.describedByElements ?? []), ...(this.ariaDescribedByElements ?? [])];
      }
    },
    validate: (state, config) => this.validation(state.value, config),
  });
  private validation(value: readonly number[], config: SliderConfiguration) {
    if (!sliderConfigurationValid(config, value.length)) return { flags: { customError: true }, message: this.text("slider.constraints", "Set valid slider bounds and thumb spacing.") };
    this.constraint.type = "number";
    this.constraint.min = String(config.min);
    this.constraint.max = String(config.max);
    this.constraint.step = String(config.step);
    for (const entry of value) {
      this.constraint.value = String(entry);
      const result = nativeValidation(this.constraint);
      if (Object.keys(result.flags).length) return result;
    }
    if (!sameSliderValues(value, sliderNormalize(value, config))) return { flags: { customError: true }, message: this.text("slider.spacing", "Keep the required space between values.") };
    return { flags: {}, message: "" };
  }
  /** @default [0] */
  @property({ noAccessor: true, type: Array }) get value(): readonly number[] {
    return this.nativeForm.value;
  }
  set value(value: readonly number[]) {
    this.nativeForm.setValue(value);
  }
  /** @default [0] */
  @property({ noAccessor: true, attribute: false }) get defaultValue(): readonly number[] {
    return this.nativeForm.defaultValue;
  }
  set defaultValue(value: readonly number[]) {
    this.nativeForm.setDefaultValue(value);
  }
  private thumbName(index: number): string {
    return (
      this.thumbLabels[index] ||
      (this.value.length === 2
        ? this.text(index ? "slider.maximum" : "slider.minimum", index ? "Maximum" : "Minimum")
        : this.text("slider.thumb", "Value {index} of {count}")
            .replaceAll("{index}", String(index + 1))
            .replaceAll("{count}", String(this.value.length)))
    );
  }
  private valueText(value: number, index: number): string {
    return this.formatValue?.(value, index) ?? new Intl.NumberFormat(this.themeContext.scope.effective.get().locale, { maximumSignificantDigits: 21 }).format(value);
  }
  protected get semanticTarget(): HTMLElement | undefined {
    return this.renderRoot?.querySelector<HTMLElement>("[part=root]") ?? undefined;
  }
  protected get semanticDefaults() {
    return { ...super.semanticDefaults, role: "group" };
  }
  protected semanticUpdated(): void {
    this.nativeForm?.sync();
  }
  private ensureControls(count: number): void {
    if (this.focused >= count) this.focused = -1;
    this.lastFocused = Math.min(this.lastFocused, count - 1);
    while (this.controls.length > count) {
      this.controls.pop()!.remove();
      const controller = this.interactions.pop()!;
      controller.detach();
      this.removeController(controller);
    }
    while (this.controls.length < count) {
      const index = this.controls.length,
        input = this.ownerDocument.createElement("input");
      input.type = "range";
      input.className = "native";
      input.addEventListener("keydown", (event) => this.key(event, index));
      input.addEventListener("focus", () => {
        this.focused = this.lastFocused = index;
      });
      input.addEventListener("blur", () => {
        if (this.gesture?.index === index) this.endGesture(false);
        this.focused = -1;
      });
      input.addEventListener("input", (event) => {
        event.stopPropagation();
        if (this.gesture || input.disabled) return;
        this.nativeEdit.set(this.nativeEdit.get() ?? this.value);
        this.edit(index, input.valueAsNumber);
      });
      input.addEventListener("change", (event) => {
        event.stopPropagation();
        if (this.gesture || input.disabled) return;
        const previous = this.nativeEdit.get() ?? this.value;
        this.edit(index, input.valueAsNumber);
        this.nativeEdit.set(() => undefined);
        if (!sameSliderValues(previous, this.value)) this.emit("acme-change");
      });
      this.controls.push(input);
      this.interactions.push(new Interaction(this, { disabled: () => input.disabled }));
    }
  }
  private emit(type: "acme-input" | "acme-change"): void {
    this.dispatchEvent(new CustomEvent(type, { detail: { value: this.value }, bubbles: true, composed: true }));
  }
  private edit(index: number, candidate: number): boolean {
    if (this.nativeForm.effectiveDisabled || !sliderConfigurationValid(this.configuration(), this.value.length)) return false;
    const baseline = sliderNormalize(this.value, this.configuration()),
      next = sliderMove(baseline, index, candidate, this.configuration());
    if (sameSliderValues(next, this.value)) {
      this.nativeForm.sync();
      return false;
    }
    this.nativeForm.setValue(next, "user");
    const accepted = this.value;
    this.emit("acme-input");
    return this.value === accepted;
  }
  private key(event: KeyboardEvent, index: number): void {
    if (event.defaultPrevented || event.isComposing || event.altKey || event.ctrlKey || event.metaKey || this.controls[index]?.disabled) return;
    const config = this.configuration(),
      current = sliderNormalize(this.value, config),
      [low, high] = sliderBounds(current, index, config),
      amount = event.shiftKey || event.key.startsWith("Page") ? this.largeStep : this.step;
    const rtl = this.ownerDocument.defaultView!.getComputedStyle(this).direction === "rtl";
    let next: number;
    switch (event.key) {
      case "Home":
        next = low;
        break;
      case "End":
        next = high;
        break;
      case "ArrowUp":
      case "PageUp":
        next = addDecimal(current[index]!, amount);
        break;
      case "ArrowDown":
      case "PageDown":
        next = addDecimal(current[index]!, -amount);
        break;
      case "ArrowRight":
        next = addDecimal(current[index]!, this.orientation === "horizontal" && rtl ? -amount : amount);
        break;
      case "ArrowLeft":
        next = addDecimal(current[index]!, this.orientation === "horizontal" && rtl ? amount : -amount);
        break;
      default:
        return;
    }
    event.preventDefault();
    this.endGesture(false);
    this.nativeEdit.set(() => undefined);
    next = Math.max(low, Math.min(high, next));
    if (next !== current[index]) next = snapDecimal(next, this.step, this.min, next > current[index]! ? "ceil" : "floor");
    if (this.edit(index, next)) this.emit("acme-change");
  }
  private pointerValue(event: PointerEvent, offset = 0): number | undefined {
    const track = this.renderRoot.querySelector<HTMLElement>("[part=track]")!,
      rect = track.getBoundingClientRect(),
      vertical = this.orientation === "vertical",
      length = vertical ? rect.height : rect.width;
    if (!length) return undefined;
    const rtl = this.ownerDocument.defaultView!.getComputedStyle(this).direction === "rtl";
    const fraction = vertical ? (rect.bottom - event.clientY + offset) / length : rtl ? (rect.right - event.clientX + offset) / length : (event.clientX - rect.left - offset) / length;
    return this.min + Math.max(0, Math.min(1, fraction)) * (this.max - this.min);
  }
  private pointerDown = (event: PointerEvent): void => {
    if (event.defaultPrevented || event.button !== 0 || !event.isPrimary || this.gesture || this.nativeForm.effectiveDisabled || !sliderConfigurationValid(this.configuration(), this.value.length))
      return;
    const candidate = this.pointerValue(event);
    if (candidate === undefined) return;
    const path = event.composedPath(),
      actual = this.controls.findIndex((input) => path.includes(input));
    let index = actual;
    if (index < 0) {
      const distances = this.controls.map((control) => Math.abs(control.valueAsNumber - candidate));
      index = distances.indexOf(Math.min(...distances));
    }
    const target = event.currentTarget as HTMLElement,
      input = this.controls[index]!,
      thumb = input.parentElement!,
      rect = thumb.getBoundingClientRect();
    const offset = actual < 0 ? 0 : this.orientation === "vertical" ? event.clientY - (rect.top + rect.bottom) / 2 : event.clientX - (rect.left + rect.right) / 2;
    event.preventDefault();
    input.focus({ preventScroll: true });
    this.nativeEdit.set(() => undefined);
    const origin = input.valueAsNumber;
    const coincident = this.controls.flatMap((control, position) => (control.valueAsNumber === origin ? [position] : []));
    this.gesture = { pointer: event.pointerId, index, start: this.value, offset, target, coincident, origin };
    const win = this.ownerDocument.defaultView!;
    const move = (e: PointerEvent) => {
      if (e.pointerId !== this.gesture?.pointer) return;
      if (!this.gesture.target.hasPointerCapture(e.pointerId)) {
        this.endGesture(false);
        return;
      }
      if (!e.buttons) {
        this.endGesture(false);
        return;
      }
      const next = this.pointerValue(e, this.gesture.offset);
      if (next !== undefined) {
        const current = this.gesture;
        const snapped = snapDecimal(next, this.step, this.min);
        if (current.coincident.length > 1 && snapped !== current.origin) {
          const selected = snapped < current.origin ? current.coincident[0]! : current.coincident.at(-1)!;
          this.gesture = { ...current, index: selected, coincident: [] };
          this.controls[selected]!.focus({ preventScroll: true });
        }
        this.edit(this.gesture!.index, next);
      }
    };
    const up = (e: PointerEvent) => {
      if (e.pointerId === this.gesture?.pointer) this.endGesture(this.gesture.target.hasPointerCapture(e.pointerId));
    };
    const cancel = (e: Event) => {
      if (!("pointerId" in e) || (e as PointerEvent).pointerId === this.gesture?.pointer) this.endGesture(false);
    };
    win.addEventListener("pointermove", move);
    win.addEventListener("pointerup", up);
    win.addEventListener("pointercancel", cancel);
    win.addEventListener("blur", cancel);
    target.addEventListener("lostpointercapture", cancel);
    this.cleanupGesture = () => {
      win.removeEventListener("pointermove", move);
      win.removeEventListener("pointerup", up);
      win.removeEventListener("pointercancel", cancel);
      win.removeEventListener("blur", cancel);
      target.removeEventListener("lostpointercapture", cancel);
    };
    try {
      target.setPointerCapture(event.pointerId);
    } catch {
      this.endGesture(false);
      return;
    }
    if (actual < 0) this.edit(index, candidate);
  };
  private endGesture(commit: boolean): void {
    const gesture = this.gesture;
    if (!gesture) return;
    this.gesture = undefined;
    this.cleanupGesture?.();
    this.cleanupGesture = undefined;
    if (gesture.target.hasPointerCapture?.(gesture.pointer)) gesture.target.releasePointerCapture(gesture.pointer);
    if (commit && !sameSliderValues(gesture.start, this.value)) this.emit("acme-change");
  }
  disconnectedCallback(): void {
    this.endGesture(false);
    this.nativeEdit.set(() => undefined);
    this.focused = -1;
    super.disconnectedCallback();
  }
  protected willUpdate(): void {
    this.indicator.update();
  }
  protected updated(): void {
    this.nativeForm.sync();
    this.controls.forEach((input, index) => this.interactions[index]!.attach(input.parentElement));
    this.renderRoot.querySelector<HTMLElement>("[part=root]")?.style.setProperty("--slider-label-opacity", String(Math.max(0, Math.min(1, this.indicator.value))));
  }
  render() {
    const config = this.configuration(),
      valid = sliderConfigurationValid(config, this.value.length),
      percent = (value: number) => (valid ? Math.max(0, Math.min(100, ((value - this.min) / (this.max - this.min)) * 100)) : 0);
    const displayed = this.controls.map((input) => input.valueAsNumber);
    const start = this.value.length > 1 ? percent(displayed[0]!) : 0,
      end = percent(displayed.at(-1)!);
    return html`<div class="root" part="root" data-orientation=${this.orientation} ?data-disabled=${this.nativeForm.effectiveDisabled || !valid}><slot name="start"></slot><div class="control" @pointerdown=${this.pointerDown}><div class="track" part="track"><div class="range" part="range" style=${`--slider-start:${start}%;--slider-end:${100 - end}%`}></div>${this.controls.map((input, index) => html`<span class="thumb" part="thumb" style=${`--slider-position:${percent(displayed[index]!)}%`} ?data-current=${this.focused === index || this.gesture?.index === index}><output class="label" part="label" aria-hidden="true">${this.valueText(displayed[index]!, index)}</output><span class="handle" aria-hidden="true"></span>${input}</span>`)}</div></div><slot name="end"></slot></div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-slider": AcmeSlider;
  }
}
