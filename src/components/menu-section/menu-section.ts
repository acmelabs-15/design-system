import { html } from "lit";
import { property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { atomState } from "../../shared/atom-state";
import { menuSectionStructureCss } from "../../generated/components/menu-section/menu-section-structure.styles";
let sequence = 0;
/** A named group within a menu.
 * @slot - Menu items.
 * @csspart root - The semantic group.
 * @csspart heading - The group label.
 */
export class AcmeMenuSection extends AcmeElement {
  static styles = [sharedCss, menuSectionStructureCss];
  @atomState() @property({ noAccessor: true }) heading = "";
  private readonly uid = `acme-menu-section-${++sequence}`;
  render() {
    return html`<div role="group" part="root" aria-labelledby=${this.uid}><div class="heading" part="heading" id=${this.uid}>${this.heading}</div><slot></slot></div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-menu-section": AcmeMenuSection;
  }
}
