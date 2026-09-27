import { html } from "lit";
import { AcmeSizedTypographyElement } from "../../shared/typography-element";
import { strongStructureCss } from "../../generated/components/strong/strong-structure.styles";
/** Semantic importance for inline content.
 * @slot - Author-owned inline content.
 * @csspart root - The native strong element.
 */
export class AcmeStrong extends AcmeSizedTypographyElement {
  static styles = [...AcmeSizedTypographyElement.styles, strongStructureCss];
  render() {
    return html`<strong part="root"><slot></slot></strong>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-strong": AcmeStrong;
  }
}
