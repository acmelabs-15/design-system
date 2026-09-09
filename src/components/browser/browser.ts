import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, glyph, sharedCss } from "../../base.js";
import { buttonCss } from "../button/button.styles.js";
import { browserCss } from "./browser.styles.js";

/** Geist Browser: screenshot chrome, decorative. */
@customElement("acme-browser")
export class AcmeBrowser extends AcmeElement {
  static styles = [sharedCss, browserCss, buttonCss, css`:host{display:block}`];
  @property() address = "";
  render() {
    return html`<div class="browser" aria-hidden="true" part="browser"><div class="browser-bar"><span class="lights"><i></i><i></i><i></i></span><span class="address"><span>${this.address}</span><button class="iconbtn" tabindex="-1" aria-label="Copy URL">${glyph("copy")}</button></span></div><div class="browser-body"><slot></slot></div></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-browser": AcmeBrowser;
  }
}
