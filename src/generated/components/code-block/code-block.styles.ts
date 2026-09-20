// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const codeBlockCss = css`.code-block :where(acme-copy-button.floating)::part(button) {
  z-index: 1;
  background-color: var(--ds-background-200);
  opacity: 0;
  width: 2rem;
  height: 2rem;
  position: absolute;
  top: min(16%, 16px);
  right: 1rem;
}

.code-block {
  border-radius: .5rem;
  margin-block: 1rem;
  position: relative;
  overflow: hidden;
}

.code-block :where(.bar) :where(.name) {
  margin: 0;
  min-width: 0;
  font-family: var(--acme-font-sans);
  color: var(--ds-gray-900);
  align-items: center;
  gap: .5rem;
  margin-right: auto;
  font-size: 13px;
  font-weight: 400;
  line-height: 16px;
  display: flex;
}

.code-block :where(.strip) {
  border-bottom-style: solid;
  border-bottom-width: 0;
  border-color: var(--ds-gray-400);
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0;
  display: flex;
  overflow-x: auto;
}

.code-block :where(.bar) {
  height: var(--ds-size-large);
  border-style: solid;
  border-width: 1px;
  border-color: var(--ds-gray-400);
  background-color: var(--ds-background-200);
  padding-block: 0;
  border-top-left-radius: .5rem;
  border-top-right-radius: .5rem;
  align-items: center;
  padding-left: 1rem;
  padding-right: 5px;
  display: flex;
}

.code-block :where(.bar) :where(.name) :where(.file-icon) {
  flex-shrink: 0;
  align-items: center;
  width: 1rem;
  display: flex;
}

.code-block :where(.bar) :where(.actions) {
  gap: .25rem;
  display: flex;
}

.code-block :where(.foot) {
  height: var(--ds-size-large);
  border-style: solid;
  border-width: 1px;
  border-color: var(--ds-gray-400);
  background-color: var(--ds-background-200);
  border-bottom-right-radius: .5rem;
  border-bottom-left-radius: .5rem;
  justify-content: flex-end;
  align-items: center;
  padding: .75rem;
  display: flex;
}

.code-block :where(.content) :where(.pre) :where(.body) {
  text-align: left;
  font-family: var(--font-mono);
  overflow-wrap: normal;
  word-break: normal;
  -webkit-hyphens: none;
  hyphens: none;
  white-space: pre;
  color: var(--ds-gray-1000);
  line-height: 20px;
  display: grid;
  font-size: 13px !important;
}

.code-block :where(.bar) :where(.name) :where(.filename) {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow-wrap: normal;
  word-break: normal;
  min-width: 0;
  max-width: 100%;
  display: inline-block;
  overflow: hidden;
}

.code-block :where(.bar) :where(.actions) :where(acme-copy-button)::part(label), .code-block :where(acme-copy-button.floating)::part(label) {
  text-overflow: ellipsis;
  white-space: nowrap;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  padding-inline: .375rem;
  display: inline-flex;
  overflow: hidden;
}

.code-block :where(.bar) :where(.actions) :where(acme-copy-button)::part(button) {
  width: 1.75rem;
  height: 1.75rem;
  color: var(--ds-gray-900) !important;
}

.code-block:where(:not(.with-bar)) :where(.content) {
  border-top-style: solid;
  border-top-width: 1px;
  border-top-left-radius: .5rem;
  border-top-right-radius: .5rem;
}

.code-block:where(.with-bar) {
  border-bottom-right-radius: .5rem;
  border-bottom-left-radius: .5rem;
}

.code-block:where(:not(.ask, .build)) :where(.content) {
  border-bottom-style: solid;
  border-bottom-width: 1px;
  border-bottom-right-radius: .5rem;
  border-bottom-left-radius: .5rem;
}

.code-block :where(.content) {
  border-inline-style: solid;
  border-inline-width: 1px;
  border-color: var(--ds-gray-400);
}

.code-block :where(.bar) :where(.name) > strong {
  color: var(--ds-gray-1000);
  font-weight: 500;
}

.code-block :where(.bar) :where(.actions) :where(acme-copy-button) svg {
  flex-shrink: 0;
}

.code-block :where(acme-copy-button.floating) svg {
  flex-shrink: 0;
  color: var(--ds-gray-900) !important;
}

.code-block :where(.foot) :where(acme-button) svg {
  flex-shrink: 0;
}

.code-block:where(:not(.with-bar)) :where(.content) > pre {
  border-top-left-radius: .5rem;
  border-top-right-radius: .5rem;
}

