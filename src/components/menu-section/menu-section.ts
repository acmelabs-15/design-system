import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base.js";
import { menuCss } from "../menu/menu.styles.js";

/** A section heading inside a Menu. */
@customElement("acme-menu-section")
export class AcmeMenuSection extends AcmeElement {
  static styles = [sharedCss, menuCss, css`:host{display:block} .menu{position:static;display:block;padding:0;box-shadow:none;background:transparent;min-width:0}`];
  @property() heading = "";
  render() {
    return html`<div class="menu"><div class="head">${this.heading}</div><slot></slot></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-menu-section": AcmeMenuSection;
  }
}
