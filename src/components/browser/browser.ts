import { css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { AcmeElement, glyphSized, paths, sharedCss } from "../../base";
import { toasts } from "../../shared/state";
import { browserCss } from "./browser.styles";
import { browserCopyCss } from "./browser-copy.styles";
import "../button/button";

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
/** The reload control, a 24-box stroke path like the house glyphs. */
const RELOAD = "M21 12a9 9 0 1 1-2.64-6.36M21 3v6h-6";
/** A navigation control: a 14px glyph in gray-900. */
const control = (d: string) =>
  html`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" style="color:var(--ds-gray-900)" aria-hidden="true"><path d=${d}></path></svg>`;

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
@customElement("acme-browser")
export class AcmeBrowser extends AcmeElement {
  static styles = [
    sharedCss,
    browserCss,
    browserCopyCss,
    css`
      :host {
        display: block;
      }
    `,
  ];
  /** The URL the address bar shows and the copy button copies. */
  @property() address = "";
  @state() private copied = false;
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
            <div class="controls">${control(paths.back)}${control(paths.arrow)}${control(RELOAD)}</div>
          </div>
          <div class="section">
            <div class="address" part="address">
              <div class="text">${formatAddress(this.address)}</div>
              <acme-button variant="tertiary" size="tiny" shape="square" svg-only aria-label=${this.copied ? "Copied" : "Copy"} @click=${this.copy} part="button">
                <div class=${this.cls("stack", { copied: this.copied })}>
                  <div class="check">${glyphSized("check", 12)}</div>
                  <div class="copy">${glyphSized("copy", 12)}</div>
                </div>
              </acme-button>
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
