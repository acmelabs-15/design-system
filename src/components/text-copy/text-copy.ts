import { css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, glyph, sharedCss } from "../../base.js";
import { buttonCss } from "../button/button.styles.js";
import { textCopyCss } from "./text-copy.styles.js";

/** Geist Text With Copy Button. */
@customElement("acme-text-copy")
export class AcmeTextCopy extends AcmeElement {
  static styles = [sharedCss, textCopyCss, buttonCss, css`:host{display:inline-flex}`];
  @property() text = "";
  @property({ type: Boolean }) ellipsis = false;
  private async copy() {
    try {
      await navigator.clipboard.writeText(this.text || this.textContent?.trim() || "");
    } catch {}
  }
  render() {
    return html`<span class="copy-text"><span class="text" style=${this.ellipsis ? nothing : "overflow:visible;white-space:normal"}><slot>${this.text}</slot></span><button class="iconbtn" aria-label="Copy" @click=${this.copy}>${glyph("copy")}</button></span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-text-copy": AcmeTextCopy;
  }
}
