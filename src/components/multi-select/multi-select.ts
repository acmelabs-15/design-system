import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base.js";
import { buttonCss } from "../button/button.styles.js";
import { checkboxCss } from "../checkbox/checkbox.styles.js";
import { multiSelectCss } from "./multi-select.styles.js";

/** Geist Multi Select: a trigger reading the count, rows with a checkbox and a Check All / Only action. */
@customElement("acme-multi-select")
export class AcmeMultiSelect extends AcmeElement {
  static styles = [
    sharedCss,
    multiSelectCss,
    checkboxCss,
    buttonCss,
    css`:host{display:inline-block;position:relative} .multi-select{display:none;position:absolute;top:calc(100% + 10px);left:0;z-index:20} :host([open]) .multi-select{display:flex} :host([static]) .multi-select{display:flex;position:static}`,
  ];
  @property({ type: Array }) options: { value: string; label: string }[] = [];
  @property({ type: Array }) value: string[] = [];
  @property() noun = "items";
  @property({ type: Boolean, reflect: true }) open = false;
  @property({ type: Boolean, reflect: true }) static = false;
  private emit() {
    this.dispatchEvent(new CustomEvent("acme-change", { detail: { value: this.value }, bubbles: true, composed: true }));
  }
  private toggle(v: string) {
    this.value = this.value.includes(v) ? this.value.filter((x) => x !== v) : [...this.value, v];
    this.emit();
  }
  private smart(v: string) {
    const all = this.options.map((o) => o.value);
    this.value = this.value.length === all.length ? [v] : this.value.includes(v) && this.value.length === 1 ? all : this.value.length > 1 && this.value.includes(v) ? [v] : all;
    this.emit();
  }
  private onDoc = (e: Event) => {
    if (!e.composedPath().includes(this)) this.open = false;
  };
  connectedCallback() {
    super.connectedCallback();
    document.addEventListener("click", this.onDoc);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("click", this.onDoc);
  }
  render() {
    const n = this.value.length;
    const one = n === 1 ? this.options.find((o) => o.value === this.value[0])?.label : "";
    return html`<button class="btn select" style="font-weight:400" aria-haspopup="true" aria-expanded=${this.open} @click=${() => {
      this.open = !this.open;
    }}>${n === 0 ? `Select ${this.noun}` : one ? one : `${n} ${this.noun} selected`}</button>
      <div class="multi-select" role="group" @keydown=${(e: KeyboardEvent) => {
        if (e.key === "Escape") this.open = false;
      }}>${this.options.map((o) => {
        const on = this.value.includes(o.value);
        const label = this.value.length === this.options.length ? "Only" : on && this.value.length === 1 ? "Check All" : this.value.length > 1 && on ? "Only" : "Check All";
        return html`<div class="ms-row"><label class="checkbox"><input type="checkbox" .checked=${on} aria-label=${`Select ${o.label}`} @change=${() => this.toggle(o.value)}></label><button aria-label=${`${o.label}. ${label}`} @click=${() => this.smart(o.value)}><span>${o.label}</span><span class="action">${label}</span></button></div>`;
      })}</div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-multi-select": AcmeMultiSelect;
  }
}
