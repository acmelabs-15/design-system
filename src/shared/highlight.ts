import { html, type TemplateResult } from "lit";
// One TanStack Highlight instance for the code elements: the languages the docs examples use, plus
// the aliases the `syntax` and `language` attributes take. Unknown languages fall back to plain text.
import { createHighlighter } from "@tanstack/highlight/core";
import { css } from "@tanstack/highlight/languages/css";
import { diff } from "@tanstack/highlight/languages/diff";
import { html as htmlLanguage } from "@tanstack/highlight/languages/html";
import { js } from "@tanstack/highlight/languages/js";
import { json } from "@tanstack/highlight/languages/json";
import { jsx } from "@tanstack/highlight/languages/jsx";
import { plaintext } from "@tanstack/highlight/languages/plaintext";
import { shell } from "@tanstack/highlight/languages/shell";
import { ts } from "@tanstack/highlight/languages/ts";
import { tsx } from "@tanstack/highlight/languages/tsx";

export const highlighter = createHighlighter({ languages: [ts, tsx, js, jsx, htmlLanguage, css, json, shell, diff, plaintext], fallbackLanguage: "plaintext" });

const ALIAS: Record<string, string> = { javascript: "js", typescript: "ts", next: "tsx", bash: "shell", sh: "shell", zsh: "shell", text: "plaintext", txt: "plaintext" };

/** The highlighter's language name for a `syntax` / `language` value. */
export const langOf = (l: string) => {
  const k = (l || "plaintext").toLowerCase();
  return ALIAS[k] ?? k;
};

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
