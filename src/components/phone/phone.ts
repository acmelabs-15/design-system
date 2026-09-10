import { css, html, nothing, svg } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, boolish, paths, sharedCss } from "../../base";
import { formatAddress } from "../browser/browser";
import { phoneCss } from "./phone.styles";

/** A navigation-bar glyph: a 24-box stroke path sized by the bar's own rules (5cqw square). */
const key = (d: string) =>
  svg`<svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d=${d}></path></svg>`;

/**
 * Phone frame. A device shell sized by its container (rounded by container width, padded 2.5%)
 * around a 9:19.5 screen that shows the slotted content on a gray canvas. The shell carries the
 * island at the top of the screen (`notch`, on by default), the home indicator at the bottom, and
 * the four side keys (mute, volume up and down on the left, power on the right). With an
 * `address`, a dark gradient shades the foot of the screen and a navigation bar sits over it: a
 * back key, an address pill that shows the address without its scheme, `www.` and trailing
 * slash, and a more key. `variant` picks the shell: `dark` (black, default) or `light` (gray-100
 * with a gray outline) for a light surrounding page. The frame is decorative: set
 * `aria-hidden="true"` on the element and describe the screenshot inside it.
 */
@customElement("acme-phone")
export class AcmePhone extends AcmeElement {
  static styles = [
    sharedCss,
    phoneCss,
    css`
      :host {
        display: block;
      }
    `,
  ];
  /** The URL the navigation bar shows; without one the bar and the gradient stay out. */
  @property() address = "";
  /** The island at the top of the screen; `notch="false"` leaves it out. */
  @property({ converter: boolish }) notch = true;
  /** The shell: `dark` (black) or `light` (gray-100 with a gray outline). */
  @property() variant: "dark" | "light" = "dark";

  render() {
    return html`<div style="container-type:inline-size">
      <div class=${this.cls("frame", { light: this.variant === "light" })} part="frame">
        <div class="screen" part="screen">
          <div class="content"><slot></slot></div>
          ${this.address ? html`<div class="shade"></div>` : nothing}
        </div>
        ${this.notch ? html`<div class="island"></div>` : nothing}
        <div class="home"></div>
        ${
          this.address
            ? html`<div class="bar" part="bar">
              <div class="back">${key(paths["chev-l"])}</div>
              <div class="address" part="address"><span class="text">${formatAddress(this.address)}</span></div>
              <div class="more">${key(paths.dots)}</div>
            </div>`
            : nothing
        }
        <div class="mute"></div>
        <div class="vol-up"></div>
        <div class="vol-down"></div>
        <div class="power"></div>
      </div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-phone": AcmePhone;
  }
}
