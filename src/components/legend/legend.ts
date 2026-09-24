import { html } from "lit";
import { property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { legendSurfaceCss } from "../../generated/shared/legend-surface.styles";
import { atomState } from "../../shared/atom-state";
/** Passive series labels; applications compose selection controls when needed.
 * @slot - Legend Item content.
 * @csspart root - Legend arrangement.
 */
export class AcmeLegend extends AcmeElement {
  static styles = [sharedCss, legendSurfaceCss];
  @atomState() private axis: "horizontal" | "vertical" = "horizontal";
  /** @default "horizontal" */
  @property({ noAccessor: true, useDefault: true }) get orientation() {
    return this.axis;
  }
  set orientation(value: "horizontal" | "vertical") {
    if (value !== "horizontal" && value !== "vertical") throw new TypeError("Invalid Legend orientation");
    const previous = this.axis;
    this.axis = value;
    this.requestUpdate("orientation", previous);
  }
  render() {
    return html`<div part="root" data-kind="legend" data-orientation=${this.orientation}><slot></slot></div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-legend": AcmeLegend;
  }
}
