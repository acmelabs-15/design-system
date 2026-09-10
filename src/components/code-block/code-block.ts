import { css, html, nothing, svg } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { AcmeElement, glyphSized, sharedCss } from "../../base";
import { Interaction } from "../../shared/interaction";
import "../button/button";
import "../split-button/split-button";
import "../select/select";
import "../switch/switch";
import "../switch-control/switch-control";
import { sourceOf, tokenLines } from "../code/code";
import type { AcmeCopyButton } from "../copy-button/copy-button";
import "../copy-button/copy-button";
import { copyButtonCss } from "../copy-button/copy-button.styles";
import { codeBlockCss } from "./code-block.styles";

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
 * renders an acme-select, `tabs` an acme-switch above the bar (`switcher-value` is the current
 * language; a change fires `acme-change`). `v0="ask"` adds an Open in v0 link in a foot,
 * `v0="build"` a split button. Copies fire `acme-copy`.
 */
@customElement("acme-code-block")
export class AcmeCodeBlock extends AcmeElement {
  static styles = [
    sharedCss,
    codeBlockCss,
    copyButtonCss,
    css`
      :host {
        display: block;
      }
      /* The reference's block carries my-4, so the generated sheet sets margin-block: 1rem and that
         is the element's correct default. Their docs page then cancels it on every demo it holds,
         which a page of ours cannot do through a shadow boundary. This property is the way across:
         our docs preview sets it to 0, and any other page keeps the reference's spacing. */
      .code-block {
        margin-block: var(--acme-code-block-margin-block, 1rem);
      }
      /* The reference has no host between the frame and its floating button: the button itself is the
         absolutely-positioned box. Ours has two, acme-copy-button and the acme-button inside it, and
         an in-flow inline box takes a line of the frame's 24px line-height, which pushed the code
         down and left the button floating in the gap above it. A block host of zero height takes no
         line, and the frame stays the positioning context its absolute button resolves against. */
      acme-copy-button.floating {
        display: block;
        height: 0;
      }
      /* The strip carries the reference's scrolling tab-strip rule, which is right for their
         underlined tabs. Our acme-switch is a bordered segmented control, and its ring is a
         box-shadow, which paints outside the border box and so is clipped by that scrolling.
         One pixel of padding on each side gives the ring its room. The margin is the reference's
         own mb-3 (0.75rem) between its strip and the frame, which we lost when the switch stopped being
         mapped to their tab list. */
      .strip {
        padding: 1px;
        margin-bottom: 0.75rem;
      }
      /* The reference's actions row is gap-1 (4px) between two flat, borderless items. Ours holds a
         bordered select, so 4px puts its border hard against the copy button. The row also stretches
         its items by default, which left the select's host 32px tall around a 24px field. */
      .actions {
        align-items: center;
        gap: 0.5rem;
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
  @query(".code-block") private root!: HTMLElement;
  @query("acme-copy-button") private button?: AcmeCopyButton;
  private interaction = new Interaction(this);

  get source() {
    return this.code ? this.code.replace(/^\n/, "").replace(/\s+$/, "") : sourceOf(this);
  }

  private opts(s: Switch): CodeBlockOption[] {
    return Array.isArray(s) ? s : (s.options ?? []);
  }

  private get value() {
    return this.switcherValue || (!Array.isArray(this.switcher) && this.switcher.value) || (!Array.isArray(this.tabs) && this.tabs.value) || "";
  }

  updated() {
    this.interaction.attach(this.root);
  }

  /** Copies the source, as clicking the button does. The button owns the clipboard write, the
   *  one-second check and the failure toast. */
  copy(): void {
    this.button?.copy();
  }

  private reference(n: number) {
    this.referencedLine = this.referencedLine === n ? 0 : n;
    if (typeof history !== "undefined") history.replaceState(null, "", this.referencedLine ? `#L${n}` : location.pathname + location.search);
    this.dispatchEvent(new CustomEvent("acme-reference", { detail: { line: this.referencedLine }, bubbles: true, composed: true }));
  }

  /** The composed acme-select and acme-switch fire `acme-change` of their own, which would reach a
   *  listener on this element beside ours. Theirs stops here; ours carries the block's own value. */
  private switched(e: CustomEvent) {
    e.stopPropagation();
    this.switchTo(e.detail.value);
  }

  private switchTo(v: string) {
    this.switcherValue = v;
    this.dispatchEvent(new CustomEvent("acme-change", { detail: { value: v }, bubbles: true, composed: true }));
  }

  render() {
    const source = this.source;
    const lines = tokenLines(source, this.language);
    const flag = (list: number[], n: number) => (list.length ? String(list.includes(n)) : nothing);
    const copyButton = (floating: boolean) => html`<acme-copy-button
      class=${floating ? "floating" : ""}
      variant=${floating ? "secondary" : "tertiary"}
      shape="square"
      size="small"
      label="Copy to clipboard"
      text-to-copy=${this.source}
      part="copy"
      ><slot name="icon" slot="icon"></slot
    ></acme-copy-button>`;
    const switcher = this.opts(this.switcher);
    const tabs = this.opts(this.tabs);
    const prompt = `${V0}${encodeURIComponent(v0Prompt(source))}`;
    return html`<div class=${this.cls("code-block", { "with-bar": !!this.filename, "hide-numbers": this.hideLineNumbers, ask: this.v0 === "ask", build: this.v0 === "build" })} aria-label=${this.label || nothing} part="frame">
      ${
        tabs.length
          ? html`<div class="strip" style="scrollbar-width:none;-ms-overflow-style:none">
              <acme-switch size="small" value=${this.value} aria-label="Language" @acme-change=${this.switched}
                >${tabs.map((o) => html`<acme-switch-control value=${o.value} label=${o.label}></acme-switch-control>`)}</acme-switch
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
                    ? html`<acme-select
                        class="switcher"
                        size="tiny"
                        .options=${switcher}
                        .value=${this.value}
                        aria-label="Language"
                        @acme-change=${this.switched}
                      ></acme-select>`
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
