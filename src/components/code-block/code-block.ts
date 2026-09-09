import { css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, glyph, sharedCss } from "../../base.js";
import { buttonCss } from "../button/button.styles.js";
import { codeCss } from "../code/code.styles.js";

/** Geist Code Block: a filename bar, line numbers, highlighted lines. `code` is pre-highlighted HTML or plain text. */
@customElement("acme-code-block")
export class AcmeCodeBlock extends AcmeElement {
  static styles = [sharedCss, codeCss, buttonCss, css`:host{display:block} .code-frame .codeblock{white-space:pre}`];
  @property() filename = "";
  @property() language = "";
  @property({ type: Boolean, attribute: "line-numbers" }) lineNumbers = false;
  @property({ type: Array }) highlightLines: number[] = [];
  @property() code = "";
  private async copy() {
    try {
      await navigator.clipboard.writeText(this.code || this.textContent || "");
    } catch {}
  }
  render() {
    const src = this.code || (this.textContent ?? "").replace(/^\n/, "");
    const lines = src.split("\n");
    const body = this.lineNumbers
      ? lines.map((l, i) => html`<span class=${this.highlightLines.includes(i + 1) ? "hl" : ""}><span class="ln">${i + 1}</span>${l}${i < lines.length - 1 ? "\n" : ""}</span>`)
      : src;
    return html`<div class=${this.cls("code-frame", {})} part="frame">${this.filename ? html`<div class="code-bar">${glyph("file")}${this.filename}<button class="iconbtn" aria-label="Copy code" @click=${this.copy}>${glyph("copy")}</button></div>` : nothing}<pre class="codeblock" data-language=${this.language || nothing}>${body}</pre><slot name="footer"></slot></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-code-block": AcmeCodeBlock;
  }
}
