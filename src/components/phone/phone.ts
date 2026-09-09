import { css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, glyph, sharedCss } from "../../base.js";
import { phoneCss } from "./phone.styles.js";

/** Geist Phone: device chrome, decorative. */
@customElement("acme-phone")
export class AcmePhone extends AcmeElement {
  static styles = [sharedCss, phoneCss, css`:host{display:inline-block}`];
  @property() address = "";
  @property({ type: Boolean }) light = false;
  render() {
    return html`<div class=${this.cls("phone", { light: this.light })} aria-hidden="true" part="phone"><div class="screen"><span class="island"></span><slot></slot>${this.address ? html`<span class="address">${glyph("globe", "ic")}${this.address}</span>` : nothing}<span class="home"></span></div></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-phone": AcmePhone;
  }
}
