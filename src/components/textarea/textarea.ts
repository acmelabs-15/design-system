import { css, html, nothing } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { Interaction } from "../../shared/interaction";
import { textareaCss } from "./textarea.styles";
import "../error/error";

export type TextareaSize = "small" | "medium" | "large";

/**
 * A multi-line text field: a full-width wrapper (radius 6, large 8) around a textarea padded
 * 10 / 12 that does not resize by hand; `rows` fixes its height, `min-height` gives it a floor.
 * The wrapper carries the size and `error` modifiers and the interaction states (data-hover,
 * data-focus: focus within the field, data-active); `error` renders the message under it and
 * marks the field invalid. Form-associated and labelable.
 */
@customElement("acme-textarea")
export class AcmeTextarea extends AcmeElement {
  static formAssociated = true;
  static styles = [
    sharedCss,
    textareaCss,
    css`
      :host {
        display: block;
      }
      .field {
        display: block;
      }
    `,
  ];
  @property() placeholder = "";
  @property() value = "";
  @property() name = "";
  @property() size: TextareaSize = "medium";
  /** The message under the field; the wrapper turns red and the field reads as invalid. */
  @property() error = "";
  /** A fixed number of rows. */
  @property({ type: Number }) rows = 0;
  /** The field's minimum height, as CSS (a number is px). */
  @property({ attribute: "min-height" }) minHeight = "";
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean }) readonly = false;
  @property({ type: Boolean }) required = false;
  @property({ attribute: "aria-label" }) ariaLabelText = "";
  @query("textarea") textarea!: HTMLTextAreaElement;
  @query(".wrap") private wrap!: HTMLElement;
  private internals?: ElementInternals;
  private uid = `textarea-${Math.random().toString(36).slice(2, 8)}`;
  private interaction = new Interaction(this, { disabled: () => false });
  constructor() {
    super();
    try {
      this.internals = this.attachInternals();
    } catch {}
  }
  updated(ch: Map<string, unknown>) {
    this.interaction.attach(this.wrap);
    if (ch.has("value")) this.internals?.setFormValue?.(this.value);
  }
  formResetCallback() {
    this.value = this.getAttribute("value") ?? "";
  }
  focus(options?: FocusOptions) {
    this.textarea?.focus(options);
  }
  private onInput = (e: Event) => {
    this.value = (e.target as HTMLTextAreaElement).value;
    this.dispatchEvent(new CustomEvent("acme-input", { detail: { value: this.value }, bubbles: true, composed: true }));
  };
  private onChange = () => this.dispatchEvent(new CustomEvent("acme-change", { detail: { value: this.value }, bubbles: true, composed: true }));
  render() {
    const minHeight = this.minHeight ? (/^\d+$/.test(this.minHeight) ? `${this.minHeight}px` : this.minHeight) : "";
    return html`<label class="field" part="field"
      ><div class=${this.cls("wrap", { sm: this.size === "small", lg: this.size === "large", error: !!this.error })} part="wrap">
        <textarea
          id=${this.uid}
          .value=${this.value}
          placeholder=${this.placeholder || nothing}
          name=${this.name || nothing}
          rows=${this.rows || nothing}
          style=${minHeight ? `min-height:${minHeight}` : nothing}
          ?disabled=${this.disabled}
          ?readonly=${this.readonly}
          ?required=${this.required}
          autocomplete="off"
          aria-label=${this.ariaLabelText || nothing}
          aria-invalid=${this.error ? "true" : nothing}
          @input=${this.onInput}
          @change=${this.onChange}
          part="textarea"
        ></textarea></div
      >${this.error ? html`<acme-error size=${this.size} style="margin-top:var(--acme-gap-quarter)">${this.error}</acme-error>` : nothing}</label
    >`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-textarea": AcmeTextarea;
  }
}
