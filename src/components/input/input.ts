import { css, html, nothing } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { AcmeElement, glyph, sharedCss } from "../../base.js";
import { fieldCss } from "../../shared/field.styles.js";
import { type Size, sizeCls } from "../../shared/input.js";

/** Geist Input: 32 / 36 / 40, radius 6 (large 8), label above, error below, prefix and suffix cells. */
@customElement("acme-input")
export class AcmeInput extends AcmeElement {
  static styles = [sharedCss, fieldCss, css`:host{display:block} .field{margin:0} .affix .plain{background:var(--surface)}`];
  @property() label = "";
  @property() placeholder = "";
  @property() value = "";
  @property() type = "text";
  @property() name = "";
  @property() size: Size = "medium";
  @property() error = "";
  @property() helper = "";
  @property() prefix = "";
  @property() suffix = "";
  @property({ type: Boolean, attribute: "prefix-plain" }) prefixPlain = false;
  @property({ type: Boolean }) rounded = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean }) readonly = false;
  @property({ type: Boolean }) required = false;
  @property({ type: Boolean }) clearable = false;
  @property() autocomplete = "";
  @query("input") input!: HTMLInputElement;
  private uid = `in-${Math.random().toString(36).slice(2, 8)}`;
  private onInput(e: Event) {
    this.value = (e.target as HTMLInputElement).value;
    this.dispatchEvent(new CustomEvent("acme-input", { detail: { value: this.value }, bubbles: true, composed: true }));
  }
  private onChange() {
    this.dispatchEvent(new CustomEvent("acme-change", { detail: { value: this.value }, bubbles: true, composed: true }));
  }
  clear() {
    this.value = "";
    this.input.value = "";
    this.onInput({ target: this.input } as any);
    this.input.focus();
  }
  focus() {
    this.input?.focus();
  }
  render() {
    const errId = `${this.uid}-err`;
    const input = html`<input id=${this.uid} type=${this.type} .value=${this.value} placeholder=${this.placeholder || nothing} name=${this.name || nothing} ?disabled=${this.disabled} ?readonly=${this.readonly} ?required=${this.required} autocomplete=${this.autocomplete || nothing} aria-invalid=${this.error ? "true" : nothing} aria-describedby=${this.error ? errId : nothing} @input=${this.onInput} @change=${this.onChange} @keydown=${(
      e: KeyboardEvent,
    ) => {
      if (e.key === "Escape" && this.clearable) this.clear();
    }} part="input">`;
    const hasAffix = this.prefix || this.suffix || this.clearable;
    return html`<div class=${this.cls("field", sizeCls(this.size))}>
      ${this.label ? html`<label for=${this.uid}>${this.label}</label>` : nothing}
      ${hasAffix ? html`<div class=${this.cls("affix", { rounded: this.rounded })}>${this.prefix ? html`<span class=${this.prefixPlain ? "plain" : ""}>${this.prefix}</span>` : nothing}${input}${this.suffix ? html`<span class=${this.prefixPlain ? "plain" : ""}>${this.suffix}</span>` : nothing}${this.clearable && this.value ? html`<span class="plain"><button class="x" style="border:0;background:transparent;display:inline-grid;place-items:center;color:var(--text-2);padding:0 4px" aria-label="Clear" @click=${this.clear}>${glyph("x")}</button></span>` : nothing}</div>` : input}
      ${this.error ? html`<span class="msg error" id=${errId}>${this.error}</span>` : this.helper ? html`<span class="msg">${this.helper}</span>` : nothing}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-input": AcmeInput;
  }
}
