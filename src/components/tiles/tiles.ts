import { css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base.js";
import { tileCss } from "../tile/tile.styles.js";

/** House tiles: small figures in a tinted box. */
@customElement("acme-tiles")
export class AcmeTiles extends AcmeElement {
  static styles = [sharedCss, tileCss, css`:host{display:block} .tiles{grid-template-columns:repeat(auto-fit,minmax(var(--tile-min,104px),1fr))}`];
  render() {
    return html`<div class="tiles"><slot></slot></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-tiles": AcmeTiles;
  }
}
