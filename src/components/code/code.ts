import { css, html, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { highlighter, langOf } from "../../shared/highlight";
import { codeCss } from "./code.styles";

/** The token kinds the styles name, per highlighter kind (the rest keep their name). */
const KIND: Record<string, string> = { attr: "attr-name", literal: "boolean", type: "class-name", link: "url", meta: "prolog", heading: "title", command: "function", "code-inline": "code" };

/** The source as lines of token spans (`token <kind>`) and plain text, the highlighter's tokens split at newlines. */
export function tokenLines(code: string, lang: string): (TemplateResult | string)[][] {
  const lines: (TemplateResult | string)[][] = [[]];
  for (const t of highlighter.tokenize(code, { lang: langOf(lang) }).tokens) {
    t.value.split("\n").forEach((part, i) => {
      if (i) lines.push([]);
      if (!part) return;
      lines[lines.length - 1].push(t.className ? html`<span class=${`token ${KIND[t.className] ?? t.className}`}>${part}</span>` : part);
    });
  }
  return lines;
}

/** The element's text, without the leading newline of a template and the trailing whitespace. */
export const sourceOf = (el: Element) => (el.textContent ?? "").replace(/^\n/, "").replace(/\s+$/, "");

/**
 * Code: a bordered block (radius 5, padding 24, 32px vertical margins) of source in 13/20 mono
 * with syntax highlighting. The default slot's text is the source; `syntax` names its language
 * (`javascript`, `tsx`, `json`, `bash`, …); tokens carry `token <kind>` so the kinds' colors apply.
 */
@customElement("acme-code")
export class AcmeCode extends AcmeElement {
  static styles = [
    sharedCss,
    codeCss,
    css`
      :host {
        display: block;
      }
    `,
  ];
  /** The language of the source; unset highlights nothing. */
  @property() syntax = "";
  private observer?: MutationObserver;

  connectedCallback() {
    super.connectedCallback();
    if (typeof MutationObserver !== "undefined") {
      this.observer = new MutationObserver(() => this.requestUpdate());
      this.observer.observe(this, { childList: true, characterData: true, subtree: true });
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.observer?.disconnect();
  }

  render() {
    const lines = tokenLines(sourceOf(this), this.syntax);
    return html`<pre class="code" part="code"><code class="body" style="font-feature-settings:'liga' off">${lines.map((l, i) => html`${i ? "\n" : ""}${l}`)}</code></pre>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-code": AcmeCode;
  }
}
