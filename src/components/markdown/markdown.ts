import { createHighlighter } from "@tanstack/highlight/core";
import { css as cssLang } from "@tanstack/highlight/languages/css";
import { html as htmlLang } from "@tanstack/highlight/languages/html";
import { js } from "@tanstack/highlight/languages/js";
import { json } from "@tanstack/highlight/languages/json";
import { plaintext } from "@tanstack/highlight/languages/plaintext";
import { shell } from "@tanstack/highlight/languages/shell";
import { ts } from "@tanstack/highlight/languages/ts";
import { tsx } from "@tanstack/highlight/languages/tsx";
import { createTanStackMarkdownHighlighter } from "@tanstack/highlight/markdown";
import { renderHtml } from "@tanstack/markdown/html";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { AcmeElement, sharedCss } from "../../base";
import { markdownCss } from "./markdown.styles";

const highlighter = createHighlighter({ languages: [plaintext, htmlLang, cssLang, js, ts, tsx, json, shell], fallbackLanguage: "plaintext" });
const highlightCode = createTanStackMarkdownHighlighter(highlighter);

/**
 * House Markdown: renders Markdown (the element's text, or `text`) with TanStack Markdown, code
 * fences highlighted by TanStack Highlight, set in the Geist type scale. Raw HTML in the source
 * is escaped unless `allow-html` is set, which is a trusted-content decision.
 */
@customElement("acme-markdown")
export class AcmeMarkdown extends AcmeElement {
  static styles = [sharedCss, markdownCss];
  /** The Markdown source; when empty, the element's own text content is used. */
  @property() text = "";
  /** Keep raw HTML in the source. Only for content you wrote. */
  @property({ type: Boolean, attribute: "allow-html" }) allowHtml = false;
  /** Line numbers on code fences. */
  @property({ type: Boolean, attribute: "line-numbers" }) lineNumbers = false;
  private observer?: MutationObserver;

  connectedCallback() {
    super.connectedCallback();
    // The element's text is read at render time (children may arrive after connection) and re-read when it changes.
    if (typeof MutationObserver !== "undefined") {
      this.observer = new MutationObserver(() => this.requestUpdate());
      this.observer.observe(this, { childList: true, characterData: true, subtree: true });
    }
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.observer?.disconnect();
  }

  get rendered(): string {
    return renderHtml(this.text || dedent(this.textContent ?? ""), { allowHtml: this.allowHtml, highlighter: highlightCode, codeLineNumbers: this.lineNumbers, headingAnchors: false });
  }

  render() {
    return html`<div class="markdown" part="markdown">${unsafeHTML(this.rendered)}</div>`;
  }
}

/** Strips the common indent of text written inside the element. */
function dedent(s: string): string {
  const lines = s.replace(/^\n+/, "").replace(/\s+$/, "").split("\n");
  const indent = Math.min(...lines.filter((l) => l.trim()).map((l) => l.match(/^\s*/)?.[0].length ?? 0));
  return lines.map((l) => l.slice(Number.isFinite(indent) ? indent : 0)).join("\n");
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-markdown": AcmeMarkdown;
  }
}