.code-block:where(:not(.ask, .build)) :where(.content) > pre {
  border-bottom-right-radius: .5rem;
  border-bottom-left-radius: .5rem;
}

@media (hover: hover) {
  .code-block[data-hover] :where(acme-copy-button.floating)::part(button) {
    opacity: 1;
  }
}

.code-block :where(acme-copy-button.floating)::part(button):focus {
  opacity: 1;
}

.code-block :where(acme-copy-button.floating)::part(button):disabled, .code-block :where(acme-copy-button.floating)[aria-disabled="true"]::part(button), .code-block :where(acme-copy-button.floating)[data-hover]::part(button) {
  background-color: var(--ds-gray-100);
}

:where(:host([data-dark])) .code-block :where(acme-copy-button.floating)[data-hover]::part(button) {
  background-color: var(--ds-gray-200);
}

.code-block :where(acme-copy-button.floating)[data-hover]::part(button):disabled {
  background-color: var(--ds-gray-100);
}

.code-block :where(.content) :where(.pre) {
  --padding: 16px;
  padding: var(--padding) 0;
  scrollbar-width: thin;
  scrollbar-color: var(--ds-gray-600) transparent;
  background: var(--ds-background-100);
  counter-reset: line;
  --shiki-color-text: var(--ds-gray-1000);
  --shiki-color-background: transparent;
  --shiki-token-constant: var(--ds-blue-900);
  --shiki-token-string: var(--ds-green-900);
  --shiki-token-comment: var(--ds-gray-900);
  --shiki-token-keyword: var(--ds-pink-900);
  --shiki-token-parameter: var(--ds-amber-900);
  --shiki-token-function: var(--ds-purple-900);
  --shiki-token-string-expression: var(--ds-green-900);
  --shiki-token-punctuation: var(--ds-gray-1000);
  --shiki-token-link: var(--ds-green-900);
  margin: 0;
  overflow-x: auto;
}

.code-block :where(.content) :where(.pre) .token {
  display: inline;
  position: relative;
}

.code-block :where(.content) :where(.pre) .ln {
  all: unset;
  width: 16px;
  color: var(--ds-gray-600);
  font-size: 13px;
  font-family: var(--font-mono);
  text-align: right;
  padding-right: var(--padding);
  cursor: pointer;
  -webkit-user-select: none;
  user-select: none;
  flex-shrink: 0;
  transition: color .125s ease-out;
}

.code-block :where(.content) :where(.pre) [data-added="true"] {
  background: var(--ds-green-300);
  box-shadow: inset 2px 0 0 0 var(--ds-green-900);
}

.code-block :where(.content) :where(.pre) [data-removed="true"] {
  background: var(--ds-red-300);
  box-shadow: inset 2px 0 0 0 var(--ds-red-900);
}

@media (width <= 600px) {
  .code-block :where(.content) :where(.pre) .ln {
    display: none;
  }
}

.code-block :where(.content) :where(.pre) .token.comment {
  color: var(--ds-gray-900) !important;
}

.code-block :where(.content) :where(.pre) .token.namespace {
  opacity: .7;
}

.code-block :where(.content) :where(.pre) .token.keyword {
  color: var(--ds-pink-900);
}

.code-block :where(.content) :where(.pre) .token.italic {
  font-style: italic;
}

.code-block :where(.content) :where(.pre) .token.deleted {
  color: var(--ds-red-900);
}

.code-block :where(.content) :where(.pre) .token.inserted {
  color: var(--ds-blue-900);
}

.code-block :where(.content) :where(.pre) .ln:focus-visible {
  outline: 2px solid var(--ds-focus-color);
}

.code-block :where(.content) :where(.pre) .ln:hover {
  color: var(--ds-gray-1000);
}

.code-block :where(.content) :where(.pre) .line[data-active="true"] {
  background: var(--ds-amber-300);
  box-shadow: inset 2px 0 0 0 var(--ds-amber-900);
}

.code-block :where(.content) :where(.pre) [data-added="true"]:after {
  content: "+";
  color: var(--ds-green-900);
  pointer-events: none;
  padding-left: 8px;
  font-weight: 500;
  position: absolute;
  inset: 0;
}

.code-block :where(.content) :where(.pre) [data-removed="true"]:after {
  content: "-";
  color: var(--ds-red-900);
  pointer-events: none;
  padding-left: 8px;
  font-weight: 500;
  position: absolute;
  inset: 0;
}

.code-block:where(.hide-numbers) :where(.content) :where(.pre) .ln {
  display: none;
}

