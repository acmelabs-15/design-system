import { html } from "lit";
import { property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { atomState } from "../../shared/atom-state";
import type { ButtonSize, ButtonVariant } from "../../shared/action-element";
import { splitButtonStructureCss } from "../../generated/components/split-button/split-button-structure.styles";
/** A primary action attached to a menu of related actions.
 * @slot - Primary action label.
 * @slot start - Leading primary content.
 * @slot end - Trailing primary content.
 * @slot items - Split Button Items.
 * @csspart root - The attached Group.
 * @csspart primary - Primary Button.
 * @csspart trigger - Menu Trigger.
 * @csspart menu - Menu surface.
 * @fires {CustomEvent<{action:"primary"}|{action:"select";value:string}>} acme-request - A primary or menu action is requested.
 * @fires {CustomEvent<{open:boolean;reason:string}>} acme-open-change - The menu's user visibility change.
 */
export class AcmeSplitButton extends AcmeElement {
  static styles = [sharedCss, splitButtonStructureCss];
  @atomState() @property({ noAccessor: true }) size: ButtonSize = "medium";
  @atomState() @property({ noAccessor: true }) variant: ButtonVariant = "default";
  @atomState() @property({ noAccessor: true, type: Boolean, reflect: true }) disabled = false;
  @atomState() @property({ noAccessor: true, type: Boolean, reflect: true }) loading = false;
  @atomState() @property({ noAccessor: true, type: Boolean, reflect: true }) open = false;
  @atomState() @property({ noAccessor: true, attribute: "menu-label" }) menuLabel = "";
  protected willUpdate() {
    if ((this.disabled || this.loading) && this.open) this.open = false;
  }
  private primary = (event: MouseEvent) => {
    if (!event.defaultPrevented && !this.disabled && !this.loading) this.dispatchEvent(new CustomEvent("acme-request", { bubbles: true, composed: true, detail: { action: "primary" } }));
  };
  private changed = (event: CustomEvent<{ open: boolean; reason: string }>) => {
    event.stopPropagation();
    this.open = event.detail.open;
    this.dispatchEvent(new CustomEvent("acme-open-change", { bubbles: true, composed: true, detail: event.detail }));
  };
  render() {
    return html`<acme-group attached .size=${this.size} .variant=${this.variant} part="root"><acme-button .disabled=${this.disabled} .loading=${this.loading} @click=${this.primary} part="primary"><slot name="start" slot="start"></slot><slot></slot><slot name="end" slot="end"></slot></acme-button><acme-menu .open=${this.open} @acme-open-change=${this.changed}><acme-menu-trigger slot="trigger" .disabled=${this.disabled || this.loading || !this.menuLabel} aria-label=${this.menuLabel} shape="square" part="trigger"><acme-expand-more-icon size="16px"></acme-expand-more-icon></acme-menu-trigger><acme-menu-content aria-label=${this.menuLabel} part="menu"><slot name="items"></slot></acme-menu-content></acme-menu></acme-group>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-split-button": AcmeSplitButton;
  }
}
