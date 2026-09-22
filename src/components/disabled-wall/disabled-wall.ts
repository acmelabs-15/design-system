import { disabledWallStructureCss } from "../../generated/components/disabled-wall/disabled-wall-structure.styles";
import { html } from "lit";

import { AcmeElement, sharedCss } from "../../base";
import { disabledWallCss } from "../../generated/components/disabled-wall/disabled-wall.styles";

/**
 * Disabled wall: an empty overlay that covers its positioned container, shows the not-allowed
 * cursor and blocks text selection. Place it last inside a `position: relative` box.
 */

export class AcmeDisabledWall extends AcmeElement {
  static styles = [sharedCss, disabledWallCss, disabledWallStructureCss];
  render() {
    return html`<div class="wall" aria-hidden="true" part="wall"></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-disabled-wall": AcmeDisabledWall;
  }
}
