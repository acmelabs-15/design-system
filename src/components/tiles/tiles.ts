import { tilesStructureCss } from "../../generated/components/tiles/tiles-structure.styles";
import { html } from "lit";
import { customElement } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { tileCss } from "../../generated/components/tile/tile.styles";

/** House tiles: small figures in a tinted box. */
@customElement("acme-tiles")
export class AcmeTiles extends AcmeElement {
  static styles = [
    sharedCss,
    tileCss,
    tilesStructureCss,
  ];
  render() {
    return html`<div class="tiles"><slot></slot></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-tiles": AcmeTiles;
  }
}
