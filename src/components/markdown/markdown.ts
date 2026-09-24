import type { AcmeScrollArea } from "../scroll-area/scroll-area";
import { createAtom } from "@tanstack/lit-store";
import { createTanStackMarkdownHighlighter } from "@tanstack/highlight/markdown";
import { parseMarkdown } from "@tanstack/markdown/parser";
import { renderHtml } from "@tanstack/markdown/html";
import { html, render } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { atomState } from "../../shared/atom-state";
import { StoreSelector } from "../../shared/store-connection";
import { highlighter, langOf } from "../../shared/highlight";
import { RootStyles } from "../../shared/root-styles";
import { message, messageCatalogs } from "../../shared/messages";
import { markdownStructureCss } from "../../generated/components/markdown/markdown-structure.styles";
import { markdownLightCss } from "../../generated/components/markdown/markdown-light.styles";
const highlight = createTanStackMarkdownHighlighter(highlighter);
const escaped = (text: string) => text.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);
type Failure = Readonly<{ code: "parse" | "highlight"; message: string }>;
/** Component-owned native prose from a single Markdown source.
 * Native output is under [data-acme-markdown-prose] in this element's light DOM.
 * Raw HTML requires an explicit trusted-content opt-in; it is not sanitized.
 * @csspart root - Stable wrapper around the native prose.
 * @cssprop --acme-markdown-scroll-offset - Clearance above native heading fragment targets.
 * @fires {CustomEvent<{code:"parse"|"highlight";message:string}>} acme-error - Rendering failed; safe source remains visible.
 */
