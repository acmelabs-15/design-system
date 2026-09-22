import { html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { sharedCss } from "../../base";
import { AcmeFormElement, nativeValidation } from "../../shared/native-form-element";
import { NativeFormController } from "../../shared/native-form";
import { atomState } from "../../shared/atom-state";
import { Interaction } from "../../shared/interaction";
import { Places } from "../../shared/places";
import { Ripple } from "../../shared/ripple";
import { checkboxStructureCss } from "../../generated/components/checkbox/checkbox-structure.styles";
/** A native checkbox with one canonical checked state and an independent reset target.
 * @slot - The visible label.
 * @slot description - Supporting text.
 * @csspart root - The label hit surface.
 * @csspart control - The native checkbox.
 * @csspart indicator - The checked or mixed mark.
 * @csspart label - The visible label.
 * @csspart description - Supporting text.
 * @fires {CustomEvent<{checked:boolean;indeterminate:false}>} acme-change - A user changes the checked state.
 */
export class AcmeCheckbox extends AcmeFormElement<boolean, { value: string; indeterminate: boolean }> {
  static styles = [sharedCss, checkboxStructureCss];
  static shadowRootOptions = { ...AcmeFormElement.shadowRootOptions, delegatesFocus: true };
  @atomState() private submissionValue = "on";
  @atomState() private mixed = false;
  @atomState() @property({ noAccessor: true, useDefault: true }) size: "small" | "medium" | "large" = "medium";
  @atomState() @property({ noAccessor: true, type: Boolean }) invalid = false;
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
  protected readonly nativeForm = new NativeFormController<boolean, { value: string; indeterminate: boolean }>(this, {
    initialValue: false,
    normalize: Boolean,
    valueAttribute: "checked",
    valueProperty: "checked",
    fromAttribute: (value) => value !== null,
    toAttribute: (value) => (value ? "" : null),
    extra: () => ({ value: this.submissionValue, indeterminate: this.mixed }),
    serialize: (state, extra) => (state.value ? extra.value : null),
    restoration: (state) => (state.value ? "checked" : "unchecked"),
    restore: (value) => value === "checked",
    target: () => (this.input.isConnected ? this.input : undefined),
    synchronize: (state, extra) => {
      this.input.type = "checkbox";
      this.input.checked = state.value;
      this.input.defaultChecked = state.defaultValue;
      this.input.indeterminate = extra.indeterminate;
      this.input.value = extra.value;
      this.input.required = state.required;
      this.input.disabled = state.disabled || state.platformDisabled;
    },
    validate: () => nativeValidation(this.input),
  });
  private readonly places = new Places(this, { places: ["", "description"] });
  private readonly pressEffect = new Ripple(
    this,
    () => this.surface,
    () => this.ripple && !this.nativeForm.effectiveDisabled,
  );
  private readonly interaction = new Interaction(this, {
    disabled: () => this.nativeForm.effectiveDisabled,
    onPress: (event) => this.pressEffect.start(event),
    onCancel: () => this.pressEffect.cancel(),
  });
  private get surface() {
    return this.renderRoot?.querySelector<HTMLElement>("[part=root]") ?? undefined;
  }
  /** @default false */
  @property({ noAccessor: true, type: Boolean }) get checked() {
    return this.nativeForm.value;
  }
  set checked(value: boolean) {
    this.nativeForm.setValue(value);
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
    this.submissionValue = value ?? "on";
    this.nativeForm?.sync();
    this.requestUpdate("value", previous);
  }
  /** @default false */
  @property({ noAccessor: true, type: Boolean }) get indeterminate() {
    return this.mixed;
  }
  set indeterminate(value: boolean) {
    const previous = this.mixed;
    this.mixed = Boolean(value);
    this.nativeForm?.sync();
    this.requestUpdate("indeterminate", previous);
  }
  protected get semanticDefaults() {
    const native = super.semanticDefaults;
    const local = this.renderRoot?.querySelector("[part=label]");
    const description = this.renderRoot?.querySelector("[part=description]");
    return {
      labelledByElements: native.labelledByElements.length ? native.labelledByElements : this.places?.has("") && local ? [local] : [],
      describedByElements: this.places?.has("description") && description ? [description] : [],
    };
  }
  constructor() {
    super();
    this.input.setAttribute("part", "control");
    this.input.className = "native";
    this.input.addEventListener("change", this.change);
    this.addEventListener("click", (event) => {
      if (event.composedPath()[0] === this && !this.nativeForm.effectiveDisabled) this.input.click();
    });
  }
  click() {
    if (!this.nativeForm.effectiveDisabled) this.input.click();
  }
  private change = () => {
    if (this.nativeForm.effectiveDisabled) return;
    const checked = this.input.checked;
    this.mixed = false;
    this.nativeForm.setValue(checked, "user");
    this.dispatchEvent(new CustomEvent("acme-change", { detail: { checked: this.checked, indeterminate: false }, bubbles: true, composed: true }));
  };
  protected updated() {
    this.nativeForm.sync();
    this.interaction.attach(this.surface);
    this.input.setAttribute("aria-invalid", String(this.invalid));
  }
  render() {
    return html`<label class="checkbox" part="root" data-size=${this.size} ?data-checked=${this.checked} ?data-indeterminate=${this.indeterminate} ?data-disabled=${this.nativeForm.effectiveDisabled} ?data-invalid=${this.invalid}><span class="control">${this.input}<span class="indicator" part="indicator" aria-hidden="true">${this.indeterminate ? html`<acme-remove-icon></acme-remove-icon>` : this.checked ? html`<acme-check-icon></acme-check-icon>` : nothing}</span></span><span class="content"><span part="label" ?hidden=${!this.places.has("")}><slot></slot></span><span id="description" part="description" ?hidden=${!this.places.has("description")}><slot name="description"></slot></span></span>${this.pressEffect.render()}</label>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-checkbox": AcmeCheckbox;
  }
}
