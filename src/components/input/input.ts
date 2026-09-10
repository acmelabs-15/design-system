import { css, html, nothing } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { Interaction } from "../../shared/interaction";
import { inputCss } from "./input.styles";
import { inputLabelCss } from "./input-label.styles";
import "../error/error";

export type InputSize = "small" | "medium" | "large";

/** A boolean that is true unless the attribute says `"false"`, for props that default to true. */
const onUnlessFalse = { fromAttribute: (v: string | null) => v !== "false", toAttribute: (v: boolean) => (v ? null : "false") };

/**
 * A single-line text field. A flex wrapper (32 / 36 / 40px, radius 6, large 8) holds the field
 * and, when given, a prefix cell before it and a suffix cell after it: text through `prefix` /
 * `suffix`, an element through the slots of the same names. A cell is filled and hairlined
 * unless its styling is off; a suffix without its container is slotted straight into the
 * wrapper. The wrapper carries the size, `error`, `rounded` and cell modifiers and the
 * interaction states (data-hover, data-focus: focus within the field, data-active). `label`
 * renders the text above the field; `error` renders the message under it and marks the field
 * invalid. Form-associated and labelable.
 */
@customElement("acme-input")
export class AcmeInput extends AcmeElement {
  static formAssociated = true;
  static styles = [
    sharedCss,
    inputCss,
    inputLabelCss,
    css`
      /* A flex column: the wrapper is its flex item, as it is in the stacks the field usually sits in, and fills the host width. */
      :host {
        display: flex;
        flex-direction: column;
      }
      .field {
        display: block;
      }
    `,
  ];
  /** The text above the field. */
  @property() label = "";
  @property() placeholder = "";
  @property() value = "";
  @property() type = "text";
  @property() name = "";
  @property() size: InputSize = "medium";
  /** The message under the field; the wrapper turns red and the field reads as invalid. */
  @property() error = "";
  /** Text in the prefix cell (the `prefix` slot takes an element instead). */
  @property() prefix = "";
  /** Text in the suffix cell (the `suffix` slot takes an element instead). */
  @property() suffix = "";
  /** `"false"` removes the fill and hairline of the prefix cell. */
  @property({ converter: onUnlessFalse, attribute: "prefix-styling" }) prefixStyling = true;
  /** `"false"` removes the fill and hairline of the suffix cell. */
  @property({ converter: onUnlessFalse, attribute: "suffix-styling" }) suffixStyling = true;
  /** `"false"` drops the prefix cell and slots the prefix straight into the wrapper. */
  @property({ converter: onUnlessFalse, attribute: "prefix-container" }) prefixContainer = true;
  /** `"false"` drops the suffix cell and slots the suffix straight into the wrapper. */
  @property({ converter: onUnlessFalse, attribute: "suffix-container" }) suffixContainer = true;
  /** The pill shape. */
  @property({ type: Boolean }) rounded = false;
  /** Set by a clearable field: the suffix cell loses its right padding. */
  @property({ type: Boolean }) clearable = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean }) readonly = false;
  @property({ type: Boolean }) required = false;
  @property() autocomplete = "off";
  /** A fixed width for the wrapper, as CSS. */
  @property() width = "";
  @property({ attribute: "aria-label" }) ariaLabelText = "";
  @property({ attribute: "aria-labelledby" }) ariaLabelledby = "";
  @state() private slottedPrefix = false;
  @state() private slottedSuffix = false;
  @query("input") input!: HTMLInputElement;
  @query(".wrap") private wrap!: HTMLElement;
  private internals?: ElementInternals;
  private uid = `input-${Math.random().toString(36).slice(2, 8)}`;
  // Hover reaches a disabled field too (its own ring), so the controller never holds it back.
  private interaction = new Interaction(this, { disabled: () => false });
  constructor() {
    super();
    try {
      this.internals = this.attachInternals();
    } catch {}
  }
  private readSlots() {
    this.slottedPrefix = !!this.querySelector('[slot="prefix"]');
    this.slottedSuffix = !!this.querySelector('[slot="suffix"]');
  }
  // A prefix or suffix slot exists only while it has content (the wrapper's positional rules count the
  // field as the last child otherwise), so the light DOM is watched for content that arrives later.
  private slotWatch?: MutationObserver;
  connectedCallback() {
    super.connectedCallback();
    this.readSlots();
    if (typeof MutationObserver !== "undefined") {
      this.slotWatch = new MutationObserver(() => this.readSlots());
      this.slotWatch.observe(this, { childList: true });
    }
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.slotWatch?.disconnect();
  }
  firstUpdated() {
    this.readSlots();
  }
  updated(ch: Map<string, unknown>) {
    this.interaction.attach(this.wrap);
    if (ch.has("value")) this.internals?.setFormValue?.(this.value);
  }
  formResetCallback() {
    this.value = this.getAttribute("value") ?? "";
  }
  private onInput = (e: Event) => {
    this.value = (e.target as HTMLInputElement).value;
    this.dispatchEvent(new CustomEvent("acme-input", { detail: { value: this.value }, bubbles: true, composed: true }));
  };
  private onChange = () => this.dispatchEvent(new CustomEvent("acme-change", { detail: { value: this.value }, bubbles: true, composed: true }));
  focus(options?: FocusOptions) {
    this.input?.focus(options);
  }
  render() {
    const hasPrefix = !!this.prefix || this.slottedPrefix;
    const hasSuffix = !!this.suffix || this.slottedSuffix;
    const prefixCell = hasPrefix && this.prefixContainer;
    const suffixCell = hasSuffix && this.suffixContainer;
    const iconSize = this.size === "large" ? 24 : 16;
    const cls = this.cls("wrap", {
      sm: this.size === "small",
      lg: this.size === "large",
      error: !!this.error,
      rounded: this.rounded,
      "with-prefix": hasPrefix,
      "with-suffix": hasSuffix,
      "plain-prefix": !this.prefixStyling,
      "plain-suffix": !this.suffixStyling,
      clearable: this.clearable,
    });
    const style = [`--acme-icon-size:${iconSize}px`, ...(this.width ? [`width:${this.width}`] : [])].join(";");
    const prefixSlot = html`<slot name="prefix" @slotchange=${this.readSlots}></slot>`;
    const suffixSlot = html`<slot name="suffix" @slotchange=${this.readSlots}></slot>`;
    const wrap = html`<div class=${cls} style=${style} part="wrap">
      <input
        id=${this.uid}
        type=${this.type}
        .value=${this.value}
        placeholder=${this.placeholder || nothing}
        name=${this.name || nothing}
        ?disabled=${this.disabled}
        ?readonly=${this.readonly}
        ?required=${this.required}
        autocomplete=${this.autocomplete || nothing}
        autocapitalize="none"
        autocorrect="off"
        spellcheck="false"
        aria-label=${this.ariaLabelText || nothing}
        aria-labelledby=${this.ariaLabelledby || nothing}
        aria-invalid=${this.error ? "true" : "false"}
        @input=${this.onInput}
        @change=${this.onChange}
        part="input"
      />
      ${prefixCell ? html`<label class="prefix" aria-hidden="true" for=${this.uid}>${this.prefix}${prefixSlot}</label>` : hasPrefix ? prefixSlot : nothing}
      ${suffixCell ? html`<label class="suffix" aria-hidden="true" for=${this.uid}>${this.suffix}${suffixSlot}</label>` : hasSuffix ? suffixSlot : nothing}
    </div>`;
    const field = this.label ? html`<label class="field" for=${this.uid}><div class="text">${this.label}</div>${wrap}</label>` : wrap;
    // The error line is small for every size but large, as the reference sizes it.
    return this.error ? html`<div>${field}<acme-error size=${this.size === "large" ? "large" : "small"} style="margin-top:var(--acme-gap-quarter)">${this.error}</acme-error></div>` : field;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-input": AcmeInput;
  }
}
