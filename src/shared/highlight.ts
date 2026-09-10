// One TanStack Highlight instance for the code elements: the languages the docs examples use, plus
// the aliases the `syntax` and `language` attributes take. Unknown languages fall back to plain text.
import { createHighlighter } from "@tanstack/highlight/core";
import { css } from "@tanstack/highlight/languages/css";
import { diff } from "@tanstack/highlight/languages/diff";
import { html } from "@tanstack/highlight/languages/html";
import { js } from "@tanstack/highlight/languages/js";
import { json } from "@tanstack/highlight/languages/json";
import { jsx } from "@tanstack/highlight/languages/jsx";
import { plaintext } from "@tanstack/highlight/languages/plaintext";
import { shell } from "@tanstack/highlight/languages/shell";
import { ts } from "@tanstack/highlight/languages/ts";
import { tsx } from "@tanstack/highlight/languages/tsx";

export const highlighter = createHighlighter({ languages: [ts, tsx, js, jsx, html, css, json, shell, diff, plaintext], fallbackLanguage: "plaintext" });

const ALIAS: Record<string, string> = { javascript: "js", typescript: "ts", next: "tsx", bash: "shell", sh: "shell", zsh: "shell", text: "plaintext", txt: "plaintext" };

/** The highlighter's language name for a `syntax` / `language` value. */
export const langOf = (l: string) => {
  const k = (l || "plaintext").toLowerCase();
  return ALIAS[k] ?? k;
};
