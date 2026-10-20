import { html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { AcmeElement, boolish, sharedCss } from "../../base";
import { atomState } from "../../shared/atom-state";
import { optionalString } from "../../shared/attributes";
import { Places } from "../../shared/places";
import { message, messageCatalogs } from "../../shared/messages";
import { StoreSelector } from "../../shared/store-connection";
import { snippetSurfaceCss } from "../../generated/components/snippet/snippet-surface.styles";
/** Plain command lines with an optional prompt and a composed copy action.
 * @slot start - Leading content.
 * @slot end - Trailing content before the copy action.
 * @csspart root - Command container.
 * @csspart code - Scrollable source lines.
 * @csspart prompt - Decorative command prompt.
 * @csspart actions - Copy action container.
 */
export class AcmeSnippet extends AcmeElement {
  static styles = [sharedCss, snippetSurfaceCss];
  @atomState() private source: string | readonly string[] = "";
  /** @default "" */
  @property({ noAccessor: true, useDefault: true, converter: { fromAttribute: (value: string | null) => (value?.trim().startsWith("[") ? JSON.parse(value) : (value ?? "")) } }) get text():
    | string
    | readonly string[] {
    return this.source;
  }
  set text(value: string | readonly string[]) {
    if (typeof value !== "string" && (!Array.isArray(value) || value.some((line) => typeof line !== "string"))) {
      throw new TypeError("Snippet text requires a string or an array of strings");
    }
    const old = this.source;
    this.source = typeof value === "string" ? value : Object.freeze([...value]);
    this.requestUpdate("text", old);
  }
  @atomState() @property({ noAccessor: true, attribute: "copy-text", converter: optionalString }) copyText?: string;
  @atomState() @property({ noAccessor: true, converter: boolish, useDefault: true }) prompt = true;
  @atomState() @property({ noAccessor: true, converter: boolish, useDefault: true }) copyable = true;
  @atomState() private treatment: "default" | "success" | "error" | "warning" = "default";
  /** @default "default" */
  @property({ noAccessor: true, useDefault: true }) get variant() {
    return this.treatment;
  }
  set variant(value: "default" | "success" | "error" | "warning") {
    if (!["default", "success", "error", "warning"].includes(value)) {
      throw new TypeError("Invalid Snippet variant");
    }
    const old = this.treatment;
    this.treatment = value;
    this.requestUpdate("variant", old);
  }
  @atomState() private scale: "small" | "medium" = "medium";
  /** @default "medium" */
  @property({ noAccessor: true, useDefault: true }) get size() {
    return this.scale;
  }
  set size(value: "small" | "medium") {
    if (value !== "small" && value !== "medium") {
      throw new TypeError("Invalid Snippet size");
    }
    const old = this.scale;
    this.scale = value;
    this.requestUpdate("size", old);
  }
  private readonly places = new Places(this, { places: ["start", "end"] });
  private readonly messages = new StoreSelector(this, () => messageCatalogs);
  private get sourceText() {
    return typeof this.text === "string" ? this.text : this.text.join("\n");
  }
  render() {
    const lines = this.sourceText.split("\n");
    return html`<div part="root" ?data-copyable=${this.copyable} data-size=${this.size} data-variant=${this.variant}><span class="affix" ?hidden=${!this.places.has("start")}><slot name="start"></slot></span><acme-scroll-area orientation="horizontal" size="small"><acme-scroll-viewport part="code" aria-label=${message(this.themeContext.scope.effective.get().locale, "snippet.commands", "Command source")}><div class="lines">${lines.map((line) => html`<div class="line">${this.prompt ? html`<span part="prompt" aria-hidden="true">$ </span>` : nothing}<acme-code>${line}</acme-code></div>`)}</div></acme-scroll-viewport></acme-scroll-area><span class="affix" ?hidden=${!this.places.has("end")}><slot name="end"></slot></span>${this.copyable ? html`<span part="actions"><acme-copy-button variant="tertiary" size="small" .value=${this.copyText ?? this.sourceText}></acme-copy-button></span>` : nothing}</div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-snippet": AcmeSnippet;
  }
}
