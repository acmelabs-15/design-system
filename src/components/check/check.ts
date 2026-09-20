import { checkStructureCss } from "../../generated/components/check/check-structure.styles";
import { html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { checkCss } from "../../generated/components/check/check.styles";

/** House checklist row: a 20px box, a text with a sub line, and a when. */

export class AcmeCheck extends AcmeElement {
  static styles = [
    sharedCss,
    checkCss,
    checkStructureCss,
  ];
  @property({ type: Boolean, reflect: true }) checked = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property() when = "";
  render() {
    return html`<label class="check" part="row"><input type="checkbox" .checked=${this.checked} ?disabled=${this.disabled} @change=${(e: Event) => {
      this.checked = (e.target as HTMLInputElement).checked;
      this.dispatchEvent(new CustomEvent("acme-change", { detail: { checked: this.checked }, bubbles: true, composed: true }));
    }}><span class="text"><slot></slot><small><slot name="sub"></slot></small></span>${this.when ? html`<span class="when">${this.when}</span>` : nothing}</label>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-check": AcmeCheck;
  }
}
