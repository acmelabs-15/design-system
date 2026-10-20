import { separatorStructureCss } from "../../generated/components/separator/separator-structure.styles";
import { html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { AcmeElement, boolish, sharedCss } from "../../base";
import { atomState } from "../../shared/atom-state";
import { separatorCss } from "../../generated/components/separator/separator.styles";

/**
 * A decorative line by default. Set decorative to false for a semantic separator.
 * @csspart root - The line.
 * @cssprop --acme-separator-color - Line color; defaults to the theme gray-200 color.
 * @cssprop --acme-separator-width - Line thickness; defaults to 1px.
 */

export class AcmeSeparator extends AcmeElement {
  static styles = [sharedCss, separatorCss, separatorStructureCss];
  /** horizontal · vertical. */
  @atomState()
  @property({ reflect: true, noAccessor: true, useDefault: true })
  orientation: "horizontal" | "vertical" = "horizontal";
  /** False exposes separator semantics. In HTML, use decorative="false". */
  @atomState()
  @property({ type: Boolean, converter: boolish, noAccessor: true, useDefault: true })
  decorative = true;
  render() {
    const vertical = this.orientation === "vertical";
    return html`<div class=${this.cls("separator", { vertical })} role=${this.decorative ? nothing : "separator"} aria-hidden=${this.decorative ? "true" : nothing} aria-orientation=${this.decorative ? nothing : vertical ? "vertical" : "horizontal"} part="root"></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-separator": AcmeSeparator;
  }
}
