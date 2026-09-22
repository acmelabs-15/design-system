import { createAtom } from "@tanstack/lit-store";
import { html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { sharedCss } from "../../base";
import { AcmeFormElement, nativeValidation } from "../../shared/native-form-element";
import { NativeFormController, type NativeFormState } from "../../shared/native-form";
import { atomState } from "../../shared/atom-state";
import { StoreSelector } from "../../shared/store-connection";
import { SelectionRegistry, selectionOrder, type SelectionOwner, type SelectionMember } from "../../shared/selection-member";
import { optionalString } from "../../shared/attributes";
import { message, messageCatalogs } from "../../shared/messages";
import { checkboxGroupStructureCss } from "../../generated/components/checkbox-group/checkbox-group-structure.styles";
const values = (value: readonly string[]): readonly string[] => {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) throw new TypeError("Checkbox Group value requires an array of strings");
  return Object.freeze([...new Set(value)]);
};
const fromAttribute = (value: string | null): readonly string[] => {
  if (value === null) return Object.freeze([]);
  try {
    return values(JSON.parse(value));
  } catch {
    console.warn("acme-checkbox-group", { code: "invalid-value-attribute" });
    return Object.freeze([]);
  }
};
type Members = readonly SelectionMember[];
/** Owns multiple selected values, aggregate validity and one set of repeated form entries.
 * @slot - Checkbox or Checkbox Card members, optionally arranged by layout components.
 * @csspart root - The semantic group.
 * @fires {CustomEvent<{value:readonly string[]}>} acme-change - A user changes the group selection.
 */
export class AcmeCheckboxGroup extends AcmeFormElement<readonly string[], Members> {
  static styles = [sharedCss, checkboxGroupStructureCss];
  @atomState() @property({ noAccessor: true, type: Boolean }) invalid = false;
  @atomState() @property({ noAccessor: true, converter: optionalString }) size?: "small" | "medium" | "large";
  private get registered(): Members {
    return this.registry.members.get();
  }
  private readonly constraint = this.ownerDocument.createElement("input");
  private readonly messageChanges = new StoreSelector(this, () => messageCatalogs);
  private readonly locale = new StoreSelector(this, () => this.themeContext.scope.effective);
  private readonly context = createAtom(() => Object.freeze({ disabled: this.nativeForm.effectiveDisabled, invalid: this.invalid, size: this.size }), {
    compare: (a, b) => a.disabled === b.disabled && a.invalid === b.invalid && a.size === b.size,
  });
  private readonly selectedValues = createAtom<ReadonlySet<string>>(() => new Set(this.value));
  private readonly owner: SelectionOwner = {
    kind: "checkbox",
    state: this.context,
    checked: (member) => this.selectedValues.get().has(member.value()),
    change: (member, checked, reason) => this.change(member, checked, reason),
    remove: (member) => this.registry.remove(member),
    synchronize: () => this.nativeForm.sync(),
  };
  private readonly registry = new SelectionRegistry(this, this.owner);
  protected readonly nativeForm = new NativeFormController<readonly string[], Members>(this, {
    initialValue: Object.freeze([]),
    normalize: values,
    valueAttribute: "value",
    fromAttribute,
    toAttribute: JSON.stringify,
    extra: () => {
      for (const member of this.registered) {
        member.value();
        member.disabled();
      }
      return this.registered;
    },
    serialize: (state, members) => {
      const data = new FormData();
      if (state.name) for (const value of this.successful(state, members)) data.append(state.name, value);
      return data;
    },
    restoration: (state) => JSON.stringify(state.value),
    restore: (value) => (typeof value === "string" ? fromAttribute(value) : Object.freeze([])),
    target: () => {
      const target = this.enabled()[0]?.target();
      return target?.isConnected ? target : this.semanticTarget;
    },
    synchronize: (state, members) => {
      for (const member of members) member.synchronize();
      this.constraint.type = "checkbox";
      this.constraint.checked = this.successful(state, members).length > 0;
      this.constraint.required = state.required;
      this.constraint.disabled = state.disabled || state.platformDisabled;
    },
    validate: (state, members) => {
      if (state.disabled || state.platformDisabled) return { flags: {}, message: "" };
      if (new Set(members.map((member) => member.value())).size !== members.length)
        return { flags: { customError: true }, message: message(this.themeContext.scope.effective.get().locale, "checkboxGroup.duplicate", "Each option must have a unique value.") };
      for (const member of members) {
        if (member.disabled()) continue;
        const validation = member.validation();
        if (Object.values(validation.flags).some(Boolean)) return validation;
      }
      const result = nativeValidation(this.constraint);
      return result.flags.valueMissing ? { flags: result.flags, message: this.requiredMessage() } : result;
    },
  });
  /** @default [] */
  @property({ noAccessor: true, type: Array }) get value() {
    return this.nativeForm.value;
  }
  set value(value: readonly string[]) {
    this.nativeForm.setValue(value);
  }
  /** @default [] */
  @property({ noAccessor: true, attribute: false }) get defaultValue() {
    return this.nativeForm.defaultValue;
  }
  set defaultValue(value: readonly string[]) {
    this.nativeForm.setDefaultValue(value);
  }
  private successful(state: NativeFormState<readonly string[]>, members: Members) {
    const selected = new Set(state.value);
    return [
      ...new Set(
        [...members]
          .sort(selectionOrder)
          .filter((member) => !member.disabled() && selected.has(member.value()))
          .map((member) => member.value()),
      ),
    ];
  }
  private enabled() {
    return [...this.registered].sort(selectionOrder).filter((member) => {
      const target = member.target();
      return !member.disabled() && target.isConnected && target.getClientRects().length > 0 && target.ownerDocument.defaultView!.getComputedStyle(target).visibility === "visible";
    });
  }
  protected get semanticTarget() {
    return this.renderRoot?.querySelector<HTMLElement>("[part=root]") ?? undefined;
  }
  protected get semanticDefaults() {
    const hint = this.renderRoot?.querySelector("#requirement");
    return { ...super.semanticDefaults, role: "group", describedByElements: this.required && hint ? [hint] : [] };
  }
  private requiredMessage() {
    return message(this.themeContext.scope.effective.get().locale, "checkboxGroup.required", "Select at least one option.");
  }
  private change(member: SelectionMember, checked: boolean, reason: "programmatic" | "user") {
    if (!this.registered.includes(member) || (reason === "user" && (this.nativeForm.effectiveDisabled || member.disabled()))) return;
    if (this.value.includes(member.value()) === checked) {
      if (reason === "programmatic") this.nativeForm.setValue(this.value);
      return;
    }
    this.nativeForm.setValue(checked ? [...this.value, member.value()] : this.value.filter((value) => value !== member.value()), reason);
    if (reason === "user") this.dispatchEvent(new CustomEvent<{ value: readonly string[] }>("acme-change", { detail: { value: this.value }, bubbles: true, composed: true }));
  }
  render() {
    return html`<div part="root" class="group" tabindex="-1" aria-disabled=${this.nativeForm.effectiveDisabled ? "true" : nothing} aria-invalid=${this.invalid || this.field.description.get()?.invalid ? "true" : nothing}><slot></slot><span class="sr" id="requirement" ?hidden=${!this.required}>${this.required ? this.requiredMessage() : ""}</span></div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-checkbox-group": AcmeCheckboxGroup;
  }
}
