import { css, html, nothing, svg } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { AcmeElement, glyphSized, sharedCss } from "../../base";
import { Interaction } from "../../shared/interaction";
import { toasts } from "../../shared/state";
import "../button/button";
import "../split-button/split-button";
import "../tabs/tabs";
import { sourceOf, tokenLines } from "../code/code";
import { copyButtonCss } from "../copy-button/copy-button.styles";
import { codeBlockCss } from "./code-block.styles";
import { codeBlockSwitcherCss } from "./code-block-switcher.styles";

export type CodeBlockOption = { label: string; value: string };
/** A language switch: its options, or `{ options, value }` as the reference writes it. */
type Switch = CodeBlockOption[] | { options: CodeBlockOption[]; value?: string };
const options = { fromAttribute: (v: string | null) => (v ? (JSON.parse(v) as Switch) : []) };
const numbers = { fromAttribute: (v: string | null) => (v ? (JSON.parse(v) as number[]) : []) };

/** The React atom for a JSX or TSX file, a page glyph for the rest; 16px, sized by attributes. */
const fileIcon = (filename: string, language: string) =>
  /\.[jt]sx$/.test(filename) || /^(jsx|tsx|next)$/.test(language)
    ? svg`<svg width="16" height="16" viewBox="-11.5 -10.23174 23 20.46348" style="shape-rendering:auto" aria-hidden="true"><circle cx="0" cy="0" r="2.05" fill="currentColor"></circle><g stroke="currentColor" stroke-width="1" fill="none"><ellipse rx="11" ry="4.2"></ellipse><ellipse rx="11" ry="4.2" transform="rotate(60)"></ellipse><ellipse rx="11" ry="4.2" transform="rotate(120)"></ellipse></g></svg>`
    : glyphSized("file");

const V0 = "https://v0.app/chat?q=";
const v0Prompt = (code: string) =>
  `\n  Create a minimal example app for this code: ${code} In your response:\n  1. Keep the example simple and focused on demonstrating the core functionality of the code\n  2. DO NOT include unnecessary features or complexity, aim to only showcase the essential parts\n  3. Show the code in a way that is easy to understand and implement\n  4. Provide clear and concise explanations for each part of the code\n  `;

/**
 * Code block: multi-line source with highlighting in a rounded frame. A filename bar (file icon,
 * name, the actions: an optional language select and the copy button) sits on top; without a
 * filename the copy button floats over the code and shows on the block's hover. The content is a
 * grid of lines, each with a line-number button that marks the line as referenced (amber);
 * `highlighted-lines-numbers` marks lines blue, `added-lines-numbers` green with a `+`,
 * `removed-lines-numbers` red with a `-`; `hide-line-numbers` hides the numbers. `switcher`
 * renders a language select, `tabs` a tab strip above the bar (`switcher-value` is the current
 * language; a change fires `acme-change`). `v0="ask"` adds an Open in v0 link in a foot,
 * `v0="build"` a split button. Copies fire `acme-copy`.
 */
@customElement("acme-code-block")
export class AcmeCodeBlock extends AcmeElement {
  static styles = [
    sharedCss,
    codeBlockCss,
    codeBlockSwitcherCss,
    copyButtonCss,
    css`
      :host {
        display: block;
      }
      /* The floating copy button's host takes no line of its own: the button inside it is positioned over the code. */
      acme-button.floating {
        display: block;
      }
    `,
  ];
  /** The paste destination shown in the bar; empty hides the bar. */
  @property() filename = "";
  /** The language for highlighting (`jsx`, `tsx`, `json`, `bash`, `diff`, …). */
  @property() language = "";
  @property({ type: Boolean, attribute: "hide-line-numbers" }) hideLineNumbers = false;
  /** One-based lines under discussion. */
  @property({ converter: numbers, attribute: "highlighted-lines-numbers" }) highlightedLinesNumbers: number[] = [];
  /** One-based added lines. */
  @property({ converter: numbers, attribute: "added-lines-numbers" }) addedLinesNumbers: number[] = [];
  /** One-based removed lines. */
  @property({ converter: numbers, attribute: "removed-lines-numbers" }) removedLinesNumbers: number[] = [];
  /** Language options for a select in the bar: `[{ "label", "value" }]` or `{ "options": [...], "value": "js" }`. */
  @property({ converter: options }) switcher: Switch = [];
  /** Language options as tabs above the bar instead of the select. */
  @property({ converter: options }) tabs: Switch = [];
  /** The current language of the switcher or the tabs. */
  @property({ attribute: "switcher-value" }) switcherValue = "";
  /** Adds an Open in v0 action in a foot: `ask` is a link, `build` a split button. */
  @property() v0: "" | "ask" | "build" = "";
  /** The source; when empty the element's text content is the source. */
  @property() code = "";
  /** The one-based line a reader referenced by pressing its number. */
  @property({ type: Number, attribute: "referenced-line" }) referencedLine = 0;
  @property({ attribute: "aria-label" }) label = "";
  @state() private done = false;
  @query(".code-block") private root!: HTMLElement;
  @query(".switcher") private switcherEl!: HTMLElement | null;
  private timer?: ReturnType<typeof setTimeout>;
  private interaction = new Interaction(this);
  private switcherInteraction = new Interaction(this);

  get source() {
    return this.code ? this.code.replace(/^\n/, "").replace(/\s+$/, "") : sourceOf(this);
  }

  private opts(s: Switch): CodeBlockOption[] {
    return Array.isArray(s) ? s : (s.options ?? []);
  }

