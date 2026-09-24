import { html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { atomState } from "../../shared/atom-state";
import { optionalString } from "../../shared/attributes";
import { browserCss } from "../../generated/components/browser/browser.styles";
import { browserStructureCss } from "../../generated/components/browser/browser-structure.styles";
const displayAddress = (address: string) =>
  address
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/$/, "");
/** Decorative browser chrome around author-owned preview content.
 * @slot - Preview content, including native interactive descendants when required.
 * @csspart root - Complete frame.
 * @csspart chrome - Decorative browser header.
 * @csspart address - Escaped display address.
 * @csspart content - Preview content container.
 */
export class AcmeBrowser extends AcmeElement {
  static styles = [sharedCss, browserCss, browserStructureCss];
  @atomState() @property({ noAccessor: true, useDefault: true }) address = "";
  @atomState() @property({ noAccessor: true, converter: optionalString }) label?: string;
  render() {
    return html`<div class="container"><div class="frame" part="root" role=${this.label ? "group" : nothing} aria-label=${this.label || nothing}><div class="header" part="chrome"><div class="section" aria-hidden="true"><div class="dots"><div class="dot-close"></div><div class="dot-min"></div><div class="dot-zoom"></div></div><div class="controls"><acme-arrow-back-icon size="14px"></acme-arrow-back-icon><acme-arrow-forward-icon size="14px"></acme-arrow-forward-icon><acme-refresh-icon size="14px"></acme-refresh-icon></div></div><div class="section"><div class="address" part="address"><div class="text">${displayAddress(this.address)}</div></div></div><div class="spacer" aria-hidden="true"></div></div><div part="content"><slot></slot></div></div></div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-browser": AcmeBrowser;
  }
}
