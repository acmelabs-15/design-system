import { css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base.js";
import { checkboxCss } from "./checkbox.styles.js";

/** Geist Checkbox: 16px, radius 4, gray-700 border; `indeterminate` is visual only. */
@customElement("acme-checkbox")
export class AcmeCheckbox extends AcmeElement {
  static styles = [sharedCss, css`:host{display:inline-flex}`, checkboxCss];
  @property({ type: Boolean, reflect: true }) checked = false;
  @property({ type: Boolean }) indeterminate = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property() name = "";
  @property() value = "on";
  @property({ attribute: "aria-label" }) label = "";
  render() {
    return html`<label class="checkbox"><input type="checkbox" .checked=${this.checked} .indeterminate=${this.indeterminate} ?disabled=${this.disabled} name=${this.name || nothing} value=${this.value} aria-label=${this.label || nothing} @change=${(
      e: Event,
    ) => {
      this.checked = (e.target as HTMLInputElement).checked;
      this.indeterminate = false;
      this.dispatchEvent(new CustomEvent("acme-change", { detail: { checked: this.checked }, bubbles: true, composed: true }));
    }} part="input"><slot></slot></label>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-checkbox": AcmeCheckbox;
  }
}
