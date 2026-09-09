import { css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base.js";
import { radioCss } from "./radio.styles.js";

/** Geist Radio: 16px circle with an 8px dot; group with the same name. */
@customElement("acme-radio")
export class AcmeRadio extends AcmeElement {
  static styles = [sharedCss, css`:host{display:inline-flex}`, radioCss];
  @property({ type: Boolean, reflect: true }) checked = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property() name = "";
  @property() value = "";
  render() {
    return html`<label class="radio"><input type="radio" .checked=${this.checked} ?disabled=${this.disabled} name=${this.name || nothing} value=${this.value} @change=${() => {
      this.checked = true;
      for (const r of document.querySelectorAll<AcmeRadio>(`acme-radio[name="${this.name}"]`)) if (r !== this) r.checked = false;
      this.dispatchEvent(new CustomEvent("acme-change", { detail: { value: this.value }, bubbles: true, composed: true }));
    }} part="input"><slot></slot></label>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-radio": AcmeRadio;
  }
}
