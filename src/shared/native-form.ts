import { batch, createAtom, type ReadonlyAtom } from "@tanstack/lit-store";
import type { ReactiveController, ReactiveControllerHost, ReactiveElement } from "lit";

export type NativeFormValue = string | File | FormData | null;
export type FormUpdateReason = "programmatic" | "user" | "default" | "reset" | "restore" | "constraints";
export type NativeFormState<Value> = Readonly<{
  value: Value;
  defaultValue: Value;
  dirty: boolean;
  name: string;
  disabled: boolean;
  required: boolean;
  readOnly: boolean;
  platformDisabled: boolean;
  customValidity: string;
}>;
export type NativeFormValidation = Readonly<{ flags: ValidityStateFlags; message: string }>;
type Host = HTMLElement & Omit<ReactiveControllerHost, "requestUpdate"> & Pick<ReactiveElement, "requestUpdate">;
export type NativeFormOptions<Value, Extra> = Readonly<{
  initialValue: Value;
  valueAttribute?: string;
  valueProperty?: string;
  fromAttribute?(value: string | null): Value;
  toAttribute?(value: Value): string | null;
  normalize(value: Value): Value;
  extra?(): Extra;
  serialize(state: NativeFormState<Value>, extra: Extra): NativeFormValue;
  participates?(state: NativeFormState<Value>, extra: Extra): boolean;
  changed?(reason: FormUpdateReason): void;
  restoration?(state: NativeFormState<Value>, extra: Extra): NativeFormValue;
  restore?(value: string | File | FormData, mode: "restore" | "autocomplete"): Value;
  validate?(state: NativeFormState<Value>, extra: Extra): NativeFormValidation;
  target?(): HTMLElement | undefined;
  synchronize?(state: NativeFormState<Value>, extra: Extra, reason: FormUpdateReason): void;
}>;

/** Owns native form mechanics while a family supplies value conversion and native validation. */
export class NativeFormController<Value, Extra = undefined> implements ReactiveController {
  readonly internals: ElementInternals;
  readonly state: ReadonlyAtom<NativeFormState<Value>>;
  private readonly current;
  private readonly tracked;
  private subscription?: { unsubscribe(): void };
  private syncing = false;
  private pendingSync = false;

  constructor(
    private host: Host,
    private options: NativeFormOptions<Value, Extra>,
  ) {
    this.internals = host.attachInternals();
    const initial = options.normalize(options.initialValue);
    this.current = createAtom<NativeFormState<Value>>(
      Object.freeze({ value: initial, defaultValue: initial, dirty: false, name: "", disabled: false, required: false, readOnly: false, platformDisabled: false, customValidity: "" }),
    );
    this.state = createAtom(() => this.current.get());
    this.tracked = createAtom(() => ({ state: this.state.get(), extra: this.options.extra?.() as Extra }));
    host.addController(this);
  }

  get value(): Value {
    return this.state.get().value;
  }
  get defaultValue(): Value {
    return this.state.get().defaultValue;
  }
  get effectiveDisabled(): boolean {
    const state = this.state.get();
    return state.disabled || state.platformDisabled;
  }
  get form(): HTMLFormElement | null {
    return this.internals.form;
  }
  get labels(): NodeList {
    return this.internals.labels;
  }
  get target(): HTMLElement | undefined {
    return this.options.target?.();
  }
  get validity(): ValidityState {
    this.sync();
    return this.internals.validity;
  }
  get validationMessage(): string {
    this.sync();
    return this.internals.validationMessage;
  }
  get willValidate(): boolean {
    this.sync();
    return this.internals.willValidate;
  }

