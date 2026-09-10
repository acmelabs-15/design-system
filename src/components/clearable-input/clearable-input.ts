import { css, html, nothing, type TemplateResult } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { AcmeElement, boolish, sharedCss } from "../../base";
import { clearableInputCss } from "./clearable-input.styles";
import "../input/input";
import "../kbd/kbd";
import type { AcmeInput } from "../input/input";

/**
 * A text field that clears itself: an acme-input whose end place is a clear button with an Esc key
 * once the field has a value, and Escape clears too. `cmdk` shows ⌘ K keys instead, which slide
 * to Esc while the field has a value (`data-animate` on the field). Clearing fires `acme-input`
 * and `acme-clear` and returns focus to the field. Form-associated and labelable.
 */
@customElement("acme-clearable-input")
export class AcmeClearableInput extends AcmeElement {
  static formAssociated = true;
  static styles = [
    sharedCss,
    clearableInputCss,
    css`
      :host {
        display: block;
      }
      .input {
        display: block;
      }
    `,
  ];
  @property() value = "";
  @property() placeholder = "";
  /** The text above the field. */
  @property() label = "";
  @property() name = "";
  /** Shows the ⌘ K keys, which slide to Esc while the field has a value. */
  @property({ type: Boolean, reflect: true }) cmdk = false;
  /** `"false"` hides the clear button. */
  @property({ converter: boolish, attribute: "show-clear-button" }) showClearButton = true;
  /** `"false"` keeps the page still when clearing returns focus to the field. */
  @property({ converter: boolish, attribute: "scroll-on-clear" }) scrollOnClear = true;
  @property({ type: Boolean, reflect: true }) disabled = false;
  /** A fixed width for the field, as CSS. */
  @property() width = "";
  @property({ attribute: "aria-label" }) ariaLabelText = "";
  @query("acme-input") protected field!: AcmeInput;
  private internals?: ElementInternals;
  constructor() {
    super();
    try {
      this.internals = this.attachInternals();
    } catch {}
  }
  updated(ch: Map<string, unknown>) {
    if (ch.has("value")) this.internals?.setFormValue?.(this.value);
  }
  formResetCallback() {
    this.value = this.getAttribute("value") ?? "";
  }
  protected emit(type: string) {
    this.dispatchEvent(new CustomEvent(type, { detail: { value: this.value }, bubbles: true, composed: true }));
  }
  /** Empties the field (firing `acme-input` and `acme-clear` when it had a value) and focuses it. */
  clear() {
    if (this.disabled) return;
    if (this.value) {
      this.value = "";
      this.emit("acme-input");
      this.emit("acme-clear");
    }
    this.field?.focus({ preventScroll: !this.scrollOnClear });
  }
  focus(options?: FocusOptions) {
    this.field?.focus(options);
  }
  private onInput = (e: Event) => {
    e.stopPropagation();
    this.value = (e as CustomEvent).detail.value;
    this.emit("acme-input");
  };
  private onChange = (e: Event) => {
    e.stopPropagation();
    this.emit("acme-change");
  };
  private onKeydown = (e: KeyboardEvent) => {
    if (e.key === "Escape" && !e.defaultPrevented) {
      e.preventDefault();
      this.clear();
    }
  };
  /** The field's type. */
  protected get inputType() {
    return "text";
  }
  /** The start content, when the element has one, already carrying its `slot`. */
  protected renderStart(): TemplateResult | typeof nothing {
    return nothing;
  }
  /** The accessible name given to the field. */
  protected get fieldLabel() {
    return this.ariaLabelText || this.label;
  }
  /** The keys or the clear button, inside the field at the end. */
  protected renderEnd(): TemplateResult | typeof nothing {
    const has = !!this.value;
    if (this.cmdk)
      return html`<div slot="end" class="cmdk" aria-label=${has ? "Press Esc to clear" : "Press Cmd + K to open the Command Menu"}>
        <acme-kbd class="k-esc" small aria-hidden="true"><span class="keys"><span data-key="esc">Esc</span><span data-key="cmd">⌘</span></span></acme-kbd
        ><acme-kbd class="k-k" small aria-hidden="true">K</acme-kbd>
      </div>`;
    if (this.showClearButton && has)
      return html`<button slot="end" class="clear" type="button" tabindex=${this.disabled ? "-1" : nothing} @click=${() => this.clear()}><acme-kbd small>Esc</acme-kbd></button>`;
    return nothing;
  }
  render() {
    return html`<acme-input
      class="input"
      clearable
      type=${this.inputType}
      .value=${this.value}
      placeholder=${this.placeholder || nothing}
      label=${this.label || nothing}
      name=${this.name || nothing}
      width=${this.width || nothing}
      ?disabled=${this.disabled}
      aria-label=${this.fieldLabel || nothing}
      data-animate=${String(!!this.value)}
      @acme-input=${this.onInput}
      @acme-change=${this.onChange}
      @keydown=${this.onKeydown}
      part="field"
      >${this.renderStart()}${this.renderEnd()}</acme-input
    >`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-clearable-input": AcmeClearableInput;
  }
}
