import { css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base.js";
import { toggleCss } from "./toggle.styles.js";

/** Geist Toggle: 28×14, blue on; sizes medium 36×20 and large 40×24. */
@customElement("acme-toggle")
export class AcmeToggle extends AcmeElement {
  static styles = [sharedCss, css`:host{display:inline-flex}`, toggleCss];
  @property({ type: Boolean, reflect: true }) checked = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property() size: "small" | "medium" | "large" = "small";
  @property() color: "" | "amber" | "red" = "";
  @property() label = "";
  @property({ attribute: "aria-label" }) ariaLabelText = "";
  render() {
    return html`<label class=${this.cls("toggle", { md: this.size === "medium", lg: this.size === "large", [this.color]: !!this.color })}>${this.label ? html`<span class="label">${this.label}</span>` : nothing}<input type="checkbox" role="switch" .checked=${this.checked} ?disabled=${this.disabled} aria-label=${this.ariaLabelText || this.label || nothing} @change=${(
      e: Event,
    ) => {
      this.checked = (e.target as HTMLInputElement).checked;
      this.dispatchEvent(new CustomEvent("acme-change", { detail: { checked: this.checked }, bubbles: true, composed: true }));
    }} part="input"><slot></slot></label>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-toggle": AcmeToggle;
  }
}
