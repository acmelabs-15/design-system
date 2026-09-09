import { SignalWatcher } from "@lit-labs/signals";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, glyph, sharedCss } from "../../base.js";
import { buttonCss } from "../button/button.styles.js";
import { toastCss } from "./toast.styles.js";

export type ToastVariant = "" | "success" | "warning" | "error";

/** Geist Toast: 420 wide, radius 12, padding 16; success fills blue, error red, warning amber. */
@customElement("acme-toast")
export class AcmeToast extends SignalWatcher(AcmeElement) {
  static styles = [sharedCss, toastCss, buttonCss];
  @property() variant: ToastVariant = "";
  @property({ type: Boolean, reflect: true }) open = false;
  @property({ type: Boolean }) static = false;
  render() {
    const c = this.cls("toast", { [this.variant]: !!this.variant, show: this.open || this.static });
    return html`<div class=${c} role=${this.variant === "error" ? "alert" : "status"} style=${this.static ? "position:static;transform:none;opacity:1;visibility:visible" : nothing} part="toast"><span><slot></slot></span><slot name="actions"></slot><button class="x" aria-label="Dismiss toast" @click=${() => {
      this.open = false;
      this.dispatchEvent(new CustomEvent("acme-dismiss", { bubbles: true }));
    }}>${glyph("x")}</button></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-toast": AcmeToast;
  }
}
