import { createAtom } from "@tanstack/lit-store";
import { html, nothing, type PropertyValues } from "lit";
import { property } from "lit/decorators.js";
import { AcmeSemanticElement } from "./semantic-element";
import { sharedCss } from "../base";
import { atomState } from "./atom-state";
import { createInheritedAppearance } from "./inherited-appearance";
import { StoreSelector } from "./store-connection";
import { GroupMemberController, groupMemberStyles } from "./group-member";
import { Interaction } from "./interaction";
import { Places } from "./places";
import { ActionSubmitter, type ActionSubmission } from "./action-submitter";
import { ResponsiveStyleRenderer } from "./style-renderer";
import { responsiveStyleDelivery } from "../generated/responsive-styles";
import { optionalString } from "./attributes";
import { actionCss } from "../generated/shared/action.styles";
import { Ripple } from "./ripple";

export type ButtonSize = "tiny" | "small" | "medium" | "large";
export type ButtonVariant = "default" | "secondary" | "tertiary" | "error" | "warning" | "unstyled";
export type ActionShape = "square" | "circle" | "pill";
type Presentation = Readonly<{ disabled: boolean; loading: boolean; shape?: ActionShape; fullWidth: boolean; ripple?: boolean; width?: string; height?: string }>;
const initial: Presentation = Object.freeze({ disabled: false, loading: false, fullWidth: false });