export class AcmeMarkdown extends AcmeElement {
  static styles = [sharedCss, markdownStructureCss];
  @atomState() @property({ noAccessor: true, useDefault: true }) text = "";
  @atomState() @property({ noAccessor: true, type: Boolean, attribute: "allow-html" }) allowHtml = false;
  @atomState() @property({ noAccessor: true, type: Boolean, attribute: "line-numbers" }) lineNumbers = false;
  private static sequence = 0;
  private readonly identity = "acme-markdown-" + ++AcmeMarkdown.sequence;
  private readonly slotName = this.identity + "-prose";
  private readonly outputSlot = this.ownerDocument.createElement("slot");
  private readonly prose = this.ownerDocument.createElement("div");
  private readonly lightStyles = new RootStyles(this, [markdownLightCss]);
  private readonly messages = new StoreSelector(this, () => messageCatalogs);
  @atomState() private fragmentPrefix = this.identity;
  private readonly parsed = createAtom(() => {
    try {
      return { document: parseMarkdown(this.text, { allowHtml: this.allowHtml }), error: undefined };
    } catch (error) {
      return { document: undefined, error: error instanceof Error ? error.message : String(error) };
    }
  });
  private readonly prepared = createAtom(() => {
    const parsed = this.parsed.get();
    const errors: Failure[] = [];
    if (!parsed.document) return { html: undefined, text: this.text, errors: [{ code: "parse" as const, message: parsed.error ?? "Could not parse Markdown" }] };
    try {
      const output = renderHtml(parsed.document, {
        allowHtml: this.allowHtml,
        codeLineNumbers: this.lineNumbers,
        headingAnchors: false,
        highlighter: (code, lang, options) => {
          try {
            return highlight(code, langOf(lang ?? ""), options);
          } catch (error) {
            errors.push({ code: "highlight", message: error instanceof Error ? error.message : String(error) });
            return escaped(code);
          }
        },
      });
      return { html: output, text: undefined, errors };
    } catch (error) {
      return { html: undefined, text: this.text, errors: [{ code: "parse" as const, message: error instanceof Error ? error.message : String(error) }] };
    }
  });
  private readonly updates = new StoreSelector(this, () => this.prepared);
  private previous?: object;
  private previousPrefix = "";
  private observer?: MutationObserver;
  private readonly ids = new WeakMap<Element, string>();
  private readonly references = new WeakMap<Element, Map<string, string>>();
  constructor() {
    super();
    this.outputSlot.name = this.slotName;
  }
  private original(element: Element, attribute: string) {
    let values = this.references.get(element);
    if (!values) {
      values = new Map();
      this.references.set(element, values);
    }
    if (!values.has(attribute)) values.set(attribute, element.getAttribute(attribute) ?? "");
    return values.get(attribute)!;
  }
  private namespace() {
    const names = new Map<string, string>(),
      counts = new Map<string, number>();
    for (const element of this.prose.querySelectorAll<HTMLElement>("[id]")) {
      const original = this.ids.get(element) ?? element.id;
      this.ids.set(element, original);
      if (!original) continue;
      const count = (counts.get(original) ?? 0) + 1;
      counts.set(original, count);
      const name = this.fragmentPrefix + "-" + original + (count > 1 ? "-" + count : "");
      element.id = name;
      if (!names.has(original)) names.set(original, name);
    }
    for (const element of this.prose.querySelectorAll<HTMLElement>("[href],[for],[aria-labelledby],[aria-describedby],[aria-controls],[aria-activedescendant],[headers]")) {
      if (element.hasAttribute("href")) {
        const href = this.original(element, "href");
        if (href.startsWith("#")) {
          let id = href.slice(1);
          try {
            id = decodeURIComponent(id);
          } catch {}
          const mapped = names.get(id);
          if (mapped) element.setAttribute("href", "#" + encodeURIComponent(mapped));
        }
      }
      for (const attribute of ["for", "aria-labelledby", "aria-describedby", "aria-controls", "aria-activedescendant", "headers"])
        if (element.hasAttribute(attribute)) {
          const value = this.original(element, attribute);
          element.setAttribute(
            attribute,
            value
              .split(/\s+/)
              .map((id) => names.get(id) ?? id)
              .join(" "),
          );
        }
    }
  }
  private prepareNativeContent() {
    const document = this.ownerDocument;
    const locale = this.themeContext.scope.effective.get().locale;
    const codeLabel = message(locale, "markdown.code", "Code source");
    for (const heading of this.prose.querySelectorAll("section[data-footnotes] h2")) {
      const text = message(locale, "markdown.footnotes", "Footnotes");
      if (heading.textContent !== text) heading.textContent = text;
    }
    for (const link of this.prose.querySelectorAll("[data-footnote-backref]")) {
      const original = this.original(link, "aria-label"),
        reference = original.match(/\d+(?:-\d+)?$/)?.[0];
      if (reference) {
        const label = message(locale, "markdown.backToReference", "Back to reference {reference}").replace("{reference}", reference);
        if (link.getAttribute("aria-label") !== label) link.setAttribute("aria-label", label);
      }
    }
    for (const cell of this.prose.querySelectorAll<HTMLElement>("th[style],td[style]")) {
      const alignment = cell.style.textAlign;
      if (cell.style.length === 1 && ["left", "center", "right"].includes(alignment)) {
        cell.removeAttribute("style");
        cell.setAttribute("data-acme-markdown-align", alignment);
      }
    }
    for (const pre of this.prose.querySelectorAll<HTMLPreElement>("pre.tm-code")) {
      if (pre.parentElement?.localName === "acme-scroll-viewport") {
        if (pre.parentElement.ariaLabel !== codeLabel) pre.parentElement.ariaLabel = codeLabel;
        continue;
      }
      const area: AcmeScrollArea = document.createElement("acme-scroll-area"),
        viewport = document.createElement("acme-scroll-viewport");
      area.orientation = "horizontal";
      viewport.setAttribute("aria-label", codeLabel);
      pre.replaceWith(area);
      viewport.append(pre);
      area.append(viewport);
    }
  }
  connectedCallback() {
    super.connectedCallback();
    this.fragmentPrefix = this.id || this.identity;
    this.prose.setAttribute("data-acme-markdown-prose", "");
    this.prose.slot = this.slotName;
    if (this.prose.parentNode !== this) this.append(this.prose);
    this.observer = new MutationObserver(() => {
      this.fragmentPrefix = this.id || this.identity;
    });
    this.observer.observe(this, { attributes: true, attributeFilter: ["id"] });
    this.requestUpdate();
  }
  disconnectedCallback() {
    this.observer?.disconnect();
    this.observer = undefined;
    super.disconnectedCallback();
  }
  protected updated() {
    const prepared = this.prepared.get();
    if (this.prose.parentNode !== this) this.append(this.prose);
    if (prepared !== this.previous) {
      this.previous = prepared;
      if (prepared.html !== undefined) render(unsafeHTML(prepared.html), this.prose, { host: this });
      else render(html`<pre class="tm-code"><code>${prepared.text}</code></pre>`, this.prose, { host: this });
      this.prepareNativeContent();
      this.namespace();
      this.previousPrefix = this.fragmentPrefix;
      for (const error of prepared.errors) this.dispatchEvent(new CustomEvent("acme-error", { detail: Object.freeze(error), bubbles: true, composed: true }));
    } else if (this.previousPrefix !== this.fragmentPrefix) {
      this.namespace();
      this.previousPrefix = this.fragmentPrefix;
    }
    this.prepareNativeContent();
  }
  render() {
    return html`<div part="root">${this.outputSlot}</div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-markdown": AcmeMarkdown;
  }
}
