import { html } from "lit";
import { property } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { AcmeElement, sharedCss } from "../../base";
import { legendSurfaceCss } from "../../generated/shared/legend-surface.styles";
import { atomState } from "../../shared/atom-state";
import { optionalString } from "../../shared/attributes";
/** One application-defined series identity and label. Native hidden controls visibility.
 * @attr {boolean} hidden - Native visibility; absent by default.
 * @slot - Authored label or independent controls.
 * @csspart item - Label layout.
 * @csspart swatch - Decorative color marker.
 * @csspart label - Readable series label.
 */
export class AcmeLegendItem extends AcmeElement {
  static styles = [sharedCss, legendSurfaceCss];
  @atomState() @property({ noAccessor: true, useDefault: true }) value = "";
  @atomState() @property({ noAccessor: true, useDefault: true }) label = "";
  @atomState() private paint?: string;
  @property({ noAccessor: true, converter: optionalString }) get color() {
    return this.paint;
  }
  set color(value: string | undefined) {
    if (value !== undefined && (typeof value !== "string" || !value.trim() || (this.ownerDocument.defaultView?.CSS && !this.ownerDocument.defaultView.CSS.supports("color", value)))) {
      throw new TypeError("Legend color requires a CSS color");
    }
    const previous = this.paint;
    this.paint = value;
    this.requestUpdate("color", previous);
  }
  render() {
    return html`<span part="item" data-kind="item"><span part="swatch" aria-hidden="true" style=${styleMap({ background: this.color ?? null })}></span><span part="label"><slot>${this.label}</slot></span></span>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-legend-item": AcmeLegendItem;
  }
}