.code-block :where(.content) :where(.pre) .language-json .token.boolean {
  color: var(--acme-success);
  font-weight: 600;
}

.code-block :where(.content) :where(.pre) .token.tag.attr-value {
  color: var(--ds-blue-900);
}

.code-block :where(.content) :where(.pre) .language-autohotkey .token.tag {
  color: #9a050f;
}

.code-block :where(.content) :where(.pre) .token.tag.script {
  color: var(--ds-gray-1000);
}

.code-block :where(.content) :where(.pre) .line {
  height: 20px;
  padding: 0 var(--padding);
  position: relative;
}

.code-block :where(.content) :where(.pre) .highlighted-line {
  height: 20px;
  padding: 0 var(--padding);
  background: var(--ds-blue-300);
  box-shadow: inset 2px 0 0 0 var(--ds-blue-900);
  position: relative;
}

.code-block :where(.content) :where(.pre) [data-highlighted="true"] {
  background: var(--ds-blue-300);
  box-shadow: inset 2px 0 0 0 var(--ds-blue-900);
}

.code-block :where(.content) :where(.pre) .line > div, .code-block :where(.content) :where(.pre) .highlighted-line > div {
  display: inline-block;
}

.code-block :where(.content) :where(.pre) .token.tag.script.string {
  color: var(--ds-blue-900);
}

.code-block :where(.content) :where(.pre) .token.directive.tag .tag {
  background: var(--ds-red-900);
  color: var(--ds-gray-900);
}

.code-block :where(.content) :where(.pre) .token.string, .code-block :where(.content) :where(.pre) .token.attr-value {
  color: var(--ds-green-900);
}

.code-block :where(.content) :where(.pre) .token.important, .code-block :where(.content) :where(.pre) .token.bold {
  font-weight: 700;
}

.code-block :where(.content) :where(.pre) .token.property, .code-block :where(.content) :where(.pre) .token.entity {
  color: var(--ds-red-900);
}

.code-block :where(.content) :where(.pre) .token.punctuation, .code-block :where(.content) :where(.pre) .token.operator {
  color: var(--ds-gray-1000);
}

.code-block :where(.content) :where(.pre) .token.selector, .code-block :where(.content) :where(.pre) .language-autohotkey .token.keyword {
  color: var(--ds-pink-900);
}

.code-block :where(.content) :where(.pre) .language-markdown .token.code, .code-block :where(.content) :where(.pre) .language-markdown-source .token.code {
  color: var(--ds-blue-900);
  font-weight: 400;
}

.code-block :where(.content) :where(.pre) .language-markdown .token.url, .code-block :where(.content) :where(.pre) .language-markdown-source .token.url {
  color: var(--ds-pink-900);
}

.code-block :where(.content) :where(.pre) .token.prolog, .code-block :where(.content) :where(.pre) .token.doctype, .code-block :where(.content) :where(.pre) .token.cdata {
  color: var(--accents-5);
}

.code-block :where(.content) :where(.pre) .token.function, .code-block :where(.content) :where(.pre) .token.attr-name, .code-block :where(.content) :where(.pre) .token.regex {
  color: var(--ds-purple-900);
}

.code-block :where(.content) :where(.pre) .token.tag, .code-block :where(.content) :where(.pre) .token.class-name, .code-block :where(.content) :where(.pre) .token.number {
  color: var(--ds-green-900);
}

.code-block :where(.content) :where(.pre) .language-json .token.property, .code-block :where(.content) :where(.pre) .language-markdown .token.title, .code-block :where(.content) :where(.pre) .language-markdown-source .token.title {
  color: var(--ds-gray-1000);
}

.code-block :where(.content) :where(.pre) .token.atrule, .code-block :where(.content) :where(.pre) .language-autohotkey .token.selector, .code-block :where(.content) :where(.pre) code[class*="language-css"] {
  font-weight: 600;
}

.code-block :where(.content) :where(.pre) .token.url, .code-block :where(.content) :where(.pre) .token.symbol, .code-block :where(.content) :where(.pre) .token.boolean, .code-block :where(.content) :where(.pre) .token.variable, .code-block :where(.content) :where(.pre) .token.constant {
  color: var(--ds-green-900);
}

.code-block :where(.content) :where(.pre) .language-markdown .token.list, .code-block :where(.content) :where(.pre) .language-markdown .token.hr, .code-block :where(.content) :where(.pre) .language-markdown-source .token.list, .code-block :where(.content) :where(.pre) .language-markdown-source .token.hr {
  color: var(--ds-gray-900);
}
`;
