import { browserStructureCss } from "../../generated/components/browser/browser-structure.styles";
import { html } from "lit";
import { property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { toasts } from "../../shared/state";
import { browserCss } from "../../generated/components/browser/browser.styles";
import { browserCopyCss } from "../../generated/components/browser/browser-copy.styles";

import { atomState } from "../../shared/atom-state";

/** The address as the bar shows it: no scheme, no `www.`, no trailing slash. */
export const formatAddress = (address: string) =>
  address
    ? address
        .replace(/^https?:\/\//, "")
        .replace(/^www\./, "")
        .replace(/\/$/, "")
    : "";

/** The check stays in the copy button for this long after a copy. */
const COPIED_MS = 1000;
/**
 * Browser frame. A small-material box, rounded in proportion to its own width from the md
 * breakpoint, with a header over the slotted content. The header holds three sections: the
 * traffic-light dots with the back, forward and reload controls (the controls hide below md); the
 * address bar, a pill that shows `address` without its scheme, `www.` and trailing slash, with a
 * copy button (a tertiary, tiny, square icon button) that writes the full address to the
 * clipboard, is named "Copied" and shows a check for one second after a copy, and raises an error
 * toast when the copy fails; and an empty spacer that appears from lg. The chrome takes the page
 * theme. The frame is decorative: set `aria-hidden="true"` on the element and describe the
 * screenshot inside it.
 */

export class AcmeBrowser extends AcmeElement {
  static styles = [sharedCss, browserCss, browserCopyCss, browserStructureCss];
  /** The URL the address bar shows and the copy button copies. */
  @property() address = "";
  @atomState() private copied = false;
  private timer?: ReturnType<typeof setTimeout>;

  disconnectedCallback() {
    super.disconnectedCallback();
    clearTimeout(this.timer);
  }

  private copy = async () => {
    clearTimeout(this.timer);
    try {
      await navigator.clipboard.writeText(this.address);
      this.copied = true;
      this.timer = setTimeout(() => {
        this.copied = false;
      }, COPIED_MS);
    } catch {
      toasts.error("Failed to copy to clipboard");
    }
  };

  render() {
    return html`<div style="container-type:inline-size">
      <div class="frame" part="frame">
        <div class="header" part="header">
          <div class="section">
            <div class="dots"><div class="dot-close"></div><div class="dot-min"></div><div class="dot-zoom"></div></div>
            <div class="controls"><acme-arrow-back-icon size="14px"></acme-arrow-back-icon><acme-arrow-forward-icon size="14px"></acme-arrow-forward-icon><acme-refresh-icon size="14px"></acme-refresh-icon></div>
          </div>
          <div class="section">
            <div class="address" part="address">
              <div class="text">${formatAddress(this.address)}</div>
              <acme-icon-button variant="tertiary" size="tiny" shape="square" aria-label=${this.copied ? "Copied" : "Copy"} @click=${this.copy} part="button">
                <div class=${this.cls("stack", { copied: this.copied })}>
                  <div class="check">${html`<acme-check-icon size="12px"></acme-check-icon>`}</div>
                  <div class="copy">${html`<acme-content-copy-icon size="12px"></acme-content-copy-icon>`}</div>
                </div>
              </acme-icon-button>
            </div>
          </div>
          <div class="spacer"></div>
        </div>
        <slot></slot>
      </div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-browser": AcmeBrowser;
  }
}
