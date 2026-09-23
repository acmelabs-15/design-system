import { html } from "lit";
import { property } from "lit/decorators.js";
import { sharedCss } from "../../base";
import { AcmeSemanticElement } from "../../shared/semantic-element";
import { atomState } from "../../shared/atom-state";
import { itemStructureCss } from "../../generated/components/item/item-structure.styles";
/** Arranges descriptive content and independent actions without owning interaction.
 * @slot - Item media, content, metadata and actions.
 * @csspart root - The content arrangement.
 */
export class AcmeItem extends AcmeSemanticElement {
  static styles = [sharedCss, itemStructureCss];
  @atomState() @property({ noAccessor: true, reflect: true, useDefault: true }) variant: "default" | "outline" | "muted" = "default";
  @atomState() @property({ noAccessor: true, reflect: true, useDefault: true }) size: "small" | "medium" | "large" = "medium";
  @atomState() @property({ noAccessor: true, reflect: true, useDefault: true }) orientation: "horizontal" | "vertical" = "horizontal";
  render() {
    return html`<div part="root"><slot></slot></div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-item": AcmeItem;
  }
}
