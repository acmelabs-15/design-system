import { html } from "lit";
import { property } from "lit/decorators.js";
import { AcmeSizedTypographyElement } from "../../shared/typography-element";
import { atomState } from "../../shared/atom-state";
import { textStructureCss } from "../../generated/components/text/text-structure.styles";
/** Body text with paragraph semantics by default.
 * @slot - Author-owned text and inline content.
 * @csspart root - The native text element.
 */
export class AcmeText extends AcmeSizedTypographyElement {
  static styles = [...AcmeSizedTypographyElement.styles, textStructureCss];
  @atomState()
  @property({ noAccessor: true, reflect: true, useDefault: true })
  as: "p" | "span" | "div" = "p";
  protected get inlineTypography() {
    return this.as === "span";
  }
  render() {
    switch (this.as) {
      case "span":
        return html`<span part="root"><slot></slot></span>`;
      case "div":
        return html`<div part="root"><slot></slot></div>`;
      default:
        return html`<p part="root"><slot></slot></p>`;
    }
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-text": AcmeText;
  }
}
