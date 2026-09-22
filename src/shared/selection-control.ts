import { createAtom } from "@tanstack/lit-store";
import { SelectionConnection, type SelectionOwner, type SelectionMember } from "./selection-member";
import { createInheritedAppearance } from "./inherited-appearance";
import { StoreSelector } from "./store-connection";
import { optionalString } from "./attributes";
import { property } from "lit/decorators.js";
import { sharedCss } from "../base";
import { AcmeFormElement, nativeValidation } from "./native-form-element";
import { NativeFormController } from "./native-form";
import { atomState } from "./atom-state";
import { Interaction } from "./interaction";
import { Places } from "./places";
import { Ripple } from "./ripple";
import { selectionControlCss } from "../generated/shared/selection-control.styles";
import type { SemanticDefaults } from "./semantic-element";
type CheckContext = { value: string; indeterminate: boolean; owner?: SelectionOwner; checked?: boolean; disabled: boolean };
/** Shared canonical state and native lifetime for checked selection controls. */
export abstract class AcmeSelectionControl extends AcmeFormElement<boolean, CheckContext> {
  static styles = [sharedCss, selectionControlCss];
  static shadowRootOptions = { ...AcmeFormElement.shadowRootOptions, delegatesFocus: true };
  @atomState() private submissionValue = this.initialValue;
  protected get initialValue(): string {
    return "on";
  }
  protected get selectionKind(): SelectionMember["kind"] {
    return "checkbox";
  }
  protected get mixedState(): boolean {
    return false;
  }
  protected get invalidState(): boolean {
    return this.field.description.get()?.invalid ?? false;
  }
  protected clearMixedState(): void {}
  protected stateChanged(): void {}
  protected membershipChanged(): void {}
  protected controlSynchronized(): void {}
  protected validateControl() {
    return nativeValidation(this.input);
  }
  protected activateField() {
    this.focus();
    this.click();
  }
  protected abstract emitUserChange(): void;
  protected readonly selectionMember: SelectionMember = {
    host: this,
    kind: this.selectionKind,
    owner: () => this.selection.owner,
    value: () => this.value,
    disabled: () => this.nativeForm.effectiveDisabled,
    required: () => this.required,
    target: () => this.input,
    validation: () => {
      const error = this.nativeForm.state.get().customValidity;
      return error ? { flags: { customError: true }, message: error } : nativeValidation(this.input);
    },
    synchronize: () => this.nativeForm.sync(),
    connect: (owner) => this.connectSelection(owner),
  };
  protected readonly selection = new SelectionConnection(this, this.selectionMember);
  private readonly ownerAppearance = createAtom(() => ({ size: this.selection.owner?.state.get().size }));
  protected get defaultSize(): "small" | "medium" | "large" {
    return "medium";
  }
  protected get appearanceVariants(): readonly ("default" | "secondary")[] | undefined {
    return undefined;
  }
  protected readonly appearance = createInheritedAppearance(
    {
      size: { supported: ["small", "medium", "large"] as const, defaultValue: this.defaultSize },
      variant: this.appearanceVariants ? { supported: this.appearanceVariants, defaultValue: "default" as const } : undefined,
    },
    this.ownerAppearance,
  );
  private readonly appearanceUpdates = new StoreSelector(this, () => this.appearance.effective);
  /** @default "medium" */
  @property({ noAccessor: true, converter: optionalString }) get size(): "small" | "medium" | "large" {
    return this.appearance.effective.get().size!;
  }
  set size(value: "small" | "medium" | "large" | undefined) {
    if (value !== undefined && !["small", "medium", "large"].includes(value)) throw new TypeError("Invalid Checkbox size");
    const previous = this.size;
    this.appearance.setAuthored({ size: value });
    this.requestUpdate("size", previous);
  }
  @atomState() private rippleEnabled = false;
  /** @default false */
  @property({ noAccessor: true, type: Boolean }) get ripple() {
    return this.rippleEnabled;
  }
  set ripple(value: boolean) {
    const previous = this.rippleEnabled;
    this.rippleEnabled = Boolean(value);
    if (!this.rippleEnabled) this.pressEffect?.cancel();
    this.requestUpdate("ripple", previous);
  }
  protected readonly input = this.ownerDocument.createElement("input");
  protected readonly nativeForm = new NativeFormController<boolean, CheckContext>(this, {
    initialValue: false,
    normalize: Boolean,
    valueAttribute: "checked",
    valueProperty: "checked",
    fromAttribute: (value) => value !== null,
    toAttribute: (value) => (value ? "" : null),
    extra: () => {
      const owner = this.selection.owner;
      return { value: this.submissionValue, indeterminate: this.mixedState, owner, checked: owner?.checked(this.selectionMember), disabled: owner?.state.get().disabled ?? false };
    },
    participates: (_state, extra) => !extra.owner,
    changed: () => {
      this.selection?.owner?.synchronize();
      this.stateChanged();
    },
    serialize: (state, extra) => (state.value ? extra.value : null),
    restoration: (state) => (state.value ? "checked" : "unchecked"),
    restore: (value) => value === "checked",
    target: () => (this.input.isConnected ? this.input : undefined),
    synchronize: (state, extra) => {
      this.input.type = this.selectionKind === "radio" ? "radio" : "checkbox";
      this.input.checked = extra.checked ?? state.value;
      this.input.defaultChecked = state.defaultValue;
      this.input.indeterminate = extra.indeterminate;
      this.input.value = extra.value;
      this.input.required = state.required;
      this.input.disabled = state.disabled || state.platformDisabled || extra.disabled;
      this.controlSynchronized();
    },
    validate: () => this.validateControl(),
  });
  private readonly displayState = createAtom(() => ({ checked: this.checked, disabled: this.effectiveDisabled, invalid: this.effectiveInvalid }), {
    compare: (a, b) => a.checked === b.checked && a.disabled === b.disabled && a.invalid === b.invalid,
  });
  private readonly displayUpdates = new StoreSelector(this, () => this.displayState);
  protected readonly places = new Places(this, { places: ["", "description"] });
  protected readonly pressEffect = new Ripple(
    this,
    () => this.surface,
    () => this.ripple && !this.effectiveDisabled,
  );
  private readonly interaction = new Interaction(this, {
    disabled: () => this.effectiveDisabled,
    onPress: (event) => this.pressEffect.start(event),
    onCancel: () => this.pressEffect.cancel(),
  });
  protected get effectiveDisabled() {
    return this.nativeForm.effectiveDisabled || (this.selection.owner?.state.get().disabled ?? false);
  }
  protected get effectiveInvalid() {
    return this.invalidState || (this.field.description.get()?.invalid ?? false) || (this.selection.owner?.state.get().invalid ?? false);
  }
  protected connectSelection(owner: SelectionOwner | undefined) {
    const current = this.checked;
    this.selection.setOwner(owner);
    if (!owner) this.nativeForm.setValue(current);
    this.nativeForm.sync();
    this.membershipChanged();
    this.requestUpdate();
  }
  protected get surface() {
    return this.renderRoot?.querySelector<HTMLElement>("[part=root]") ?? undefined;
  }
  /** @default false */
  @property({ noAccessor: true, type: Boolean }) get checked() {
    return this.selection.owner?.checked(this.selectionMember) ?? this.nativeForm.value;
  }
  set checked(value: boolean) {
    if (this.selection.owner) this.selection.owner.change(this.selectionMember, Boolean(value), "programmatic");
    else this.nativeForm.setValue(value);
  }
  /** @default false */
  @property({ noAccessor: true, attribute: false }) get defaultChecked() {
    return this.nativeForm.defaultValue;
  }
  set defaultChecked(value: boolean) {
    this.nativeForm.setDefaultValue(value);
  }
  /** @default "on" */
  @property({ noAccessor: true }) get value() {
    return this.submissionValue;
  }
  set value(value: string) {
    const previous = this.submissionValue;
    this.submissionValue = value ?? this.initialValue;
    this.nativeForm?.sync();
    this.requestUpdate("value", previous);
    this.selection?.notify();
    this.stateChanged();
  }
  protected get semanticDefaults(): SemanticDefaults {
    const native = super.semanticDefaults;
    const local = this.renderRoot?.querySelector("[part=label]");
    const description = this.renderRoot?.querySelector("[part=description]");
    return {
      role: this.selectionKind === "switch" ? "switch" : undefined,
      labelledByElements: native.labelledByElements?.length ? native.labelledByElements : this.places?.has("") && local ? [local] : [],
      describedByElements: [...(native.describedByElements ?? []), ...(this.places?.has("description") && description ? [description] : [])],
    };
  }
  constructor() {
    super();
    this.input.setAttribute("part", "control");
    this.input.className = "native";
    this.input.addEventListener("input", this.change);
    this.input.addEventListener("change", this.change);
    this.addEventListener("click", (event) => {
      if (event.composedPath()[0] === this && !this.effectiveDisabled) this.input.click();
    });
  }
  click() {
    if (!this.effectiveDisabled) this.input.click();
  }
  private change = () => {
    if (this.effectiveDisabled) return;
    const checked = this.input.checked;
    if (checked === this.checked && !this.mixedState) return;
    this.clearMixedState();
    if (this.selection.owner) this.selection.owner.change(this.selectionMember, checked, "user");
    else {
      this.nativeForm.setValue(checked, "user");
      this.emitUserChange();
    }
  };
  protected updated() {
    this.nativeForm.sync();
    this.interaction.attach(this.surface);
    this.input.setAttribute("aria-invalid", String(this.effectiveInvalid));
  }
}
