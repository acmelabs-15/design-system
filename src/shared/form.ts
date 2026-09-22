import { noChange } from "lit";
import { AsyncDirective, directive, type ElementPart, type PartInfo, PartType } from "lit/async-directive.js";
export { TanStackFormController } from "@tanstack/lit-form";

/** The typed field surface consumed from TanStack Form. */
export interface FormFieldBinding<Value> {
  readonly state: Readonly<{ value: Value; meta: Readonly<{ isTouched: boolean; isValid: boolean }> }>;
  readonly store: { subscribe(listener: () => void): { unsubscribe(): void } };
  handleChange(value: Value): void;
  handleBlur(): void;
}
type Bound = HTMLElement & { value?: unknown; checked?: boolean; invalid?: boolean };
class BindDirective extends AsyncDirective {
  private element?: Bound;
  private field?: FormFieldBinding<unknown>;
  private subscription?: { unsubscribe(): void };
  constructor(part: PartInfo) {
    super(part);
    if (part.type !== PartType.ELEMENT) throw new Error("bindField belongs on a form control element");
  }
  update(part: ElementPart, [field]: [FormFieldBinding<unknown>]) {
    if (this.element !== part.element || this.field !== field) {
      this.detach();
      this.element = part.element as Bound;
      this.field = field;
      if (this.isConnected) this.attach();
    }
    this.paint();
    return noChange;
  }
  render(_field: FormFieldBinding<unknown>) {
    return noChange;
  }
  private paint = () => {
    const element = this.element,
      field = this.field;
    if (!element || !field) return;
    const value = field.state.value;
    if (typeof value === "boolean") {
      if (element.checked !== value) element.checked = value;
    } else if (!Object.is(element.value, value)) element.value = value;
    const invalid = field.state.meta.isTouched && !field.state.meta.isValid;
    if (element.invalid !== invalid) element.invalid = invalid;
  };
  private edit = (event: Event) => {
    if (event.target !== this.element || !this.field) return;
    const detail = (event as CustomEvent).detail;
    if (!detail || typeof detail !== "object") return;
    const key = typeof this.field.state.value === "boolean" ? "checked" : "value";
    if (!(key in detail)) return;
    const value = detail[key];
    if (!Object.is(value, this.field.state.value)) this.field.handleChange(value);
  };
  private blur = (event: FocusEvent) => {
    const next = event.relatedTarget;
    if (next && this.element?.contains(next as Node)) return;
    this.field?.handleBlur();
  };
  private attach() {
    this.element?.addEventListener("acme-input", this.edit);
    this.element?.addEventListener("acme-change", this.edit);
    this.element?.addEventListener("focusout", this.blur);
    this.subscription = this.field?.store.subscribe(this.paint);
    this.paint();
  }
  private detach() {
    this.subscription?.unsubscribe();
    this.subscription = undefined;
    this.element?.removeEventListener("acme-input", this.edit);
    this.element?.removeEventListener("acme-change", this.edit);
    this.element?.removeEventListener("focusout", this.blur);
  }
  disconnected() {
    this.detach();
  }
  reconnected() {
    this.attach();
  }
}
const binding = directive(BindDirective);
/** Binds canonical value/checked and invalid presentation; the application renders Field errors. */
export function bind<Value>(field: FormFieldBinding<Value>) {
  return binding(field);
}
