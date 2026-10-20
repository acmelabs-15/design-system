import { createAtom } from "@tanstack/lit-store";
import { property } from "lit/decorators.js";
import { sharedCss } from "../base";
import { AcmeFormElement, nativeValidation } from "./native-form-element";
import { NativeFormController } from "./native-form";
import { StoreSelector } from "./store-connection";
import { SelectionRegistry, selectionOrder, type SelectionOwner, type SelectionMember } from "./selection-member";
import { RadioNavigation } from "./radio-navigation";
import { optionalString } from "./attributes";
import { message, messageCatalogs } from "./messages";

type Members = readonly SelectionMember[];
const valueOf = (value: string | undefined) => {
  if (value === undefined) {
    return undefined;
  }
  if (typeof value !== "string" || !value) {
    throw new TypeError("Selection value must be a nonempty string or undefined");
  }
  return value;
};
/** Owns one selected value, native submission and radio keyboard navigation.
 * @slot - Owned radio choices.
 * @csspart root - The named radio group.
 * @fires {CustomEvent<{value:string}>} acme-change - The user selected a group member.
 */
export abstract class AcmeSingleSelectionGroup extends AcmeFormElement<string | undefined, Members> {
  static styles = [sharedCss];
  abstract get orientation(): "horizontal" | "vertical";
  protected get selectionLoop() {
    return true;
  }
  protected get collectionSize(): string | undefined {
    return undefined;
  }
  protected get members(): Members {
    return this.registry.members.get();
  }
  private readonly constraint = this.ownerDocument.createElement("input");
  private readonly messages = new StoreSelector(this, () => messageCatalogs);
  private readonly context = createAtom(() => Object.freeze({ disabled: this.nativeForm.effectiveDisabled, invalid: false, size: this.collectionSize }), {
    compare: (a, b) => a.disabled === b.disabled && a.size === b.size,
  });
  private readonly owner: SelectionOwner = {
    kind: "radio",
    state: this.context,
    checked: (member) => !!member.value() && this.value === member.value(),
    change: (member, checked, reason) => this.change(member, checked, reason),
    remove: (member) => this.registry.remove(member),
    synchronize: () => this.nativeForm.sync(),
  };
  private readonly registry = new SelectionRegistry(this, this.owner);
  protected readonly requiredState = createAtom(() => this.required || this.members.some((member) => member.required()));
  private readonly requiredChanges = new StoreSelector(this, () => this.requiredState);
  protected readonly nativeForm: NativeFormController<string | undefined, Members> = new NativeFormController<string | undefined, Members>(this, {
    initialValue: undefined,
    normalize: valueOf,
    valueAttribute: "value",
    fromAttribute: (value) => (value === null ? undefined : valueOf(value)),
    toAttribute: (value) => value ?? null,
    extra: () => {
      for (const member of this.members) {
        member.value();
        member.disabled();
        member.required();
      }
      return this.members;
    },
    serialize: (state, members) => (state.value !== undefined && members.some((member) => member.value() === state.value && !member.disabled()) ? state.value : null),
    restoration: (state) => JSON.stringify({ value: state.value ?? null }),
    restore: (value) => {
      if (typeof value !== "string") {
        return undefined;
      }
      try {
        const parsed = JSON.parse(value);
        return parsed.value === null ? undefined : valueOf(parsed.value);
      } catch {
        return undefined;
      }
    },
    target: () => this.navigation?.target() ?? this.semanticTarget,
    synchronize: (state, members) => {
      for (const member of members) {
        member.synchronize();
      }
      this.constraint.type = "radio";
      this.constraint.name = "group";
      this.constraint.required = state.required || members.some((member) => member.required());
      this.constraint.checked = state.value !== undefined && members.some((member) => member.value() === state.value);
      this.constraint.disabled = state.disabled || state.platformDisabled;
      this.navigation?.synchronize();
    },
    validate: (state, members) => {
      if (state.disabled || state.platformDisabled) {
        return { flags: {}, message: "" };
      }
      const values = members.map((member) => member.value());
      if (values.some((value) => !value) || new Set(values).size !== values.length) {
        return { flags: { customError: true }, message: message(this.themeContext.scope.effective.get().locale, "radioGroup.values", "Each option needs a unique nonempty value.") };
      }
      for (const member of [...members].sort(selectionOrder)) {
        if (member.disabled()) {
          continue;
        }
        const validation = member.validation();
        if (Object.values(validation.flags).some(Boolean)) {
          return validation;
        }
      }
      const result = nativeValidation(this.constraint);
      return result.flags.valueMissing ? { flags: result.flags, message: message(this.themeContext.scope.effective.get().locale, "radioGroup.required", "Select an option.") } : result;
    },
  });
  private readonly navigation: RadioNavigation = new RadioNavigation(this, {
    members: () => this.members,
    value: () => this.value,
    disabled: () => this.nativeForm.effectiveDisabled,
    loop: () => this.selectionLoop,
    synchronize: () => this.nativeForm.sync(),
  });
  @property({ noAccessor: true, converter: optionalString }) get value(): string | undefined {
    return this.nativeForm.value;
  }
  set value(value: string | undefined) {
    this.nativeForm.setValue(value);
  }
  @property({ noAccessor: true, attribute: false }) get defaultValue(): string | undefined {
    return this.nativeForm.defaultValue;
  }
  set defaultValue(value: string | undefined) {
    this.nativeForm.setDefaultValue(value);
  }
  protected get semanticTarget() {
    return this.renderRoot?.querySelector<HTMLElement>("[part=root]") ?? undefined;
  }
  protected get semanticDefaults() {
    return { ...super.semanticDefaults, role: "radiogroup" };
  }
  private change(member: SelectionMember, checked: boolean, reason: "programmatic" | "user") {
    if (!this.members.includes(member) || !member.value() || (reason === "user" && (this.nativeForm.effectiveDisabled || member.disabled()))) {
      return;
    }
    const value = checked ? member.value() : this.value === member.value() ? undefined : this.value;
    if (value === this.value) {
      if (reason === "programmatic") {
        this.nativeForm.setValue(value);
      }
      return;
    }
    this.nativeForm.setValue(value, reason);
    if (reason === "user" && value !== undefined) {
      this.dispatchEvent(new CustomEvent<{ value: string }>("acme-change", { detail: { value }, bubbles: true, composed: true }));
    }
  }
}
