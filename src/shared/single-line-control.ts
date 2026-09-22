import { html, nothing, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { AcmeTextControl, type TextNativeControl } from "./text-control";
import { atomState } from "./atom-state";
import { StoreSelector } from "./store-connection";
import { message, messageCatalogs } from "./messages";
import { registerTextControl, submitImplicitly } from "./implicit-submit";
import { singleLineControlCss } from "../generated/shared/single-line-control.styles";

/** Native single-line editing and four distinct affix positions. */
export abstract class AcmeSingleLineControl extends AcmeTextControl {
  static styles = [...AcmeTextControl.styles, singleLineControlCss];
  protected createControl() {
    return this.ownerDocument.createElement("input");
  }
  protected get inputType() {
    return "text";
  }
  @atomState() private expression = "";
  /** @default "" */
  @property({ noAccessor: true }) get pattern() {
    return this.expression;
  }
  set pattern(value: string) {
    this.expression = String(value ?? "");
    this.nativeForm?.sync();
    this.requestUpdate("pattern");
  }
  protected configuration() {
    return `${this.inputType}\n${this.pattern ?? ""}`;
  }
  protected configure(control: TextNativeControl) {
    const input = control as HTMLInputElement;
    if (input.type !== this.inputType) input.type = this.inputType;
    const pattern = this.pattern ?? "";
    if (pattern) {
      if (input.pattern !== pattern) input.pattern = pattern;
    } else input.removeAttribute("pattern");
  }
  @atomState() @property({ noAccessor: true, type: Boolean }) clearable = false;
  @atomState() private occupied: Readonly<Record<string, boolean>> = {};
  private readonly messages = new StoreSelector(this, () => messageCatalogs);
  private readonly localeUpdates = new StoreSelector(this, () => this.themeContext.scope.effective);
  protected text(key: string, fallback: string) {
    return message(this.themeContext.scope.effective.get().locale, key, fallback);
  }
  protected leading(): TemplateResult | typeof nothing {
    return nothing;
  }
  protected trailing(): TemplateResult | typeof nothing {
    return nothing;
  }
  protected get busy() {
    return false;
  }
  private slotChanged = (event: Event) => {
    const slot = event.target as HTMLSlotElement;
    const filled = slot.assignedNodes({ flatten: true }).some((n) => n.nodeType === 1 || !!n.textContent?.trim());
    if (this.occupied[slot.name] !== filled) this.occupied = { ...this.occupied, [slot.name]: filled };
  };
  /** Clears an editable value and returns focus to the input. */
  clear() {
    if (this.nativeForm.effectiveDisabled || this.readOnly) return;
    const changed = this.value !== "";
    this.value = "";
    this.focus();
    if (changed) {
      this.emitValue("acme-input");
      this.emitValue("acme-change");
    }
  }
  constructor() {
    super();
    this.control.setAttribute("part", "input");
    registerTextControl(this);
  }
  protected renderActions() {
    return html`${this.trailing()}${this.clearable ? html`<acme-icon-button part="clear" variant="tertiary" size=${this.size === "small" ? "tiny" : "small"} aria-label=${this.text("input.clear", "Clear input")} ?hidden=${!this.value || this.readOnly || this.nativeForm.effectiveDisabled} @click=${() => this.clear()}><acme-close-icon></acme-close-icon></acme-icon-button>` : nothing}`;
  }
  private submit = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    const form = this.form;
    if (form && !this.nativeForm.effectiveDisabled) submitImplicitly(form);
  };
  render() {
    const disabled = this.nativeForm.effectiveDisabled;
    return html`<div class="root" part="root" data-size=${this.size} ?data-disabled=${disabled} ?data-invalid=${this.effectiveInvalid}>
 <span class="addon start-addon" part="start-addon" ?hidden=${!this.occupied["start-addon"]}><slot name="start-addon" @slotchange=${this.slotChanged}></slot></span>
 <form class="entry" novalidate @submit=${this.submit}><span class="affix" part="start" ?hidden=${!this.occupied.start && this.leading() === nothing}><slot name="start" @slotchange=${this.slotChanged}>${this.leading()}</slot></span>${this.control}<span class="affix" part="end" ?hidden=${!this.occupied.end}><slot name="end" @slotchange=${this.slotChanged}></slot></span>${this.renderActions()}</form>
 <span class="addon end-addon" part="end-addon" ?hidden=${!this.occupied["end-addon"]}><slot name="end-addon" @slotchange=${this.slotChanged}></slot></span></div>`;
  }
  protected updated() {
    super.updated();
    this.control.setAttribute("aria-busy", String(this.busy));
  }
}
