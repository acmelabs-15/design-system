import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base.js";
import { spinnerCss } from "../spinner/spinner.styles.js";
import { buttonCss } from "./button.styles.js";

export type ButtonVariant = "primary" | "secondary" | "tertiary" | "error" | "warning";

export type ButtonSize = "small" | "medium" | "large";

/** Geist Button: 32 / 36 / 40, label inset 12 / 16 / 20, radius 6 (large 8). Slots: default, prefix, suffix. */
@customElement("acme-button")
export class AcmeButton extends AcmeElement {
  static styles = [sharedCss, buttonCss, spinnerCss];
  @property() variant: ButtonVariant = "secondary";
  @property() size: ButtonSize = "medium";
  @property() shape: "square" | "circle" | "" = "";
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean }) loading = false;
  @property({ type: Boolean }) rounded = false;
  @property({ type: Boolean }) shadow = false;
  @property({ type: Boolean }) block = false;
  @property() href = "";
  @property() type: "button" | "submit" | "reset" = "button";
  @property({ attribute: "aria-label" }) label = "";

  render() {
    const c = this.cls("btn", {
      primary: this.variant === "primary",
      tertiary: this.variant === "tertiary",
      error: this.variant === "error",
      warning: this.variant === "warning",
      sm: this.size === "small",
      lg: this.size === "large",
      icon: !!this.shape,
      rounded: this.rounded || this.shape === "circle",
      shadow: this.shadow,
      block: this.block,
      loading: this.loading,
    });
    const inner = html`<slot name="prefix"></slot><slot></slot><slot name="suffix"></slot>`;
    if (this.href) return html`<a class=${c} href=${this.href} aria-label=${this.label || nothing} aria-disabled=${this.disabled ? "true" : nothing} part="button">${inner}</a>`;
    return html`<button class=${c} type=${this.type} ?disabled=${this.disabled} aria-busy=${this.loading ? "true" : nothing} aria-label=${this.label || nothing} part="button">${inner}</button>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-button": AcmeButton;
  }
}
