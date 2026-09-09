import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base.js";
import { fieldCss } from "../../shared/field.styles.js";

/** Geist Label: 13/20 capitalized, gray-900. */
@customElement("acme-label")
export class AcmeLabel extends AcmeElement {
  static styles = [sharedCss, fieldCss];
  @property({ type: Boolean, attribute: "bypass-casing" }) bypassCasing = false;
  @property() for = "";
  render() {
    return html`<label class=${this.cls("form-label", { plain: this.bypassCasing })} for=${this.for || nothing} style=${this.bypassCasing ? "text-transform:none" : nothing} part="label"><slot></slot></label>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-label": AcmeLabel;
  }
}
