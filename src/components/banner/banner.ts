import { html } from "lit";
import { customElement } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base.js";
import { buttonCss } from "../button/button.styles.js";
import { bannerCss } from "./banner.styles.js";

/** Geist Banner: a full-width message with a pill button. */
@customElement("acme-banner")
export class AcmeBanner extends AcmeElement {
  static styles = [sharedCss, bannerCss, buttonCss];
  render() {
    return html`<div class="site-banner" part="banner"><span><slot></slot></span><slot name="action"></slot></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-banner": AcmeBanner;
  }
}