  private change(patch: Partial<NativeFormState<Value>>, reason: FormUpdateReason = "constraints", property?: string): void {
    const previous = this.current.get();
    if (Object.entries(patch).every(([key, value]) => Object.is(previous[key as keyof typeof previous], value))) return;
    batch(() => {
      this.current.set(Object.freeze({ ...previous, ...patch }));
      this.sync(reason);
      this.options.changed?.(reason);
    });
    this.host.requestUpdate(property, property ? previous.value : undefined);
  }
  setValue(value: Value, reason: "programmatic" | "user" = "programmatic"): void {
    const normalized = this.options.normalize(value);
    this.change({ value: normalized, dirty: true }, reason, this.options.valueProperty ?? "value");
  }
  setDefaultValue(value: Value): void {
    const normalized = this.options.normalize(value);
    const attribute = this.options.valueAttribute;
    if (attribute && this.options.toAttribute) {
      const text = this.options.toAttribute(normalized);
      batch(() => (text === null ? this.host.removeAttribute(attribute) : this.host.setAttribute(attribute, text)));
    } else this.applyDefault(normalized);
  }
  private applyDefault(value: Value): void {
    this.change({ defaultValue: value, ...(!this.current.get().dirty ? { value } : {}) }, "default");
  }
  setAttributeValue(name: "name" | "disabled" | "required" | "readonly", value: string | boolean): void {
    batch(() => (typeof value === "boolean" ? this.host.toggleAttribute(name, value) : this.host.setAttribute(name, value)));
  }
  attributeChanged(name: string, _oldValue: string | null, value: string | null): boolean {
    if (name === this.options.valueAttribute && this.options.fromAttribute) {
      this.applyDefault(this.options.normalize(this.options.fromAttribute(value)));
      return true;
    }
    if (name === "name") this.change({ name: value ?? "" });
    else if (name === "disabled") this.change({ disabled: value !== null, platformDisabled: this.host.matches(":disabled") });
    else if (name === "required") this.change({ required: value !== null });
    else if (name === "readonly") this.change({ readOnly: value !== null });
    else if (name === "form") this.sync();
    else return false;
    return true;
  }

  sync(reason: FormUpdateReason = "constraints"): void {
    if (this.syncing) {
      this.pendingSync = true;
      return;
    }
    this.syncing = true;
    try {
      do {
        this.pendingSync = false;
        const { state, extra } = this.tracked.get();
        this.options.synchronize?.(state, extra, reason);
        if (this.pendingSync) continue;
        if (this.options.participates?.(state, extra) === false) {
          this.internals.setFormValue(null);
          this.internals.setValidity({});
          continue;
        }
        const value = this.options.serialize(state, extra);
        this.internals.setFormValue(value, this.options.restoration ? this.options.restoration(state, extra) : value);
        const validation = state.customValidity ? { flags: { customError: true }, message: state.customValidity } : (this.options.validate?.(state, extra) ?? { flags: {}, message: "" });
        this.internals.setValidity(validation.flags, validation.message, Object.values(validation.flags).some(Boolean) ? this.options.target?.() : undefined);
      } while (this.pendingSync);
    } finally {
      this.syncing = false;
    }
  }
  checkValidity(): boolean {
    this.sync();
    return this.internals.checkValidity();
  }
  reportValidity(): boolean {
    this.sync();
    return this.internals.reportValidity();
  }
  setCustomValidity(message: string): void {
    this.change({ customValidity: String(message) });
  }
  focus(options?: FocusOptions): void {
    if (!this.effectiveDisabled) this.options.target?.()?.focus(options);
  }
  formAssociatedCallback(): void {
    this.sync();
  }
  formDisabledCallback(disabled: boolean): void {
    this.change({ platformDisabled: disabled });
  }
  formResetCallback(): void {
    this.change({ value: this.options.normalize(this.current.get().defaultValue), dirty: false }, "reset", this.options.valueProperty ?? "value");
  }
  formStateRestoreCallback(value: string | File | FormData, mode: "restore" | "autocomplete"): void {
    if (!this.options.restore) return;
    const restored = this.options.normalize(this.options.restore(value, mode));
    this.change({ value: restored, dirty: true }, "restore", this.options.valueProperty ?? "value");
  }
  hostConnected(): void {
    this.sync();
    this.subscription = this.tracked.subscribe(() => this.sync());
  }
  hostDisconnected(): void {
    this.subscription?.unsubscribe();
    this.subscription = undefined;
  }
  hostUpdated(): void {
    this.sync();
  }
}
