import { html } from "lit";
import { property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { atomState } from "../../shared/atom-state";
import { optionalString } from "../../shared/attributes";
import { ResponsiveStyleRenderer } from "../../shared/style-renderer";
import { responsiveStyleDelivery } from "../../generated/responsive-styles";
import { iconTileCss } from "../../generated/components/icon-tile/icon-tile.styles";
import { iconTileStructureCss } from "../../generated/components/icon-tile/icon-tile-structure.styles";

/** A presentation container around author-owned icon content.
 * @slot - The icon content, which retains its own accessible meaning.
 * @csspart root - The tile surface.
 */
export class AcmeIconTile extends AcmeElement {
  static styles = [sharedCss, iconTileCss, iconTileStructureCss];
  @atomState() @property({ noAccessor: true, converter: optionalString }) size?: string;
  private readonly dimensions = new ResponsiveStyleRenderer(this, responsiveStyleDelivery, {
    root: () => (this.renderRoot?.nodeType === 11 ? (this.renderRoot as ShadowRoot) : undefined),
    state: () => ({
      inputs:
        this.size === undefined
          ? []
          : [
              ["width", this.size],
              ["height", this.size],
            ],
    }),
  });
  adoptedCallback() {
    super.adoptedCallback();
    this.dimensions.adopted();
  }
  render() {
    return html`<div class="tile" part="root"><slot></slot></div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-icon-tile": AcmeIconTile;
  }
}
