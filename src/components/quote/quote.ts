import { html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { AcmeSizedTypographyElement } from "../../shared/typography-element";
import { atomState } from "../../shared/atom-state";
import { optionalString } from "../../shared/attributes";
import { quoteStructureCss } from "../../generated/components/quote/quote-structure.styles";
/** An inline quotation or a block quotation with an optional native citation URL.
 * @slot - Author-owned quotation content.
 * @csspart root - The native quotation element.
 */
export class AcmeQuote extends AcmeSizedTypographyElement {
  static styles = [...AcmeSizedTypographyElement.styles, quoteStructureCss];
  @atomState()
  @property({ noAccessor: true, reflect: true, useDefault: true })
  as: "q" | "blockquote" = "q";
  @atomState()
  @property({ noAccessor: true, converter: optionalString })
  cite?: string;
  protected get inlineTypography() {
    return this.as !== "blockquote";
  }
  render() {
    return this.as === "blockquote" ? html`<blockquote part="root" cite=${this.cite ?? nothing}><slot></slot></blockquote>` : html`<q part="root" cite=${this.cite ?? nothing}><slot></slot></q>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-quote": AcmeQuote;
  }
}
