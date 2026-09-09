import { css, html, nothing } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { AcmeElement, glyph, sharedCss } from "../../base.js";
import type { Size } from "../../shared/input.js";
import { kbdCss } from "../kbd/kbd.styles.js";
import { spinnerCss } from "../spinner/spinner.styles.js";
import { searchCss } from "./search.styles.js";

/** Geist Search Input: search icon, clear on Escape, optional ⌘K keycaps, loading. */
@customElement("acme-search")
export class AcmeSearch extends AcmeElement {
  static styles = [sharedCss, searchCss, kbdCss, spinnerCss, css`:host{display:block}`];
  @property() placeholder = "Search";
  @property() value = "";
  @property({ type: Boolean }) cmdk = false;
  @property({ type: Boolean }) loading = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property() size: Size = "medium";
  @query("input") input!: HTMLInputElement;
  private emit(type: string) {
    this.dispatchEvent(new CustomEvent(type, { detail: { value: this.value }, bubbles: true, composed: true }));
  }
  clear() {
    this.value = "";
    this.emit("acme-input");
    this.input?.focus();
  }
  render() {
    const mac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);
    return html`<div class=${this.cls("search", { sm: this.size === "small" })}>${glyph("search")}<input type="search" .value=${this.value} placeholder=${this.placeholder} ?disabled=${this.disabled} style=${this.disabled ? "background:var(--comp)" : nothing} @input=${(
      e: Event,
    ) => {
      this.value = (e.target as HTMLInputElement).value;
      this.emit("acme-input");
    }} @keydown=${(e: KeyboardEvent) => {
      if (e.key === "Escape") this.clear();
      if (e.key === "Enter") this.emit("acme-submit");
    }} part="input">
      ${this.loading ? html`<span class="spinner" aria-label="Loading"></span>` : this.value ? html`<button class="x" aria-label="Clear" @click=${this.clear}><kbd class="kbd sm">Esc</kbd></button>` : this.cmdk ? html`<kbd class="kbd sm" style="right:34px">${mac ? "⌘" : "Ctrl"}</kbd><kbd class="kbd sm">K</kbd>` : nothing}</div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-search": AcmeSearch;
  }
}
