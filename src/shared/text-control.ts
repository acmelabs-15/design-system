import { createAtom } from "@tanstack/lit-store";
import { property } from "lit/decorators.js";
import { AcmeReadOnlyFormElement, nativeValidation } from "./native-form-element";
import { NativeFormController, type NativeFormValidation } from "./native-form";
import { atomState } from "./atom-state";
import { createInheritedAppearance } from "./inherited-appearance";
import { StoreSelector } from "./store-connection";
import { optionalString } from "./attributes";
import { GroupMemberController, groupMemberStyles } from "./group-member";
import { sharedCss } from "../base";
import { textControlCss } from "../generated/shared/text-control.styles";
export type TextNativeControl = HTMLInputElement | HTMLTextAreaElement;
type TextOptions = Readonly<{ placeholder: string; autocomplete: string; inputMode: string; minLength: number; maxLength: number; configuration: string }>;
const optionalLength = { fromAttribute: (value: string | null) => (value === null ? -1 : Number(value)) };
/** Shared native string state, editing constraints and Field presentation for text controls. */
export abstract class AcmeTextControl extends AcmeReadOnlyFormElement<string, TextOptions> {
  static styles = [sharedCss, groupMemberStyles, textControlCss];
  static shadowRootOptions = { ...AcmeReadOnlyFormElement.shadowRootOptions, delegatesFocus: true };
  protected abstract createControl(): TextNativeControl;
  protected readonly control = this.createControl();
  private readonly normalizer = this.createControl();
  protected configuration() {
    return "";
  }
  protected configure(_control: TextNativeControl): void {}
  @atomState() private hint = "";
  /** @default "" */
  @property({ noAccessor: true }) get placeholder() {
    return this.hint;
  }
  set placeholder(value: string) {
    this.hint = String(value ?? "");
    this.nativeForm?.sync();
    this.requestUpdate("placeholder");
  }
  @atomState() private completion = "";
  /** @default "" */
  @property({ noAccessor: true }) get autocomplete() {
    return this.completion;
  }
  set autocomplete(value: string) {
    this.completion = String(value ?? "");
    this.nativeForm?.sync();
    this.requestUpdate("autocomplete");
  }
  @atomState() private keyboard = "";
  /** @default "" */
  @property({ noAccessor: true, attribute: "inputmode" }) get inputMode() {
    return this.keyboard;
  }
  set inputMode(value: string) {
    this.keyboard = String(value ?? "");
    this.nativeForm?.sync();
    this.requestUpdate("inputMode");
  }
  @atomState() private minimumLength = -1;
  /** @default -1 */
  @property({ noAccessor: true, attribute: "minlength", converter: optionalLength }) get minLength(): number {
    return this.minimumLength;
  }
  set minLength(value: number | undefined) {
    const next = value ?? -1;
    if (!Number.isInteger(next) || next < -1) throw new RangeError("minLength must be -1 or a nonnegative integer");
    this.minimumLength = next;
    this.nativeForm?.sync();
    this.requestUpdate("minLength");
  }
  @atomState() private maximumLength = -1;
  /** @default -1 */
  @property({ noAccessor: true, attribute: "maxlength", converter: optionalLength }) get maxLength(): number {
    return this.maximumLength;
  }
  set maxLength(value: number | undefined) {
    const next = value ?? -1;
    if (!Number.isInteger(next) || next < -1) throw new RangeError("maxLength must be -1 or a nonnegative integer");
    this.maximumLength = next;
    this.nativeForm?.sync();
    this.requestUpdate("maxLength");
  }
  @atomState() @property({ noAccessor: true, type: Boolean }) invalid = false;
  protected readonly appearance = createInheritedAppearance({ size: { supported: ["small", "medium", "large"] as const, defaultValue: "medium" } });
  private readonly appearanceUpdates = new StoreSelector(this, () => this.appearance.effective);
  /** @default "medium" */
  @property({ noAccessor: true, converter: optionalString }) get size(): "small" | "medium" | "large" {
    return this.appearance.effective.get().size!;
  }
  set size(value: "small" | "medium" | "large" | undefined) {
    if (value !== undefined && !["small", "medium", "large"].includes(value)) throw new TypeError("Invalid text control size");
    const previous = this.size;
    this.appearance.setAuthored({ size: value });
    this.requestUpdate("size", previous);
  }
  protected get effectiveInvalid() {
    return this.invalid || (this.field.description.get()?.invalid ?? false);
  }
  protected get surface() {
    return this.renderRoot?.querySelector<HTMLElement>("[part=root]") ?? undefined;
  }
  private readonly group = new GroupMemberController(this, { surface: () => this.surface, appearance: this.appearance, emphasized: () => this.effectiveInvalid });
  protected readonly nativeForm = new NativeFormController<string, TextOptions>(this, {
    initialValue: "",
    valueAttribute: "value",
    fromAttribute: (value) => value ?? "",
    toAttribute: String,
    normalizeDefault: (value) => String(value ?? ""),
    normalize: (value) => {
      this.configure(this.normalizer);
      this.normalizer.value = String(value ?? "");
      return this.normalizer.value;
    },
    extra: () => ({
      placeholder: this.placeholder,
      autocomplete: this.autocomplete,
      inputMode: this.inputMode,
      minLength: this.minLength,
      maxLength: this.maxLength,
      configuration: this.configuration(),
    }),
    serialize: (state) => this.serializeValue(state.value),
    restoration: (state) => state.value,
    restore: (value) => (typeof value === "string" ? value : ""),
    target: () => (this.control.isConnected ? this.control : undefined),
    synchronize: (state, options) => {
      this.configure(this.control);
      if (this.control.defaultValue !== state.defaultValue) this.control.defaultValue = state.defaultValue;
      if (this.control.value !== state.value) this.control.value = state.value;
      this.control.name = state.name;
      this.control.disabled = state.disabled || state.platformDisabled;
      this.control.required = state.required;
      this.control.readOnly = state.readOnly;
      this.control.placeholder = options.placeholder;
      this.control.autocomplete = options.autocomplete as AutoFill;
      this.control.inputMode = options.inputMode;
      for (const [attribute, value] of [
        ["minlength", options.minLength],
        ["maxlength", options.maxLength],
      ] as const) {
        if (value < 0) this.control.removeAttribute(attribute);
        else if (this.control.getAttribute(attribute) !== String(value)) this.control.setAttribute(attribute, String(value));
      }
    },
    validate: () => this.validateValue(),
  });
  private readonly display = createAtom(() => ({ disabled: this.nativeForm.effectiveDisabled, invalid: this.effectiveInvalid, readOnly: this.readOnly }));
  private readonly displayUpdates = new StoreSelector(this, () => this.display);
  /** @default "" */
  @property({ noAccessor: true }) get value() {
    return this.nativeForm.value;
  }
  set value(value: string) {
    this.nativeForm.setValue(String(value ?? ""));
  }
  /** @default "" */
  @property({ noAccessor: true, attribute: false }) get defaultValue() {
    return this.nativeForm.defaultValue;
  }
  set defaultValue(value: string) {
    this.nativeForm.setDefaultValue(String(value ?? ""));
  }
  protected emitValue(type: "acme-input" | "acme-change") {
    this.dispatchEvent(new CustomEvent<{ value: string }>(type, { detail: { value: this.value }, bubbles: true, composed: true }));
  }
  protected serializeValue(value: string): string {
    return value;
  }
  protected validateValue(): NativeFormValidation {
    return nativeValidation(this.control);
  }
  protected edited(): void {}
  protected onNativeInput(_event: InputEvent): void {
    if (this.nativeForm.effectiveDisabled || this.readOnly) return;
    this.nativeForm.setValue(this.control.value, "user");
    this.edited();
    this.emitValue("acme-input");
  }
  protected onNativeChange(): void {
    if (this.nativeForm.effectiveDisabled || this.readOnly) return;
    this.nativeForm.setValue(this.control.value, "user");
    this.emitValue("acme-change");
  }
  constructor() {
    super();
    this.control.className = "native";
    this.control.addEventListener("input", (event) => this.onNativeInput(event as InputEvent));
    this.control.addEventListener("change", () => this.onNativeChange());
    this.addEventListener("click", (event) => {
      if (event.composedPath()[0] === this) this.focus();
    });
  }
  select() {
    this.control.select();
  }
  setSelectionRange(start: number | null, end: number | null, direction?: "forward" | "backward" | "none") {
    this.control.setSelectionRange(start, end, direction);
  }
  protected updated() {
    this.nativeForm.sync();
    this.control.setAttribute("aria-invalid", String(this.effectiveInvalid));
  }
}
