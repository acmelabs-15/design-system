import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, glyph, sharedCss } from "../../base.js";
import { buttonCss } from "../button/button.styles.js";

/** Geist Copy Button: a 36px icon button that copies `text` and shows a check. */
@customElement("acme-copy-button")
export class AcmeCopyButton extends AcmeElement {
  static styles = [sharedCss, buttonCss, css`.done{color:var(--success-ink)}`];
  @property() text = "";
  @property() label = "Copy";
  @property() size: "small" | "medium" = "medium";
  private done = false;
  private async copy() {
    try {
      await navigator.clipboard.writeText(this.text);
      this.done = true;
      this.requestUpdate();
      setTimeout(() => {
        this.done = false;
        this.requestUpdate();
      }, 1500);
      this.dispatchEvent(new CustomEvent("acme-copy", { detail: { text: this.text }, bubbles: true }));
    } catch {}
  }
  render() {
    return html`<button class=${this.cls("iconbtn", { sm: this.size === "small", done: this.done })} aria-label=${this.label} @click=${this.copy} part="button">${glyph(this.done ? "check" : "copy")}</button>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-copy-button": AcmeCopyButton;
  }
}