  private get value() {
    return this.switcherValue || (!Array.isArray(this.switcher) && this.switcher.value) || (!Array.isArray(this.tabs) && this.tabs.value) || "";
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    clearTimeout(this.timer);
  }

  updated() {
    this.interaction.attach(this.root);
    this.switcherInteraction.attach(this.switcherEl);
  }

  private copy = async () => {
    const text = this.source;
    clearTimeout(this.timer);
    try {
      await navigator.clipboard.writeText(text);
      this.done = true;
      this.timer = setTimeout(() => {
        this.done = false;
      }, 1000);
      this.dispatchEvent(new CustomEvent("acme-copy", { detail: { text }, bubbles: true, composed: true }));
    } catch {
      toasts.error("Failed to copy to clipboard");
    }
  };

  private reference(n: number) {
    this.referencedLine = this.referencedLine === n ? 0 : n;
    if (typeof history !== "undefined") history.replaceState(null, "", this.referencedLine ? `#L${n}` : location.pathname + location.search);
    this.dispatchEvent(new CustomEvent("acme-reference", { detail: { line: this.referencedLine }, bubbles: true, composed: true }));
  }

  private switchTo(v: string) {
    this.switcherValue = v;
    this.dispatchEvent(new CustomEvent("acme-change", { detail: { value: v }, bubbles: true, composed: true }));
  }

  render() {
    const source = this.source;
    const lines = tokenLines(source, this.language);
    const flag = (list: number[], n: number) => (list.length ? String(list.includes(n)) : nothing);
    const copied = this.done;
    const copyButton = (floating: boolean) => html`<acme-button
      class=${floating ? "floating" : ""}
      variant=${floating ? "secondary" : "tertiary"}
      shape="square"
      size="small"
      svg-only
      aria-label="Copy to clipboard"
      @click=${this.copy}
      part="copy"
      >${copied ? html`<div class="sr" role="status" aria-live="assertive">Copied!</div>` : nothing}<div class=${this.cls("stack", { copied })}>
        <div class="check">${glyphSized("check")}</div>
        <div class="copy"><slot name="icon">${glyphSized("copy")}</slot></div>
      </div></acme-button
    >`;
    const switcher = this.opts(this.switcher);
    const tabs = this.opts(this.tabs);
    const current = switcher.find((o) => o.value === this.value) ?? switcher[0];
    const prompt = `${V0}${encodeURIComponent(v0Prompt(source))}`;
    return html`<div class=${this.cls("code-block", { "with-bar": !!this.filename, "hide-numbers": this.hideLineNumbers, ask: this.v0 === "ask", build: this.v0 === "build" })} aria-label=${this.label || nothing} part="frame">
      ${
        tabs.length
          ? html`<div class="strip" style="scrollbar-width:none;-ms-overflow-style:none">
              <acme-tabs variant="secondary" value=${this.value} aria-label="Language" @acme-change=${(e: CustomEvent) => this.switchTo(e.detail.value)}
                >${tabs.map((o) => html`<acme-tab value=${o.value}>${o.label}</acme-tab>`)}</acme-tabs
              >
            </div>`
          : nothing
      }
      ${
        this.filename
          ? html`<div class="bar">
              <div class="name"><div class="file-icon" aria-hidden="true">${fileIcon(this.filename, this.language)}</div><span class="filename">${this.filename}</span></div>
              <div class="actions">
                ${
                  switcher.length
                    ? html`<div class="switcher">
                        <div class="face" aria-hidden="true"><span>${current?.label ?? ""}</span>${glyphSized("chev-d")}</div>
                        <select aria-label="Language" .value=${this.value} @change=${(e: Event) => this.switchTo((e.target as HTMLSelectElement).value)}>
                          ${switcher.map((o) => html`<option value=${o.value} ?selected=${o.value === this.value}>${o.label}</option>`)}
                        </select>
                      </div>`
                    : nothing
                }
                ${copyButton(false)}
              </div>
            </div>`
          : copyButton(true)
      }
      <div class="content"><pre class="pre"><code class="body" style="font-feature-settings:'liga' off">${lines.map((l, i) => {
        const n = i + 1;
        return html`<div class="line" id=${`L${n}`} data-highlighted=${flag(this.highlightedLinesNumbers, n)} data-added=${flag(this.addedLinesNumbers, n)} data-removed=${flag(this.removedLinesNumbers, n)} data-active=${this.referencedLine === n ? "true" : nothing}><button class="ln" type="button" tabindex="-1" aria-hidden="true" aria-label="Add line anchor to the URL" @click=${() => this.reference(n)}>${n}</button><div class="tokens">${l}</div></div>`;
      })}</code></pre></div>
      ${
        this.v0
          ? html`<div class="foot">
              ${
                this.v0 === "build"
                  ? html`<acme-split-button variant="secondary" size="small" menu-button-label="open in v0" @acme-click=${() => window.open(prompt, "_blank", "noopener")}
                      ><div class="v0">${glyphSized("v0", 20)}<span class="sr">Open in v0</span></div><acme-split-button-item slot="items" @click=${() => window.open(prompt, "_blank", "noopener")}>Open in v0</acme-split-button-item></acme-split-button
                    >`
                  : html`<acme-button href=${prompt} variant="secondary" size="small" part="v0"><div class="v0">${glyphSized("v0", 20)}<span class="sr">Open in v0</span></div></acme-button>`
              }
            </div>`
          : nothing
      }
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-code-block": AcmeCodeBlock;
  }
}
