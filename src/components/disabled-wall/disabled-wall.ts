import { css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { disabledWallCss } from "./disabled-wall.styles";

/**
 * Disabled wall: an empty overlay that covers its positioned container, shows the not-allowed
 * cursor and blocks text selection. Place it last inside a `position: relative` box; disabled
 * fieldset content renders one of its own.
 */
@customElement("acme-disabled-wall")
export class AcmeDisabledWall extends AcmeElement {
  static styles = [
    sharedCss,
    disabledWallCss,
    css`
      :host {
        display: block;
      }
    `,
  ];
  render() {
    return html`<div class="wall" aria-hidden="true" part="wall"></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-disabled-wall": AcmeDisabledWall;
  }
}
