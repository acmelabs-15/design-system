import { message } from "../../shared/messages";
import { boolish } from "../../base";
import { StoreEffect } from "../../shared/state";
import { createAtom, batch } from "@tanstack/lit-store";
import { ContextProvider } from "@lit/context";
import {
  numberInputContext,
  numberInputPartFor,
  registerNumberInputBoundary,
  isNumberInputBoundary,
  type NumberInputPart,
  type NumberInputOwner,
  type NumberActionState,
} from "../../shared/number-input-context";
import { ComposedParticipants } from "../../shared/composed-participants";
import { PressRepeat } from "../../shared/press-repeat";
import { numberOptionsSnapshot } from "../../shared/number-options";
import { NumberParser } from "@internationalized/number";
import { html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { atomState } from "../../shared/atom-state";
import { AcmeSingleLineControl } from "../../shared/single-line-control";
import { optionalString } from "../../shared/attributes";
import { addDecimal, scaleDecimal } from "../../shared/decimal-step";
import type { NativeFormValidation } from "../../shared/native-form";
import { numberInputStructureCss } from "../../generated/components/number-input/number-input-structure.styles";

export type NumberInputFormatOptions = Omit<Intl.NumberFormatOptions, "notation"> & { notation?: "standard" };
const optionalNumber = { fromAttribute: (value: string | null) => (value === null ? undefined : Number(value)) };
function finite(value: number, name: string): number {
  if (!Number.isFinite(value)) throw new RangeError(name + " must be finite");
  return value;
}
/** Locale-aware numeric editing with native form participation.
 * @slot - Custom increment and decrement parts; defaults supply both actions.
 * @slot start - Content inside the input start.
 * @slot end - Content inside the input end.
 * @slot start-addon - Attached start content.
 * @slot end-addon - Attached end content.
 * @csspart root - The field surface.
 * @csspart input - The native spinbutton input.
 * @csspart control - The numeric action region.
 * @csspart increment - The default native increment button.
 * @csspart decrement - The default native decrement button.
 * @csspart clear - The optional clear action.
 * @fires {CustomEvent<{value:string;valueAsNumber:number}>} acme-input - A live numeric edit or step.
 * @fires {CustomEvent<{value:string;valueAsNumber:number}>} acme-change - A committed numeric edit or action.
 */
export class AcmeNumberInput extends AcmeSingleLineControl {
  static styles = [...AcmeSingleLineControl.styles, numberInputStructureCss];
  /** @default "decimal" */
  @property({ noAccessor: true, attribute: "inputmode", converter: optionalString }) get inputMode(): string {
    return super.inputMode || "decimal";
  }
  set inputMode(value: string | undefined) {
    super.inputMode = value ?? "";
  }
  @atomState() private minimum = Number.MIN_SAFE_INTEGER;
  /** @default -9007199254740991 */
  @property({ noAccessor: true, type: Number, converter: optionalNumber }) get min(): number {
    return this.minimum ?? Number.MIN_SAFE_INTEGER;
  }
  set min(value: number | undefined) {
    this.minimum = finite(value ?? Number.MIN_SAFE_INTEGER, "min");
    this.nativeForm?.sync();
    this.requestUpdate("min");
  }
  @atomState() private maximum = Number.MAX_SAFE_INTEGER;
  /** @default 9007199254740991 */
  @property({ noAccessor: true, type: Number, converter: optionalNumber }) get max(): number {
    return this.maximum ?? Number.MAX_SAFE_INTEGER;
  }
  set max(value: number | undefined) {
    this.maximum = finite(value ?? Number.MAX_SAFE_INTEGER, "max");
    this.nativeForm?.sync();
    this.requestUpdate("max");
  }
  @atomState() private incrementSize?: number;
  /** @default 1 */
  @property({ noAccessor: true, type: Number, converter: optionalNumber }) get step(): number {
    return this.incrementSize ?? (this.formatOptions?.style === "percent" ? 0.01 : 1);
  }
  set step(value: number | undefined) {
    if (value !== undefined && (!Number.isFinite(value) || value <= 0)) throw new RangeError("step must be positive and finite");
    this.incrementSize = value;
    this.nativeForm?.sync();
    this.requestUpdate("step");
  }
  @atomState() private bigIncrement?: number;
  /** @default 10 */
  @property({ noAccessor: true, attribute: "large-step", converter: optionalNumber }) get largeStep(): number {
    return this.bigIncrement ?? scaleDecimal(this.step, 1);
  }
  set largeStep(value: number | undefined) {
    if (value !== undefined && (!Number.isFinite(value) || value <= 0)) throw new RangeError("largeStep must be positive and finite");
    this.bigIncrement = value;
    this.requestUpdate("largeStep");
  }
  @atomState() private littleIncrement?: number;
  /** @default 0.1 */
  @property({ noAccessor: true, attribute: "small-step", converter: optionalNumber }) get smallStep(): number {
    return this.littleIncrement ?? scaleDecimal(this.step, -1);
  }
  set smallStep(value: number | undefined) {
    if (value !== undefined && (!Number.isFinite(value) || value <= 0)) throw new RangeError("smallStep must be positive and finite");
    this.littleIncrement = value;
    this.requestUpdate("smallStep");
  }
  @atomState() private clampOnBlur?: boolean;
  @property({ noAccessor: true, attribute: "clamp-value-on-blur", converter: { fromAttribute: (value: string | null) => (value === null ? undefined : value !== "false") } }) /** @default true */
  get clampValueOnBlur(): boolean {
    return this.clampOnBlur ?? !this.allowOverflow;
  }
  set clampValueOnBlur(value: boolean | undefined) {
    this.clampOnBlur = value;
    this.requestUpdate("clampValueOnBlur");
  }
  @atomState() @property({ noAccessor: true, attribute: "spin-on-press", converter: boolish }) spinOnPress = true;
  @atomState() @property({ noAccessor: true, type: Boolean, attribute: "allow-mouse-wheel" }) allowMouseWheel = false;
  @atomState() @property({ noAccessor: true, type: Boolean, attribute: "allow-overflow" }) allowOverflow = false;
  @atomState() private preferredLocale?: string;
  @property({ noAccessor: true, converter: optionalString }) get locale(): string | undefined {
    return this.preferredLocale;
  }
  set locale(value: string | undefined) {
    if (value !== undefined) Intl.getCanonicalLocales(value);
    this.reformat(() => {
      this.preferredLocale = value;
    });
    this.requestUpdate("locale");
  }
  @atomState() private numberOptions: Readonly<NumberInputFormatOptions> = Object.freeze({});
  @property({
    noAccessor: true,
    type: Object,
    attribute: "format-options",
    converter: { fromAttribute: (value: string | null) => (value === null ? undefined : JSON.parse(value)) },
  }) /** @default {} */
  get formatOptions(): Readonly<NumberInputFormatOptions> {
    return this.numberOptions ?? {};
  }
  set formatOptions(value: NumberInputFormatOptions | undefined) {
    const options = numberOptionsSnapshot(value);
    if (options.notation !== undefined && options.notation !== "standard") throw new RangeError("Number Input supports standard notation");
    new Intl.NumberFormat(this.locale, options);
    this.reformat(() => {
      this.numberOptions = options as Readonly<NumberInputFormatOptions>;
    });
    this.requestUpdate("formatOptions");
  }
  private reformat(change: () => void) {
    const number = this.hasUpdated && this.nativeForm ? this.valueAsNumber : NaN;
    batch(() => {
      change();
      this.cached = undefined;
      this.appliedFormat = this.hasUpdated ? this.formats : undefined;
      if (Number.isFinite(number)) this.value = this.formatValue(number);
      this.nativeForm?.sync();
    });
  }
  private cached?: { key: string; parser: NumberParser; formatter: Intl.NumberFormat };
  private appliedFormat?: { key: string; parser: NumberParser; formatter: Intl.NumberFormat };
  private readonly inheritedFormat = new StoreEffect(
    this,
    () => this.themeContext.scope.effective,
    () => this.synchronizeFormat(),
  );
  private synchronizeFormat() {
    const next = this.formats,
      previous = this.appliedFormat;
    this.appliedFormat = next;
    if (this.hasUpdated && previous && previous.key !== next.key && this.value) {
      const number = previous.parser.isValidPartialNumber(this.value) ? previous.parser.parse(this.value) : NaN;
      if (Number.isFinite(number)) this.value = this.formatValue(number);
    }
  }
  connectedCallback() {
    super.connectedCallback();
    this.synchronizeFormat();
  }

  private get formats() {
    const locale = this.locale ?? this.themeContext.scope.effective.get().locale;
    const options = this.formatOptions ?? {};
    const key = JSON.stringify([locale, options]);
    if (this.cached?.key !== key) this.cached = { key, parser: new NumberParser(locale ?? "en-US", options), formatter: new Intl.NumberFormat(locale, { maximumFractionDigits: 20, ...options }) };
    return this.cached;
  }
  private formatValue(number: number): string {
    const text = this.formats.formatter.format(number),
      options = this.formatOptions;
    if (options.maximumFractionDigits !== undefined || options.maximumSignificantDigits !== undefined || Object.is(this.formats.parser.parse(text), number)) return text;
    return new Intl.NumberFormat(this.locale ?? this.themeContext.scope.effective.get().locale, { ...options, maximumSignificantDigits: 21 }).format(number);
  }
  private parseValue(value: string): number {
    const parser = this.formats.parser;
    return value && parser.isValidPartialNumber(value) ? parser.parse(value) : NaN;
  }
  get valueAsNumber(): number {
    return this.parseValue(this.value);
  }
  protected configuration() {
    return JSON.stringify([super.configuration(), this.min, this.max, this.step, this.allowOverflow, this.locale, this.formatOptions, this.themeContext.scope.effective.get().locale]);
  }
  protected serializeValue(value: string) {
    const number = this.parseValue(value);
    return Number.isFinite(number) ? String(number) : "";
  }
  protected validateValue(): NativeFormValidation {
    const native = super.validateValue();
    if (!this.control.willValidate || Object.values(native.flags).some(Boolean)) return native;
    if (!Number.isFinite(this.min) || !Number.isFinite(this.max) || this.min > this.max)
      return { flags: { customError: true }, message: this.text("numberInput.bounds", "The number limits are invalid.") };
    if (!this.value) return native;
    const number = this.valueAsNumber;
    if (!Number.isFinite(number)) return { flags: { badInput: true }, message: this.text("numberInput.number", "Enter a valid number.") };
    if (number < this.min) return { flags: { rangeUnderflow: true }, message: this.text("numberInput.minimum", "The value is below the minimum.") };
    if (number > this.max) return { flags: { rangeOverflow: true }, message: this.text("numberInput.maximum", "The value exceeds the maximum.") };
    return native;
  }
  private readonly committed = createAtom<string | undefined>(undefined);
  protected emitValue(type: "acme-input" | "acme-change") {
    if (type === "acme-input") this.committed.set(() => undefined);
    else {
      if (this.committed.get() === this.value) return;
      this.committed.set(this.value);
    }
    this.dispatchEvent(new CustomEvent(type, { detail: { value: this.value, valueAsNumber: this.valueAsNumber }, bubbles: true, composed: true }));
  }
  protected onNativeInput(event: InputEvent) {
    if (!event.isComposing && !this.formats.parser.isValidPartialNumber(this.control.value)) {
      this.control.value = this.value;
      return;
    }
    super.onNativeInput(event);
  }
  protected onNativeChange() {
    if (this.nativeForm.effectiveDisabled || this.readOnly) return;
    const number = this.valueAsNumber;
    if (Number.isFinite(number)) {
      const next = this.clampValueOnBlur ? Math.max(this.min, Math.min(this.max, number)) : number;
      this.value = this.formatValue(next);
    }
    this.emitValue("acme-change");
  }
  protected prepareSubmission() {
    this.onNativeChange();
  }
  protected text(key: string, fallback: string) {
    return this.locale === undefined ? super.text(key, fallback) : message(this.locale, key, fallback);
  }
  private stepBy(direction: 1 | -1, step = this.step, commit = true): boolean {
    if (this.nativeForm.effectiveDisabled || this.readOnly) return false;
    if (Number.isNaN(step) || step <= 0) return false;
    const value = this.valueAsNumber;
    let number = step === Infinity ? direction * Infinity : addDecimal(Number.isFinite(value) ? value : 0, direction * step);
    if (!this.allowOverflow) number = Math.max(this.min, Math.min(this.max, number));
    if (!Number.isFinite(number)) return false;
    return this.changeNumber(number, commit);
  }
  private changeNumber(number: number, commit: boolean): boolean {
    if (!Number.isFinite(number)) return false;
    const previous = this.value;
    this.value = this.formatValue(number);
    if (this.value !== previous) {
      this.emitValue("acme-input");
      if (commit) this.emitValue("acme-change");
      return true;
    }
    return false;
  }
  private readonly repeat = new PressRepeat(this, {
    disabled: () => this.nativeForm.effectiveDisabled || this.readOnly,
    repeat: () => this.spinOnPress,
    step: (direction) => this.stepBy(direction, this.step, false),
    commit: () => this.emitValue("acme-change"),
    focus: () => this.focus({ preventScroll: true }),
  });
  increment() {
    this.stepBy(1);
  }
  decrement() {
    this.stepBy(-1);
  }
  constructor() {
    super();
    registerNumberInputBoundary(this);
    this.control.addEventListener("beforeinput", (raw) => {
      const event = raw as InputEvent;
      if (event.defaultPrevented || event.isComposing || event.inputType.startsWith("delete") || event.data === null) return;
      const input = this.control as HTMLInputElement;
      const next = input.value.slice(0, input.selectionStart ?? 0) + event.data + input.value.slice(input.selectionEnd ?? 0);
      if (!this.formats.parser.isValidPartialNumber(next)) event.preventDefault();
    });
    this.control.addEventListener("paste", (raw) => {
      const event = raw as ClipboardEvent;
      if (event.defaultPrevented) return;
      const text = event.clipboardData?.getData("text/plain");
      if (text === undefined) return;
      const input = this.control as HTMLInputElement;
      const next = input.value.slice(0, input.selectionStart ?? 0) + text.replace(/\r\n?|\n/g, "") + input.value.slice(input.selectionEnd ?? 0);
      if (!this.formats.parser.isValidPartialNumber(next)) event.preventDefault();
    });
    this.control.addEventListener("keydown", (raw) => {
      const event = raw as KeyboardEvent;
      if (event.defaultPrevented || event.isComposing || this.readOnly || this.nativeForm.effectiveDisabled) return;
      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        event.preventDefault();
        this.stepBy(event.key === "ArrowUp" ? 1 : -1, event.altKey ? this.smallStep : event.shiftKey ? this.largeStep : this.step);
      } else if ((event.key === "Home" || event.key === "End") && !event.altKey && !event.metaKey && !event.ctrlKey) {
        event.preventDefault();
        this.changeNumber(event.key === "Home" ? this.min : this.max, true);
      }
    });
    this.control.addEventListener(
      "wheel",
      (raw) => {
        const event = raw as WheelEvent;
        if (
          !this.allowMouseWheel ||
          event.ctrlKey ||
          event.metaKey ||
          (this.renderRoot as ShadowRoot)?.activeElement !== this.control ||
          this.readOnly ||
          this.nativeForm.effectiveDisabled ||
          !event.deltaY
        )
          return;
        event.preventDefault();
        this.stepBy(event.deltaY < 0 ? 1 : -1);
      },
      { passive: false },
    );
  }
  private readonly actionState = createAtom<NumberActionState>(() => {
    const number = this.valueAsNumber,
      baseline = Number.isFinite(number) ? number : 0;
    return {
      disabled: this.nativeForm.effectiveDisabled || this.readOnly,
      canIncrement: this.allowOverflow || baseline < this.max,
      canDecrement: this.allowOverflow || baseline > this.min,
      size: this.size,
      incrementLabel: this.text("numberInput.increment", "Increase value"),
      decrementLabel: this.text("numberInput.decrement", "Decrease value"),
    };
  });
  private readonly participants = createAtom<readonly NumberInputPart[]>([]);
  private readonly numberOwner: NumberInputOwner = {
    state: this.actionState,
    register: (part) => {
      if (!this.participants.get().includes(part)) this.participants.set([...this.participants.get(), part]);
    },
    unregister: (part) => this.participants.set(this.participants.get().filter((item) => item !== part)),
    step: (direction) => this.stepBy(direction),
    press: (event, direction) => this.repeat.start(event, direction),
    release: (target) => this.repeat.stop(target),
  };
  private readonly numberContext = new ContextProvider(this, { context: numberInputContext, initialValue: this.numberOwner });
  private readonly scopes = new ComposedParticipants(this, {
    owner: this.numberOwner,
    parts: () => this.participants.get(),
    find: numberInputPartFor,
    boundary: isNumberInputBoundary,
    slots: () => Array.from(this.renderRoot?.querySelectorAll<HTMLSlotElement>(".number-control slot") ?? []),
  });
  protected get trackedPlaces() {
    return [...super.trackedPlaces, ""];
  }
  protected trailing() {
    const custom = this.places.has("");
    return html`<span class="number-control" part="control"><slot ?hidden=${!custom} @slotchange=${this.places.read}></slot>${custom ? nothing : html`<acme-number-input-decrement exportparts="root:decrement"></acme-number-input-decrement><acme-number-input-increment exportparts="root:increment"></acme-number-input-increment>`}</span>`;
  }

  protected get effectiveInvalid(): boolean {
    const value = this.nativeForm?.value ?? "";
    const number = this.parseValue(value);
    return super.effectiveInvalid || (value !== "" && (!Number.isFinite(number) || number < this.min || number > this.max));
  }
  protected get semanticDefaults() {
    return { ...super.semanticDefaults, role: "spinbutton" };
  }
  protected updated() {
    this.appliedFormat ??= this.formats;
    super.updated();
    if (this.nativeForm.effectiveDisabled || this.readOnly) this.repeat.stop();
    this.control.setAttribute("aria-valuemin", String(this.min));
    this.control.setAttribute("aria-valuemax", String(this.max));
    if (Number.isFinite(this.valueAsNumber)) this.control.setAttribute("aria-valuenow", String(this.valueAsNumber));
    else this.control.removeAttribute("aria-valuenow");
    this.control.setAttribute("aria-valuetext", this.value);
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-number-input": AcmeNumberInput;
  }
}
