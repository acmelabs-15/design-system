import { css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { sharedCss } from "../../base.js";
import { Overlay } from "../../shared/overlay.js";
import { buttonCss } from "../button/button.styles.js";
import { drawerCss } from "./drawer.styles.js";

/** Geist Drawer: a bottom sheet for small viewports; swipe or tap outside to dismiss. */
@customElement("acme-drawer")
export class AcmeDrawer extends Overlay {
  static styles = [
    sharedCss,
    drawerCss,
    buttonCss,
    css`dialog{padding:0;border:0;background:transparent;max-width:none;max-height:none;overflow:visible;color:var(--text);inset:0;width:100vw;height:100dvh;margin:0} dialog::backdrop{background:var(--scrim-dark)} :host([static]) dialog{position:static;display:block;width:auto;height:auto} :host([static]) .drawer{position:static;max-height:none}`,
  ];
  @property() heading = "";
  @property({ type: Number }) height = 0;
  @property({ type: Boolean, reflect: true }) static = false;
  private y0 = 0;
  render() {
    return html`<dialog @cancel=${this.onCancel} @click=${this.backdropClick} aria-labelledby="t" ?open=${this.static}>
      <div class="drawer" style=${this.height ? `height:${this.height}px` : nothing} @touchstart=${(e: TouchEvent) => {
        this.y0 = e.touches[0].clientY;
      }} @touchend=${(e: TouchEvent) => {
        if (e.changedTouches[0].clientY - this.y0 > 60 && !this.noDismiss) this.close();
      }} part="drawer">
        ${this.heading ? html`<p class="title" id="t">${this.heading}</p>` : nothing}<div class="body"><slot></slot></div><slot name="actions"></slot>
      </div></dialog>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-drawer": AcmeDrawer;
  }
}