/** Shared action presentation and native control lifetime. Families own their distinct action. */
export abstract class AcmeActionElement extends AcmeSemanticElement {
  static get observedAttributes() {
    return [...new Set([...super.observedAttributes, "form"])];
  }
  static shadowRootOptions = { ...AcmeSemanticElement.shadowRootOptions, delegatesFocus: true };
  static styles = [sharedCss, actionCss, groupMemberStyles];
  @atomState() private presentation: Presentation = initial;
  protected get fallbackAppearance(): Readonly<{ size?: string; variant?: string }> {
    return {};
  }
  protected readonly appearance = createInheritedAppearance(
    {
      size: { supported: ["tiny", "small", "medium", "large"] as const, defaultValue: "medium" },
      variant: { supported: ["default", "secondary", "tertiary", "error", "warning", "unstyled"] as const, defaultValue: "default" },
    },
    createAtom(() => this.fallbackAppearance),
  );
  private readonly appearanceChanges = new StoreSelector(this, () => this.appearance.effective);
  protected get trackedPlaces(): readonly string[] {
    return ["start", "end"];
  }
  protected readonly places = new Places(this, { places: this.trackedPlaces });
  protected readonly nativeAction = new ActionSubmitter(
    this,
    () => this.submission,
    () => this.synchronizeControl(),
  );
  private readonly disabledChanges = new StoreSelector(this, () => this.nativeAction.disabled);
  private readonly pressEffect = new Ripple(
    this,
    () => this.control,
    () => this.ripple === true && !this.effectiveDisabled,
  );
  private readonly interaction = new Interaction(this, { disabled: () => this.effectiveDisabled, onPress: (event) => this.pressEffect.start(event), onCancel: () => this.pressEffect.cancel() });
  private readonly member = new GroupMemberController(this, { surface: () => this.control, appearance: this.appearance, emphasized: () => this.emphasized });
  private readonly dimensions = new ResponsiveStyleRenderer(this, responsiveStyleDelivery, {
    root: () => (this.renderRoot?.nodeType === 11 ? (this.renderRoot as ShadowRoot) : undefined),
    state: () => ({
      inputs: [
        ["width", this.width],
        ["height", this.height],
      ],
    }),
  });
  /** @default "medium" */
  @property({ noAccessor: true, converter: optionalString }) get size(): ButtonSize {
    return this.appearance.effective.get().size!;
  }
  set size(value: ButtonSize | undefined) {
    if (value !== undefined && !["tiny", "small", "medium", "large"].includes(value)) {
      throw new TypeError("Invalid action size");
    }
    const previous = this.size;
    this.appearance.setAuthored({ size: value });
    this.requestUpdate("size", previous);
  }
  /** @default "default" */
  @property({ noAccessor: true, converter: optionalString }) get variant(): ButtonVariant {
    return this.appearance.effective.get().variant!;
  }
  set variant(value: ButtonVariant | undefined) {
    if (value !== undefined && !["default", "secondary", "tertiary", "error", "warning", "unstyled"].includes(value)) {
      throw new TypeError("Invalid action variant");
    }
    const previous = this.variant;
    this.appearance.setAuthored({ variant: value });
    this.requestUpdate("variant", previous);
  }
  /** @default false */
  @property({ noAccessor: true, type: Boolean, reflect: true }) get disabled() {
    return this.presentation.disabled;
  }
  set disabled(value: boolean) {
    this.setPresentation("disabled", Boolean(value));
  }
  /** @default false */
  @property({ noAccessor: true, type: Boolean, reflect: true }) get loading() {
    return this.presentation.loading;
  }
  set loading(value: boolean) {
    this.setPresentation("loading", Boolean(value));
  }
  @property({ noAccessor: true, converter: optionalString }) get shape(): ActionShape | undefined {
    return this.presentation.shape;
  }
  set shape(value: ActionShape | undefined) {
    if (value !== undefined && !["square", "circle", "pill"].includes(value)) {
      throw new TypeError("Invalid action shape");
    }
    this.setPresentation("shape", value);
  }
  /** @default false */
  @property({ noAccessor: true, type: Boolean, attribute: "full-width", reflect: true }) get fullWidth() {
    return this.presentation.fullWidth;
  }
  set fullWidth(value: boolean) {
    this.setPresentation("fullWidth", Boolean(value));
  }
  @property({ noAccessor: true, converter: { fromAttribute: (value: string | null) => (value === null ? undefined : true) } }) get ripple() {
    return this.presentation.ripple;
  }
  set ripple(value: boolean | undefined) {
    this.setPresentation("ripple", value);
  }
  @property({ noAccessor: true, converter: optionalString }) get width() {
    return this.presentation.width;
  }
  set width(value: string | undefined) {
    this.setPresentation("width", value);
  }
  @property({ noAccessor: true, converter: optionalString }) get height() {
    return this.presentation.height;
  }
  set height(value: string | undefined) {
    this.setPresentation("height", value);
  }
  private setPresentation<Key extends keyof Presentation>(key: Key, value: Presentation[Key]) {
    const previous = this.presentation[key];
    if (Object.is(previous, value)) {
      return;
    }
    this.presentation = Object.freeze({ ...this.presentation, [key]: value });
    if ((key === "ripple" && !value) || ((key === "disabled" || key === "loading") && value)) {
      this.pressEffect?.cancel();
    }
    this.nativeAction?.sync();
    this.synchronizeControl();
    this.requestUpdate(key, previous);
  }
  protected get submission(): ActionSubmission {
    return { type: "button", disabled: this.disabled || this.loading, link: false, name: "", value: "", formNoValidate: false };
  }
  protected get control(): HTMLButtonElement | HTMLAnchorElement | undefined {
    return this.renderRoot?.querySelector('[part~="root"]') as HTMLButtonElement | HTMLAnchorElement | undefined;
  }
  protected get effectiveDisabled(): boolean {
    this.nativeAction.sync();
    return this.nativeAction.disabled.get();
  }
  protected get emphasized(): boolean {
    return false;
  }
  protected get iconOnly(): boolean {
    return false;
  }
  protected get resolvedShape(): ActionShape | undefined {
    return this.shape;
  }
  protected get link(): Readonly<{ href: string; target: string; rel: string }> | undefined {
    return undefined;
  }
  protected get semanticDefaults(): Readonly<{ role?: string; label?: string }> {
    return this.link ? { role: "link" } : {};
  }
  protected activate(_event: MouseEvent): void {}
  protected synchronizeControl(): void {
    const control = this.control;
    if (!control) {
      return;
    }
    const disabled = this.disabled || this.nativeAction.fieldsetDisabled;
    if (control.localName === "button") {
      const button = control as HTMLButtonElement;
      button.disabled = disabled;
      button.type = this.submission.type;
    }
    control.setAttribute("aria-busy", String(this.loading));
    if (this.nativeAction.disabled.get()) {
      control.setAttribute("aria-disabled", "true");
    } else {
      control.removeAttribute("aria-disabled");
    }
    if (control.localName === "a") {
      if (disabled) {
        control.tabIndex = -1;
      } else if (this.loading) {
        control.tabIndex = 0;
      } else {
        control.removeAttribute("tabindex");
      }
      const href = this.link?.href;
      if (href && !this.nativeAction.disabled.get()) {
        control.setAttribute("href", href);
      } else {
        control.removeAttribute("href");
      }
    }
  }
  private clickControl = (event: MouseEvent) => {
    if (this.effectiveDisabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    if (!event.defaultPrevented) {
      this.activate(event);
    }
  };
  focus(options?: FocusOptions): void {
    if (!this.effectiveDisabled) {
      this.control?.focus(options);
    }
  }
  blur(): void {
    this.control?.blur();
  }
  click(): void {
    if (!this.effectiveDisabled) {
      this.control?.click();
    }
  }
  protected abstract renderContent(): unknown;
  protected renderFeedback(): unknown {
    return nothing;
  }
  protected updated(_changed: PropertyValues) {
    this.synchronizeControl();
    this.interaction.attach(this.control);
  }
  protected willUpdate() {
    this.setAttribute("data-action-size", this.size);
    this.toggleAttribute("data-action-square", this.iconOnly || this.resolvedShape === "square" || this.resolvedShape === "circle");
  }
  attributeChangedCallback(name: string, previous: string | null, value: string | null) {
    if (name === "form") {
      this.nativeAction?.sync();
      this.requestUpdate();
    } else {
      super.attributeChangedCallback(name, previous, value);
    }
  }
  adoptedCallback() {
    super.adoptedCallback();
    this.dimensions.adopted();
    this.nativeAction.sync();
  }
  render() {
    const disabled = this.effectiveDisabled,
      unfocusable = this.disabled || this.nativeAction.fieldsetDisabled,
      link = this.link,
      content = html`${this.renderContent()}${this.pressEffect.render()}`;
    const control = link
      ? html`<a class="action" part="root" data-size=${this.size} data-variant=${this.variant} data-shape=${this.resolvedShape ?? nothing} ?data-icon-only=${this.iconOnly} tabindex=${unfocusable ? "-1" : this.loading ? "0" : nothing} href=${disabled ? nothing : link.href} target=${link.target || nothing} rel=${link.rel || nothing} aria-disabled=${disabled ? "true" : nothing} aria-busy=${this.loading ? "true" : nothing} @click=${this.clickControl} @auxclick=${this.clickControl}>${content}</a>`
      : html`<button class="action" part="root" data-size=${this.size} data-variant=${this.variant} data-shape=${this.resolvedShape ?? nothing} ?data-icon-only=${this.iconOnly} type=${this.submission.type} ?disabled=${unfocusable} aria-disabled=${disabled ? "true" : nothing} aria-busy=${this.loading ? "true" : nothing} @click=${this.clickControl}>${content}</button>`;
    return html`<form class="action-form" novalidate @submit=${(event: Event) => this.nativeAction.activate(event)} @reset=${(event: Event) => this.nativeAction.activate(event)}>${control}</form>${this.renderFeedback()}`;
  }
}
