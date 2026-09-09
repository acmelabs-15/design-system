import { css, html } from "lit";
import { customElement, property, queryAssignedElements } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base.js";
import type { AcmeMenuItem } from "../menu-item/menu-item.js";
import { menuCss } from "./menu.styles.js";

/** Geist Menu: opens from the default-slot trigger; items are acme-menu-item. Closes on activation, Escape, outside click. */
@customElement("acme-menu")
export class AcmeMenu extends AcmeElement {
  static styles = [
    sharedCss,
    menuCss,
    css`:host{display:inline-block;position:relative} .menu{display:none;top:calc(100% + 10px)} :host([open]) .menu{display:block} :host([align="end"]) .menu{right:0} :host([static]) .menu{display:block;position:static}`,
  ];
  @property({ type: Boolean, reflect: true }) open = false;
  @property({ reflect: true }) align: "start" | "end" = "start";
  @property({ type: Number }) width = 200;
  @property({ type: Boolean, reflect: true }) static = false;
  @queryAssignedElements({ slot: "items", selector: "acme-menu-item" }) items!: AcmeMenuItem[];
  private onDoc = (e: Event) => {
    if (!this.contains(e.target as Node) && !e.composedPath().includes(this)) this.open = false;
  };
  connectedCallback() {
    super.connectedCallback();
    document.addEventListener("click", this.onDoc);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("click", this.onDoc);
  }
  private onKey(e: KeyboardEvent) {
    const items = this.items.filter((i) => !i.disabled);
    if (!items.length) return;
    const i = items.findIndex((x) => x.matches(":focus-within"));
    if (e.key === "ArrowDown") items[(i + 1) % items.length].focus();
    else if (e.key === "ArrowUp") items[(i - 1 + items.length) % items.length].focus();
    else if (e.key === "Home") items[0].focus();
    else if (e.key === "End") items[items.length - 1].focus();
    else if (e.key === "Escape") {
      this.open = false;
      (this.querySelector("[slot=trigger], :not([slot])") as HTMLElement)?.focus();
    } else {
      const ch = e.key.toLowerCase();
      const next = items
        .slice(i + 1)
        .concat(items.slice(0, i + 1))
        .find((x) => x.textContent?.trim().toLowerCase().startsWith(ch));
      next?.focus();
      return;
    }
    e.preventDefault();
  }
  updated(ch: Map<string, unknown>) {
    if (ch.has("open") && this.open) requestAnimationFrame(() => this.items.find((i) => !i.disabled)?.focus());
  }
  render() {
    return html`<span @click=${() => {
      this.open = !this.open;
    }} @keydown=${(e: KeyboardEvent) => {
      if (e.key === "ArrowDown" && !this.open) {
        this.open = true;
        e.preventDefault();
      }
    }}><slot name="trigger"><slot></slot></slot></span>
      <div class="menu" role="menu" style=${`min-width:${this.width}px`} @keydown=${this.onKey} @acme-select=${() => {
        this.open = false;
      }} part="menu"><slot name="items"></slot></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-menu": AcmeMenu;
  }
}
