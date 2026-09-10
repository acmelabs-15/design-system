import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { iconTileCss } from "./icon-tile.styles";

/**
 * Icon tile: the bordered 8px-radius tile around an empty state's icon (the `icon` slot of
 * `acme-empty-state`). A centred flex box with 10px padding, the gray-alpha-400 border and gray-900
 * text; the slotted icon sets its own size (32px in an empty state). `size` fixes the tile's width
 * and height (a number is pixels).
 */
@customElement("acme-icon-tile")
export class AcmeIconTile extends AcmeElement {
  static styles = [sharedCss, iconTileCss];
  /** Width and height of the tile: a number in pixels, or any CSS length. Unset, the tile wraps its icon. */
  @property() size = "";

  render() {
    const size = this.size && (/^\d+(\.\d+)?$/.test(this.size) ? `${this.size}px` : this.size);
    return html`<div class="tile" aria-hidden="true" style=${size ? `width:${size};height:${size}` : nothing} part="tile"><slot></slot></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-icon-tile": AcmeIconTile;
  }
}
