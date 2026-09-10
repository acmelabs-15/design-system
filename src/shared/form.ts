// TanStack Form for the acme-* inputs. `TanStackFormController` is headless and renders nothing;
// its `field()` directive hands the template a FieldApi. `bind(field)` turns that into the four
// bindings an acme input needs, so a call site stays one line per control:
//
//   ${this.form.field({ name: "email" }, (f) => html`<acme-input label="Email" ${bind(f)}></acme-input>`)}
//
// The directive sets `value` and `error` on the element and listens for `acme-input` /
// `acme-change` and `blur`. Booleans (acme-checkbox, acme-toggle) bind `checked`.
import type { FieldApi } from "@tanstack/lit-form";
import { noChange } from "lit";
import { AsyncDirective, directive, type ElementPart, type PartInfo, PartType } from "lit/async-directive.js";

export { TanStackFormController } from "@tanstack/lit-form";

// biome-ignore lint/suspicious/noExplicitAny: the field's generics are the caller's business
type AnyField = FieldApi<any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any>;
type Bound = HTMLElement & { value?: unknown; checked?: boolean; error?: string };

class BindDirective extends AsyncDirective {
  private el?: Bound;
  private field?: AnyField;
  constructor(part: PartInfo) {
    super(part);
    if (part.type !== PartType.ELEMENT) throw new Error("bind(field) goes on an element, e.g. <acme-input ${bind(f)}>");
  }
  update(part: ElementPart, [field]: [AnyField]) {
    const el = part.element as Bound;
    if (this.el !== el) {
      this.el?.removeEventListener("acme-input", this.onInput);
      this.el?.removeEventListener("acme-change", this.onInput);
      this.el?.removeEventListener("blur", this.onBlur);
      this.el = el;
      el.addEventListener("acme-input", this.onInput);
      el.addEventListener("acme-change", this.onInput);
      el.addEventListener("blur", this.onBlur);
    }
    this.field = field;
    return this.render(field);
  }
  render(field: AnyField) {
    const el = this.el;
    if (!el) return noChange;
    const v = field.state.value;
    if (typeof v === "boolean") el.checked = v;
    else if (el.value !== v) el.value = v ?? "";
    const m = field.state.meta;
    el.error = m.isTouched && !m.isValid ? m.errors.map((e: unknown) => (typeof e === "string" ? e : ((e as { message?: string })?.message ?? String(e)))).join(" ") : "";
    return noChange;
  }
  private onInput = (e: Event) => {
    const d = (e as CustomEvent).detail ?? {};
    const next = "checked" in d ? d.checked : "value" in d ? d.value : (this.el?.value ?? "");
    this.field?.handleChange(next as never);
  };
  private onBlur = () => this.field?.handleBlur();
  disconnected() {
    this.el?.removeEventListener("acme-input", this.onInput);
    this.el?.removeEventListener("acme-change", this.onInput);
    this.el?.removeEventListener("blur", this.onBlur);
  }
  reconnected() {
    this.el?.addEventListener("acme-input", this.onInput);
    this.el?.addEventListener("acme-change", this.onInput);
    this.el?.addEventListener("blur", this.onBlur);
  }
}

/** Binds a TanStack Form field to an acme input element: value or checked, error, input and blur. */
export const bind = directive(BindDirective);
