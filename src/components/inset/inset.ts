import { property } from "lit/decorators.js";
import { boolish } from "../../base";
import { AcmeLayoutElement } from "../../shared/layout-element";
import { atomState } from "../../shared/atom-state";
import { insetStructureCss } from "../../generated/components/inset/inset-structure.styles";
/** Extends content through the nearest participating surface's padding.
 * @slot - Author-owned media or content.
 * @csspart root - The content wrapper.
 */
export class AcmeInset extends AcmeLayoutElement {
  static styles = [...AcmeLayoutElement.styles, insetStructureCss];
  @atomState() @property({ noAccessor: true, reflect: true, useDefault: true }) side: "all" | "inline" | "block" | "inline-start" | "inline-end" | "block-start" | "block-end" = "all";
  @atomState() @property({ noAccessor: true, reflect: true, converter: boolish }) clip = true;
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-inset": AcmeInset;
  }
}
