import { css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, glyph, sharedCss } from "../../base.js";
import { kbdCss } from "../kbd/kbd.styles.js";
import { menuCss } from "../menu/menu.styles.js";

/** One row of a Menu; `href` makes a link, `danger` for the destructive group, `locked` for a permission gate. */
@customElement("acme-menu-item")
export class AcmeMenuItem extends AcmeElement {
  static styles = [
    sharedCss,
    menuCss,
    kbdCss,
    css`:host{display:block} .menu{position:static;display:block;padding:0;box-shadow:none;background:transparent;min-width:0;border-radius:0} .end{margin-left:auto;display:inline-flex;align-items:center;gap:4px;color:var(--text-2)}`,
  ];
  @property() href = "";
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean }) danger = false;
  @property({ type: Boolean }) locked = false;
  @property() shortcut = "";
  focus() {
    (this.shadowRoot?.querySelector("button, a") as HTMLElement)?.focus();
  }
  private select() {
    if (this.disabled || this.locked) return;
    this.dispatchEvent(new CustomEvent("acme-select", { bubbles: true, composed: true }));
  }
  render() {
    const inner = html`<slot name="prefix"></slot><slot></slot><span class="end"><slot name="suffix"></slot>${this.shortcut ? html`<kbd class="kbd sm">${this.shortcut}</kbd>` : nothing}${this.locked ? glyph("lock") : nothing}</span>`;
    return html`<div class="menu">${this.href && !this.disabled ? html`<a role="menuitem" href=${this.href} tabindex="-1" @click=${this.select}>${inner}</a>` : html`<button role="menuitem" class=${this.cls("", { danger: this.danger })} tabindex="-1" ?disabled=${this.disabled || this.locked} aria-disabled=${this.locked ? "true" : nothing} @click=${this.select}>${inner}</button>`}</div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-menu-item": AcmeMenuItem;
  }
}
