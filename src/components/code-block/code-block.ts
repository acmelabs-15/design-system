import type { AcmeScrollViewport } from "../scroll-viewport/scroll-viewport";
import { deepActiveElement } from "../../shared/composed-tree";
import { createAtom } from "@tanstack/lit-store";
import { html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { sharedCss, boolish } from "../../base";
import { AcmeSemanticElement } from "../../shared/semantic-element";
import { atomState } from "../../shared/atom-state";
import { numberAttribute } from "../../shared/attributes";
import { Places } from "../../shared/places";
import { tokenLines } from "../../shared/highlight";
import { message, messageCatalogs } from "../../shared/messages";
import { StoreSelector } from "../../shared/store-connection";
import { codeBlockSurfaceCss } from "../../generated/components/code-block/code-block-surface.styles";
import { syntaxCss } from "../../generated/shared/syntax.styles";
function lineNumbers(value: readonly number[]): readonly number[] {
  if (!Array.isArray(value) || value.some((line) => !Number.isInteger(line) || line < 1)) throw new RangeError("Code line numbers must be positive integers");
  return Object.freeze([...new Set(value)]);
}
/** Escaped, highlighted source with exact copy text and application-owned line references.
 * @slot header - Content above the filename and actions.
 * @slot start - Leading filename-row content.
 * @slot end - Trailing filename-row controls.
 * @slot footer - Supporting content below the code.
 * @slot empty - Empty-source content.
 * @csspart root - Complete code block.
 * @csspart header - Filename and action row.
 * @csspart code - Native source element.
 * @csspart line - Source line.
 * @csspart line-number - Keyboard-accessible reference action.
 * @csspart footer - Supporting content container.
 * @fires {CustomEvent<{action:"reference-line",line:number}>} acme-request - Explicit line-reference request.
 * @fires {CustomEvent<{code:"highlight",message:string}>} acme-error - Highlighting failed; plain source remains visible.
 */
export class AcmeCodeBlock extends AcmeSemanticElement {
  static styles = [sharedCss, codeBlockSurfaceCss, syntaxCss];
  @atomState() @property({ noAccessor: true, useDefault: true }) code = "";
  @atomState() @property({ noAccessor: true, useDefault: true }) language = "";
  @atomState() @property({ noAccessor: true, useDefault: true }) filename = "";
  @atomState() @property({ noAccessor: true, attribute: "line-numbers", converter: boolish, useDefault: true }) lineNumbers = true;
  @atomState() @property({ noAccessor: true, converter: boolish, useDefault: true }) copyable = true;
  @atomState() @property({ noAccessor: true, type: Boolean }) wrap = false;
  @atomState() private highlights: readonly number[] = Object.freeze([]);
  /** @default [] */
  @property({ noAccessor: true, type: Array, attribute: "highlighted-lines", useDefault: true }) get highlightedLines() {
    return this.highlights;
  }
  set highlightedLines(value: readonly number[]) {
    const old = this.highlights;
    this.highlights = lineNumbers(value);
    this.requestUpdate("highlightedLines", old);
  }
  @atomState() private additions: readonly number[] = Object.freeze([]);
  /** @default [] */
  @property({ noAccessor: true, type: Array, attribute: "added-lines", useDefault: true }) get addedLines() {
    return this.additions;
  }
  set addedLines(value: readonly number[]) {
    const old = this.additions;
    this.additions = lineNumbers(value);
    this.requestUpdate("addedLines", old);
  }
  @atomState() private removals: readonly number[] = Object.freeze([]);
  /** @default [] */
  @property({ noAccessor: true, type: Array, attribute: "removed-lines", useDefault: true }) get removedLines() {
    return this.removals;
  }
  set removedLines(value: readonly number[]) {
    const old = this.removals;
    this.removals = lineNumbers(value);
    this.requestUpdate("removedLines", old);
  }
  @atomState() private reference?: number;
  @property({ noAccessor: true, attribute: "referenced-line", converter: numberAttribute }) get referencedLine() {
    return this.reference;
  }
  set referencedLine(value: number | undefined) {
    if (value !== undefined && (!Number.isInteger(value) || value < 1)) throw new RangeError("Referenced line must be a positive integer");
    const old = this.reference;
    this.reference = value;
    this.requestUpdate("referencedLine", old);
  }
  @atomState() private focusedLine = 1;
  private readonly places = new Places(this, { places: ["header", "start", "end", "footer", "empty"] });
  private readonly messages = new StoreSelector(this, () => messageCatalogs);
  private readonly highlighted = createAtom(() => {
    try {
      return { lines: tokenLines(this.code, this.language), error: undefined };
    } catch (error) {
      return { lines: this.code.split("\n").map((line) => [line]), error: error instanceof Error ? error.message : String(error) };
    }
  });
  private readonly updates = new StoreSelector(this, () => this.highlighted);
  private reported?: object;
  private recoverLineFocus = false;
  private readonly decorations = createAtom(() => ({ highlighted: new Set(this.highlightedLines), added: new Set(this.addedLines), removed: new Set(this.removedLines) }));
  protected willUpdate(changed: Map<PropertyKey, unknown>) {
    if (changed.has("code") || changed.has("lineNumbers")) {
      const active = deepActiveElement(this.ownerDocument);
      this.recoverLineFocus = active?.getRootNode() === this.renderRoot && active?.getAttribute("part") === "line-number";
    }
  }
  private text(key: string, fallback: string) {
    return message(this.themeContext.scope.effective.get().locale, "codeBlock." + key, fallback);
  }
  protected get semanticDefaults() {
    return { role: "group", label: this.filename || this.text("source", "Code source") };
  }
  private referenceLine(line: number) {
    this.dispatchEvent(new CustomEvent("acme-request", { detail: Object.freeze({ action: "reference-line", line }), bubbles: true, composed: true, cancelable: true }));
  }
  private get rows() {
    return [...this.renderRoot.querySelectorAll<HTMLElement>("[part=line]")];
  }
  /** Scrolls an existing one-based line into the code viewport without changing reference state. */
  scrollToLine(line: number) {
    if (!Number.isInteger(line) || line < 1) throw new RangeError("Code line must be a positive integer");
    void this.updateComplete.then(() => {
      if (!this.isConnected) return;
      const row = this.rows[line - 1],
        viewport = this.renderRoot.querySelector<AcmeScrollViewport>("acme-scroll-viewport")?.getViewport();
      if (!row || !viewport) return;
      const box = row.getBoundingClientRect(),
        view = viewport.getBoundingClientRect();
      if (box.top < view.top) viewport.scrollTop -= view.top - box.top;
      else if (box.bottom > view.bottom) viewport.scrollTop += box.bottom - view.bottom;
    });
  }
  private key = (event: KeyboardEvent) => {
    const button = event.currentTarget as HTMLButtonElement;
    let line = Number(button.dataset.line);
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    switch (event.key) {
      case "ArrowDown":
        line++;
        break;
      case "ArrowUp":
        line--;
        break;
      case "Home":
        line = 1;
        break;
      case "End":
        line = this.highlighted.get().lines.length;
        break;
      default:
        return;
    }
    event.preventDefault();
    line = Math.max(1, Math.min(this.highlighted.get().lines.length, line));
    this.focusedLine = line;
    void this.updateComplete.then(() => {
      this.rows[line - 1]?.querySelector<HTMLButtonElement>("button")?.focus({ preventScroll: true });
      this.scrollToLine(line);
    });
  };
  protected updated() {
    if (this.recoverLineFocus) {
      this.recoverLineFocus = false;
      const line = Math.min(this.focusedLine, this.highlighted.get().lines.length);
      const target = this.rows[line - 1]?.querySelector<HTMLButtonElement>("button");
      if (target) target.focus({ preventScroll: true });
      else this.renderRoot.querySelector<HTMLElement>("acme-copy-button,acme-scroll-viewport,[part=root]")?.focus({ preventScroll: true });
    }
    const model = this.highlighted.get();
    if (model !== this.reported) {
      this.reported = model;
      if (model.error) this.dispatchEvent(new CustomEvent("acme-error", { detail: Object.freeze({ code: "highlight", message: model.error }), bubbles: true, composed: true }));
    }
  }
  render() {
    const model = this.highlighted.get(),
      header = !!this.filename || this.places.has("start") || this.places.has("end"),
      tabLine = Math.min(Math.max(1, this.focusedLine), model.lines.length);
    const copy = () => html`<acme-copy-button variant="tertiary" size="small" .value=${this.code}></acme-copy-button>`;
    return html`<div part="root" class="root" tabindex="-1" ?data-wrap=${this.wrap} ?data-numbers=${this.lineNumbers}><slot name="header"></slot>${header ? html`<div part="header"><slot name="start"></slot>${this.filename ? html`<span class="filename"><acme-description-icon size="16px"></acme-description-icon><span>${this.filename}</span></span>` : nothing}<slot name="end"></slot>${this.copyable ? copy() : nothing}</div>` : this.copyable ? html`<span class="floating">${copy()}</span>` : nothing}${
      this.code
        ? html`<acme-scroll-area orientation=${this.wrap ? "vertical" : "both"}><acme-scroll-viewport aria-label=${this.text("source", "Code source")}><pre><code part="code">${model.lines.map(
            (line, index) => {
              const number = index + 1;
              return html`<span part="line" data-line=${number} data-highlighted=${this.decorations.get().highlighted.has(number) ? "true" : nothing} data-added=${this.decorations.get().added.has(number) ? "true" : nothing} data-removed=${this.decorations.get().removed.has(number) ? "true" : nothing} data-active=${this.referencedLine === number ? "true" : nothing}>${
                this.lineNumbers
                  ? html`<button part="line-number" data-line=${number} type="button" tabindex=${tabLine === number ? 0 : -1} aria-current=${this.referencedLine === number ? "true" : nothing} aria-label=${this.text("reference", "Reference line {line}").replace("{line}", String(number))} @focus=${() => {
                      this.focusedLine = number;
                    }} @keydown=${this.key} @click=${() => this.referenceLine(number)}>${number}</button>`
                  : nothing
              }<span class="tokens">${line}</span></span>`;
            },
          )}</code></pre></acme-scroll-viewport></acme-scroll-area>`
        : html`<div class="empty"><slot name="empty">${this.text("empty", "No code")}</slot></div>`
    }<div part="footer" ?hidden=${!this.places.has("footer")}><slot name="footer"></slot></div></div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-code-block": AcmeCodeBlock;
  }
}
