import { css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base.js";
import { fieldCss } from "../../shared/field.styles.js";
import { type Size, sizeCls } from "../../shared/input.js";

/** Geist Textarea: padding 10 12, min-height 100. */
@customElement("acme-textarea")
export class AcmeTextarea extends AcmeElement {
  static styles = [sharedCss, fieldCss, css`:host{display:block} .field{margin:0}`];
  @property() label = "";
  @property() placeholder = "";
  @property() value = "";
  @property() name = "";
  @property() size: Size = "medium";
  @property() error = "";
  @property() helper = "";
  @property({ type: Number }) rows = 0;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean }) readonly = false;
  private uid = `ta-${Math.random().toString(36).slice(2, 8)}`;
  render() {
    return html`<div class=${this.cls("field", sizeCls(this.size))}>
      ${this.label ? html`<label for=${this.uid}>${this.label}</label>` : nothing}
      <textarea id=${this.uid} .value=${this.value} placeholder=${this.placeholder || nothing} name=${this.name || nothing} rows=${this.rows || nothing} ?disabled=${this.disabled} ?readonly=${this.readonly} aria-invalid=${this.error ? "true" : nothing} @input=${(
        e: Event,
      ) => {
        this.value = (e.target as HTMLTextAreaElement).value;
        this.dispatchEvent(new CustomEvent("acme-input", { detail: { value: this.value }, bubbles: true, composed: true }));
      }} part="textarea"></textarea>
      ${this.error ? html`<span class="msg error">${this.error}</span>` : this.helper ? html`<span class="msg">${this.helper}</span>` : nothing}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-textarea": AcmeTextarea;
  }
}
