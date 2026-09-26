import { html, nothing, svg } from "lit";
import { property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../base";
import { atomState } from "./atom-state";
import { StoreSelector } from "./store-connection";
import { iconDefaults, type IconArtwork, type IconFamily } from "./icon-artwork";
import { optionalString } from "./attributes";
import { ResponsiveStyleRenderer } from "./style-renderer";
import { responsiveStyleDelivery } from "../generated/responsive-styles";
import { iconCss } from "../generated/shared/icon.styles";
import { message, messageCatalogs } from "./messages";

/** Shared presentation for named SVG elements. Artwork identity belongs to the element class.
 * @csspart root - The native SVG, or an explicit missing-artwork marker.
 */
export abstract class AcmeIconElement extends AcmeElement {
  static styles = [sharedCss, iconCss];
  protected abstract get artwork(): IconArtwork;
  @atomState() @property({ noAccessor: true, converter: optionalString }) family?: IconFamily;
  @atomState() @property({ noAccessor: true, converter: { fromAttribute: (value: string | null) => (value === null ? undefined : value !== "false") } }) filled?: boolean;
  @atomState() @property({ noAccessor: true, converter: optionalString }) size?: string;
  @atomState() @property({ noAccessor: true, converter: optionalString }) label?: string;
  private readonly configuration = new StoreSelector(this, () => iconDefaults);
  private readonly assets = new StoreSelector(this, () => this.artwork.available);
  private readonly labels = new StoreSelector(this, () => messageCatalogs);
  private readonly locale = new StoreSelector(this, () => this.themeContext.scope.effective);
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
  private missing?: string;
  adoptedCallback() {
    super.adoptedCallback();
    this.dimensions.adopted();
  }
  render() {
    const defaults = iconDefaults.get(),
      family = this.family ?? defaults.family,
      filled = this.filled ?? defaults.filled,
      geometry = this.artwork.get(family, filled);
    if (!geometry) {
      const key = `${family}:${filled}`;
      if (this.missing !== key) {
        console.warn(this.localName, { code: "missing-icon-artwork", symbol: this.artwork.name, family, filled });
      }
      this.missing = key;
      return html`<span class="missing" part="root" role="img" aria-label=${`${message(this.themeContext.scope.effective.get().locale, "icon.unavailable", "Artwork unavailable")}: ${this.label || this.artwork.name}`}>?</span>`;
    }
    this.missing = undefined;
    return html`<svg part="root" viewBox=${geometry.viewBox} aria-hidden=${this.label ? nothing : "true"} role=${this.label ? "img" : nothing} aria-label=${this.label || nothing} focusable="false">${geometry.paths.map((path) => svg`<path d=${path.d} fill-rule=${path.fillRule ?? nothing}></path>`)}</svg>`;
  }
}
