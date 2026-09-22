import { FieldControl } from "./field-control";
import { AcmeSemanticElement, type SemanticDefaults } from "./semantic-element";
import type { PropertyDeclarations } from "lit";
import type { NativeFormController, NativeFormValidation } from "./native-form";

/** Bridges platform callbacks and reflected form attributes to one canonical controller.
 * @attr {string} form - ID of the associated form in the author's tree.
 */
export abstract class AcmeFormElement<Value, Extra = undefined> extends AcmeSemanticElement {
  static formAssociated = true;
  static properties: PropertyDeclarations = {
    name: { type: String, noAccessor: true },
    disabled: { type: Boolean, noAccessor: true },
    required: { type: Boolean, noAccessor: true },
  };
  static get observedAttributes(): string[] {
    return [...new Set([...super.observedAttributes, "form"])];
  }
  protected readonly field = new FieldControl(this, {
    target: () => this.semanticTarget,
    eligible: () => this.nativeForm?.ownsValue ?? true,
    activate: () => this.activateField(),
    changed: (description) => this.nativeForm?.setContextDisabled(description?.disabled ?? false),
  });
  protected activateField(): void {
    this.focus();
  }
  protected abstract readonly nativeForm: NativeFormController<Value, Extra>;
  protected get semanticTarget(): HTMLElement | undefined {
    return this.nativeForm?.target;
  }
  protected get semanticDefaults(): SemanticDefaults {
    const labels = Array.from(this.nativeForm?.labels ?? []).filter((label) => (label as HTMLLabelElement).control === this) as Element[];
    const field = this.field?.association.defaults;
    return { labelledByElements: labels.length ? labels : (field?.labelledByElements ?? []), describedByElements: field?.describedByElements ?? [] };
  }

  /** @default "" */
  get name(): string {
    return this.nativeForm.state.get().name;
  }
  set name(value: string) {
    this.nativeForm.setAttributeValue("name", String(value));
  }
  /** @default false */
  get disabled(): boolean {
    return this.nativeForm.state.get().disabled;
  }
  set disabled(value: boolean) {
    this.nativeForm.setAttributeValue("disabled", Boolean(value));
  }
  /** @default false */
  get required(): boolean {
    return this.nativeForm.state.get().required;
  }
  set required(value: boolean) {
    this.nativeForm.setAttributeValue("required", Boolean(value));
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

/** Form controls whose native input supports readonly semantics. */
export abstract class AcmeReadOnlyFormElement<Value, Extra = undefined> extends AcmeFormElement<Value, Extra> {
  static properties: PropertyDeclarations = { readOnly: { type: Boolean, attribute: "readonly", noAccessor: true } };
  /** @default false */
  get readOnly(): boolean {
    return this.nativeForm.state.get().readOnly;
  }
  set readOnly(value: boolean) {
    this.nativeForm.setAttributeValue("readonly", Boolean(value));
  }
}

const validityKeys = ["badInput", "customError", "patternMismatch", "rangeOverflow", "rangeUnderflow", "stepMismatch", "tooLong", "tooShort", "typeMismatch", "valueMissing"] as const;

/** Copies browser-calculated constraints without a second validation implementation. */
export function nativeValidation(control: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): NativeFormValidation {
  if (!control.willValidate) return { flags: {}, message: "" };
  const flags: ValidityStateFlags = {};
  for (const key of validityKeys) if (control.validity[key]) flags[key] = true;
  return { flags, message: control.validationMessage };
}
