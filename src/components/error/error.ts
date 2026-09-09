import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base.js";
import { errorCss } from "./error.styles.js";

/** Geist Error: inline error copy, with an optional bold label and action. */
@customElement("acme-error")
export class AcmeError extends AcmeElement {
  static styles = [sharedCss, errorCss];
  @property() label = "";
  @property() size: "small" | "medium" | "large" = "medium";
  render() {
    return html`<div class=${this.cls("error-text", { sm: this.size === "small", lg: this.size === "large" })} aria-live="polite" part="error">${this.label ? html`<b>${this.label}:</b> ` : nothing}<slot></slot></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-error": AcmeError;
  }
}
