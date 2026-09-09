import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, glyph, sharedCss } from "../../base.js";
import { buttonCss } from "../button/button.styles.js";
import { codeCss } from "../code/code.styles.js";

/** Geist Snippet: one copyable command. */
@customElement("acme-snippet")
export class AcmeSnippet extends AcmeElement {
  static styles = [sharedCss, codeCss, buttonCss, css`:host{display:block}`];
  @property() text = "";
  @property({ type: Array }) lines: string[] = [];
  @property({ type: Boolean }) prompt = true;
  @property() variant: "" | "dark" | "success" | "error" | "warning" = "";
  @property() placeholder = "";
  private copied = false;
  private async copy() {
    try {
      await navigator.clipboard.writeText(this.lines.length ? this.lines.join("\n") : this.text);
      this.copied = true;
      this.requestUpdate();
      setTimeout(() => {
        this.copied = false;
        this.requestUpdate();
      }, 1500);
      this.dispatchEvent(new CustomEvent("acme-copy", { bubbles: true }));
    } catch {}
  }
  render() {
    const ls = this.lines.length ? this.lines : this.text ? [this.text] : [];
    return html`<div class=${this.cls("snippet", { prompt: this.prompt && ls.length > 0, [this.variant]: !!this.variant })} part="snippet">${ls.length ? ls.map((l) => html`<pre>${l}</pre>`) : html`<pre style="color:var(--text-2)">${this.placeholder}</pre>`}<button class="iconbtn" aria-label="Copy to clipboard" @click=${this.copy}>${glyph(this.copied ? "check" : "copy")}</button></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-snippet": AcmeSnippet;
  }
}
