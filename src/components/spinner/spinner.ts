import { css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base.js";
import { spinnerCss } from "./spinner.styles.js";

/** Geist Spinner: twelve fading blades, 12 / 16 / 20. */
@customElement("acme-spinner")
export class AcmeSpinner extends AcmeElement {
  static styles = [sharedCss, spinnerCss, css`:host{display:inline-flex;vertical-align:middle}`];
  @property() size: "small" | "medium" | "large" = "medium";
  @property() color = "";
  render() {
    return html`<span class=${this.cls("spinner", { sm: this.size === "small", lg: this.size === "large" })} style=${this.color ? `color:${this.color}` : nothing} role="status" aria-label="Loading" part="spinner"></span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-spinner": AcmeSpinner;
  }
}
