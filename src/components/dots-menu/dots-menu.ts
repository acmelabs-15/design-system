import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, glyph, sharedCss } from "../../base.js";
import { buttonCss } from "../button/button.styles.js";

/** Geist Dots Menu: a 32px ghost icon trigger for a Menu. */
@customElement("acme-dots-menu")
export class AcmeDotsMenu extends AcmeElement {
  static styles = [sharedCss, buttonCss, css`:host{display:inline-block}`];
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property() label = "Menu";
  render() {
    return html`<acme-menu align="end"><button slot="trigger" class="iconbtn sm quiet" aria-label=${this.label} aria-haspopup="true" ?disabled=${this.disabled}>${glyph("dots")}</button><slot slot="items"></slot></acme-menu>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-dots-menu": AcmeDotsMenu;
  }
}
