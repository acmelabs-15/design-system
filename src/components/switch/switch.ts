import { css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base.js";
import { switchCss } from "./switch.styles.js";

/** Geist Switch: a segmented selector for two or three views. Children: acme-switch-control with `value`. */
@customElement("acme-switch")
export class AcmeSwitch extends AcmeElement {
  static styles = [sharedCss, switchCss, css`:host{display:inline-flex} :host([fill]){display:flex} ::slotted(*){display:contents}`];
  @property() value = "";
  @property() size: "small" | "medium" | "large" = "medium";
  @property({ type: Boolean, reflect: true }) fill = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ attribute: "aria-label" }) label = "";
  @property({ type: Array }) options: { value: string; label: string; icon?: string; disabled?: boolean }[] = [];
  connectedCallback() {
    super.connectedCallback();
    if (!this.options.length)
      this.options = Array.from(this.querySelectorAll("acme-switch-control, option")).map((o) => ({
        value: o.getAttribute("value") ?? o.textContent ?? "",
        label: o.textContent ?? "",
        disabled: o.hasAttribute("disabled"),
      }));
    if (!this.value && this.options[0]) this.value = this.options[0].value;
  }
  render() {
    return html`<div class=${this.cls("switch", { sm: this.size === "small", lg: this.size === "large", fill: this.fill })} role="radiogroup" aria-label=${this.label || nothing} part="switch">
      ${this.options.map(
        (o) =>
          html`<button role="radio" aria-checked=${o.value === this.value} aria-pressed=${o.value === this.value} ?disabled=${this.disabled || o.disabled} @click=${() => {
            this.value = o.value;
            this.dispatchEvent(new CustomEvent("acme-change", { detail: { value: o.value }, bubbles: true, composed: true }));
          }}>${o.label}</button>`,
      )}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-switch": AcmeSwitch;
  }
}
