import { css, html, nothing } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { AcmeElement, glyph, sharedCss } from "../../base.js";
import { kbdCss } from "../kbd/kbd.styles.js";
import { commandMenuCss } from "./command-menu.styles.js";

/** Geist Command Menu: the ⌘K palette. Pass `groups` or slot acme-command-item elements; `hotkey` binds the shortcut. */
export type CommandItem = { label: string; value?: string; icon?: string; suffix?: string; onSelect?: () => void };

export type CommandGroup = { heading?: string; items: CommandItem[] };

@customElement("acme-command-menu")
export class AcmeCommandMenu extends AcmeElement {
  static styles = [
    sharedCss,
    commandMenuCss,
    kbdCss,
    css`:host{display:block} dialog{padding:0;border:0;background:transparent;max-width:none;max-height:none;overflow:visible;color:var(--text);inset:0;width:100vw;height:100dvh;margin:0} dialog::backdrop{background:var(--scrim)} .cmdk{position:absolute;top:108px;left:50%;transform:translateX(-50%)} :host([static]) dialog{position:static;display:block;width:auto;height:auto} :host([static]) .cmdk{position:static;transform:none;width:100%}`,
  ];
  @property({ type: Boolean, reflect: true }) open = false;
  @property({ type: Boolean, reflect: true }) static = false;
  @property() placeholder = "What do you need?";
  @property({ type: Boolean }) hotkey = true;
  @property({ type: Array }) groups: CommandGroup[] = [];
  @query("dialog") dialog!: HTMLDialogElement;
  @query("input") input!: HTMLInputElement;
  private q = "";
  private active = 0;
  private onKeyDoc = (e: KeyboardEvent) => {
    if (this.hotkey && (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      this.open = !this.open;
    }
  };
  connectedCallback() {
    super.connectedCallback();
    document.addEventListener("keydown", this.onKeyDoc);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("keydown", this.onKeyDoc);
  }
  updated(ch: Map<string, unknown>) {
    if (!ch.has("open") || !this.dialog || this.static) return;
    if (this.open) {
      if (!this.dialog.open) this.dialog.showModal();
      this.q = "";
      this.active = 0;
      requestAnimationFrame(() => this.input?.focus());
    } else if (this.dialog.open) this.dialog.close();
  }
  private get visible() {
    const q = this.q.toLowerCase();
    return this.groups.map((g) => ({ ...g, items: g.items.filter((i) => i.label.toLowerCase().includes(q)) })).filter((g) => g.items.length);
  }
  private flat() {
    return this.visible.flatMap((g) => g.items);
  }
  private choose(i: CommandItem) {
    i.onSelect?.();
    this.dispatchEvent(new CustomEvent("acme-select", { detail: { value: i.value ?? i.label, item: i }, bubbles: true, composed: true }));
    this.open = false;
  }
  private onKey(e: KeyboardEvent) {
    const f = this.flat();
    if (e.key === "ArrowDown") {
      this.active = Math.min(this.active + 1, f.length - 1);
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      this.active = Math.max(this.active - 1, 0);
      e.preventDefault();
    } else if (e.key === "Enter" && f[this.active]) {
      this.choose(f[this.active]);
    } else if (e.key === "Escape") {
      this.open = false;
    }
    this.requestUpdate();
  }
  render() {
    let n = -1;
    const f = this.flat();
    return html`<dialog @cancel=${(e: Event) => {
      e.preventDefault();
      this.open = false;
    }} @click=${(e: MouseEvent) => {
      if (e.target === this.dialog) this.open = false;
    }} ?open=${this.static} aria-label="Command Menu">
      <div class="cmdk" part="cmdk">
        <div class="cmdk-input"><input type="text" role="combobox" aria-expanded="true" aria-autocomplete="list" placeholder=${this.placeholder} .value=${this.q} @input=${(e: Event) => {
          this.q = (e.target as HTMLInputElement).value;
          this.active = 0;
          this.requestUpdate();
        }} @keydown=${this.onKey}><kbd class="kbd sm">Esc</kbd></div>
        <div class="cmdk-list" role="listbox" aria-live="polite">
          ${this.visible.map(
            (g) =>
              html`${g.heading ? html`<div class="cmdk-group">${g.heading}</div>` : nothing}${g.items.map((i) => {
                n++;
                const idx = n;
                return html`<div role="option" aria-selected=${idx === this.active} @mouseenter=${() => {
                  this.active = idx;
                  this.requestUpdate();
                }} @click=${() => this.choose(i)}>${i.icon ? glyph(i.icon) : nothing}${i.label}${i.suffix ? html`<span class="end">${i.suffix}</span>` : nothing}</div>`;
              })}`,
          )}
          ${f.length ? nothing : html`<div class="cmdk-group">No results for “${this.q}”</div>`}
        </div>
        <slot name="footer"></slot>
      </div></dialog>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-command-menu": AcmeCommandMenu;
  }
}
