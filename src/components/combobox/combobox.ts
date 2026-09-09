import { css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, glyph, sharedCss } from "../../base.js";
import { type Size, sizeCls } from "../../shared/input.js";
import { menuCss } from "../menu/menu.styles.js";
import { comboboxCss } from "./combobox.styles.js";

/** Geist Combobox: an input that filters `options`; the list is the Menu. */
@customElement("acme-combobox")
export class AcmeCombobox extends AcmeElement {
  static styles = [sharedCss, comboboxCss, menuCss, css`:host{display:block;position:relative} .menu{position:absolute;left:0;right:0;z-index:20}`];
  @property() placeholder = "Search…";
  @property() value = "";
  @property() label = "";
  @property({ type: Array }) options: string[] = [];
  @property() size: Size = "medium";
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property() error = "";
  @property() noun = "items";
  @property({ type: Boolean, reflect: true }) open = false;
  private query = "";
  private active = 0;
  connectedCallback() {
    super.connectedCallback();
    if (!this.options.length) this.options = Array.from(this.querySelectorAll("option")).map((o) => o.textContent ?? "");
  }
  private get hits() {
    const q = this.query.toLowerCase();
    return this.options.filter((o) => o.toLowerCase().includes(q));
  }
  private choose(v: string) {
    this.value = v;
    this.query = "";
    this.open = false;
    this.dispatchEvent(new CustomEvent("acme-change", { detail: { value: v }, bubbles: true, composed: true }));
  }
  private onKey(e: KeyboardEvent) {
    const m = this.hits;
    if (e.key === "ArrowDown") {
      this.open = true;
      this.active = Math.min(this.active + 1, m.length - 1);
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      this.active = Math.max(this.active - 1, 0);
      e.preventDefault();
    } else if (e.key === "Enter" && this.open && m[this.active]) {
      this.choose(m[this.active]);
      e.preventDefault();
    } else if (e.key === "Escape") {
      if (this.value) {
        this.value = "";
        this.dispatchEvent(new CustomEvent("acme-change", { detail: { value: "" }, bubbles: true, composed: true }));
      }
      this.open = false;
    }
    this.requestUpdate();
  }
  render() {
    const m = this.hits;
    return html`${this.label ? html`<span class="form-label" style="display:block;font-size:13px;line-height:20px;color:var(--text-2);text-transform:capitalize;margin-bottom:6px">${this.label}</span>` : nothing}
      <div class=${this.cls("combobox", sizeCls(this.size))}>${glyph("search")}<input type="text" role="combobox" aria-expanded=${this.open} aria-autocomplete="list" .value=${this.open ? this.query : this.value} placeholder=${this.placeholder} ?disabled=${this.disabled} aria-invalid=${this.error ? "true" : nothing} @focus=${() => {
        this.open = true;
        this.query = "";
        this.active = 0;
      }} @input=${(e: Event) => {
        this.query = (e.target as HTMLInputElement).value;
        this.open = true;
        this.active = 0;
        this.requestUpdate();
      }} @keydown=${this.onKey} @blur=${() =>
        setTimeout(() => {
          this.open = false;
        }, 150)} part="input">
        ${
          this.value && !this.open
            ? html`<button class="x" aria-label="Clear" @mousedown=${(e: Event) => e.preventDefault()} @click=${() => this.choose("")}>${glyph("x")}</button>`
            : html`<button class="open" aria-label="Open menu" tabindex="-1" @mousedown=${(e: Event) => e.preventDefault()} @click=${() => {
                this.open = !this.open;
              }}>${glyph("chev-d")}</button>`
        }
      </div>
      ${this.open ? html`<ul class="menu combobox-list" role="listbox">${m.length ? m.map((o, i) => html`<li role="option" aria-selected=${i === this.active || o === this.value} @mousedown=${(e: Event) => e.preventDefault()} @click=${() => this.choose(o)}>${o}</li>`) : html`<li class="empty">No ${this.noun} match “${this.query}”</li>`}</ul>` : nothing}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-combobox": AcmeCombobox;
  }
}
