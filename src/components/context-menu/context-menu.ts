import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base.js";
import { menuCss } from "../menu/menu.styles.js";

/** Geist Context Menu: the Menu at the pointer on right click or long press over the default-slot target. */
@customElement("acme-context-menu")
export class AcmeContextMenu extends AcmeElement {
  static styles = [sharedCss, menuCss, css`:host{display:block;position:relative} .menu{display:none;position:fixed} :host([open]) .menu{display:block}`];
  @property({ type: Boolean, reflect: true }) open = false;
  private x = 0;
  private y = 0;
  private t = 0;
  private onDoc = () => {
    this.open = false;
  };
  connectedCallback() {
    super.connectedCallback();
    document.addEventListener("click", this.onDoc);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.open = false;
    });
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("click", this.onDoc);
  }
  private openAt(x: number, y: number) {
    this.x = Math.min(x, innerWidth - 220);
    this.y = Math.min(y, innerHeight - 200);
    this.open = true;
  }
  render() {
    return html`<div @contextmenu=${(e: MouseEvent) => {
      e.preventDefault();
      this.openAt(e.clientX, e.clientY);
    }} @touchstart=${(e: TouchEvent) => {
      this.t = window.setTimeout(() => this.openAt(e.touches[0].clientX, e.touches[0].clientY), 500);
    }} @touchend=${() => clearTimeout(this.t)} @keydown=${(e: KeyboardEvent) => {
      if (e.key === "ContextMenu" || (e.shiftKey && e.key === "F10")) {
        const r = this.getBoundingClientRect();
        this.openAt(r.left + 8, r.top + 8);
        e.preventDefault();
      }
    }} tabindex="0"><slot></slot></div>
      <div class="menu" role="menu" style=${`left:${this.x}px;top:${this.y}px;min-width:160px`} @acme-select=${() => {
        this.open = false;
      }}><slot name="items"></slot></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-context-menu": AcmeContextMenu;
  }
}
