import { html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { AcmeButton } from "../button/button";
import { atomState } from "../../shared/atom-state";
import { actionContent } from "../../shared/action-content";
/** A button-shaped menu trigger with an optional end indicator.
 * @slot - Trigger label.
 * @slot start - Leading content.
 * @slot end - Trailing content.
 */
export class AcmeMenuButton extends AcmeButton {
  @atomState() @property({ type: Boolean, noAccessor: true, attribute: "show-chevron" }) showChevron = false;
  @atomState() @property({ type: Boolean, noAccessor: true, reflect: true }) open = false;
  protected renderContent() {
    return actionContent({
      loading: this.loading,
      size: this.size,
      start: this.places.has("start"),
      end: this.places.has("end"),
      trailing: this.showChevron ? html`<acme-expand-more-icon size="16px" data-open=${this.open ? "true" : nothing}></acme-expand-more-icon>` : undefined,
    });
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-menu-button": AcmeMenuButton;
  }
}
