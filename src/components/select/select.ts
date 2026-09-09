import { css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base.js";
import { fieldCss } from "../../shared/field.styles.js";
import { type Size, sizeCls } from "../../shared/input.js";

/** Geist Select: a native select styled like Input. Pass options as `<option>` children. */
@customElement("acme-select")
export class AcmeSelect extends AcmeElement {
  static styles = [sharedCss, fieldCss, css`:host{display:block} .field{margin:0}`];
  @property() label = "";
  @property() value = "";
  @property() name = "";
  @property() size: Size = "medium";
  @property() error = "";
  @property() placeholder = "";
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Array }) options: (string | { value: string; label: string; disabled?: boolean })[] = [];
  private uid = `sel-${Math.random().toString(36).slice(2, 8)}`;
  connectedCallback() {
    super.connectedCallback();
    if (!this.options.length) this.options = Array.from(this.querySelectorAll("option")).map((o) => ({ value: o.value, label: o.textContent ?? "", disabled: o.disabled }));
  }
  render() {
    return html`<div class=${this.cls("field", sizeCls(this.size))}>
      ${this.label ? html`<label for=${this.uid}>${this.label}</label>` : nothing}
      <select id=${this.uid} name=${this.name || nothing} ?disabled=${this.disabled} aria-invalid=${this.error ? "true" : nothing} @change=${(e: Event) => {
        this.value = (e.target as HTMLSelectElement).value;
        this.dispatchEvent(new CustomEvent("acme-change", { detail: { value: this.value }, bubbles: true, composed: true }));
      }} part="select">
        ${this.placeholder ? html`<option value="" ?selected=${!this.value} disabled>${this.placeholder}</option>` : nothing}
        ${this.options.map((o) => (typeof o === "string" ? html`<option value=${o} ?selected=${o === this.value}>${o}</option>` : html`<option value=${o.value} ?selected=${o.value === this.value} ?disabled=${o.disabled}>${o.label}</option>`))}
      </select>
      ${this.error ? html`<span class="msg error">${this.error}</span>` : nothing}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-select": AcmeSelect;
  }
}
