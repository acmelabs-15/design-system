import { AcmeElement } from "../base";
import type { NativeFormController, NativeFormValidation } from "./native-form";

/** Bridges platform callbacks and reflected form attributes to one canonical controller. */
export abstract class AcmeFormElement<Value, Extra = undefined> extends AcmeElement {
  static formAssociated = true;
  static properties = {
    name: { type: String, noAccessor: true },
    disabled: { type: Boolean, noAccessor: true },
    required: { type: Boolean, noAccessor: true },
    readOnly: { type: Boolean, attribute: "readonly", noAccessor: true },
  };
  static get observedAttributes(): string[] {
    return [...new Set([...super.observedAttributes, "form"])];
  }
  protected abstract readonly nativeForm: NativeFormController<Value, Extra>;

  get name(): string {
    return this.nativeForm.state.get().name;
  }
  set name(value: string) {
    this.nativeForm.setAttributeValue("name", String(value));
  }
  get disabled(): boolean {
    return this.nativeForm.state.get().disabled;
  }
  set disabled(value: boolean) {
    this.nativeForm.setAttributeValue("disabled", Boolean(value));
  }
  get required(): boolean {
    return this.nativeForm.state.get().required;
  }
  set required(value: boolean) {
    this.nativeForm.setAttributeValue("required", Boolean(value));
  }
  get readOnly(): boolean {
    return this.nativeForm.state.get().readOnly;
  }
  set readOnly(value: boolean) {
    this.nativeForm.setAttributeValue("readonly", Boolean(value));
  }
  get form(): HTMLFormElement | null {
    return this.nativeForm.form;
  }
  get labels(): NodeList {
    return this.nativeForm.labels;
  }
  get validity(): ValidityState {
    return this.nativeForm.validity;
  }
  get validationMessage(): string {
    return this.nativeForm.validationMessage;
  }
  get willValidate(): boolean {
    return this.nativeForm.willValidate;
  }
  checkValidity(): boolean {
    return this.nativeForm.checkValidity();
  }
  reportValidity(): boolean {
    return this.nativeForm.reportValidity();
  }
  setCustomValidity(message: string): void {
    this.nativeForm.setCustomValidity(message);
  }
  focus(options?: FocusOptions): void {
    this.nativeForm.focus(options);
  }
  attributeChangedCallback(name: string, previous: string | null, value: string | null): void {
    if (!this.nativeForm.attributeChanged(name, previous, value)) super.attributeChangedCallback(name, previous, value);
  }
  formAssociatedCallback(): void {
    this.nativeForm.formAssociatedCallback();
  }
  formDisabledCallback(disabled: boolean): void {
    this.nativeForm.formDisabledCallback(disabled);
  }
  formResetCallback(): void {
    this.nativeForm.formResetCallback();
  }
  formStateRestoreCallback(value: string | File | FormData, mode: "restore" | "autocomplete"): void {
    this.nativeForm.formStateRestoreCallback(value, mode);
  }
}

const validityKeys = ["badInput", "customError", "patternMismatch", "rangeOverflow", "rangeUnderflow", "stepMismatch", "tooLong", "tooShort", "typeMismatch", "valueMissing"] as const;

/** Copies browser-calculated constraints without a second validation implementation. */
export function nativeValidation(control: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): NativeFormValidation {
  const flags: ValidityStateFlags = {};
  for (const key of validityKeys) if (control.validity[key]) flags[key] = true;
  return { flags, message: control.validationMessage };
}
