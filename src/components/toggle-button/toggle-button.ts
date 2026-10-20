import { property } from "lit/decorators.js";
import { AcmeActionElement } from "../../shared/action-element";
import { actionContent } from "../../shared/action-content";
import { atomState } from "../../shared/atom-state";
/** A persistent on/off action with native button activation.
 * @slot - The visible label.
 * @slot start - Leading content.
 * @slot end - Trailing content.
 * @csspart root - The native button.
 * @csspart label - The label container.
 * @csspart start - Leading content.
 * @csspart end - Trailing content.
 * @csspart spinner - The loading indicator.
 * @fires {CustomEvent<{pressed:boolean}>} acme-change - A user toggled the action.
 */
export class AcmeToggleButton extends AcmeActionElement {
  @atomState() private selected = false;
  /** @default false */
  @property({ type: Boolean, noAccessor: true, reflect: true }) get pressed() {
    return this.selected;
  }
  set pressed(value: boolean) {
    const previous = this.selected;
    this.selected = Boolean(value);
    this.control?.setAttribute("aria-pressed", String(this.selected));
    this.requestUpdate("pressed", previous);
  }
  protected get emphasized() {
    return this.pressed;
  }
  protected synchronizeControl() {
    super.synchronizeControl();
    this.control?.setAttribute("aria-pressed", String(this.pressed));
  }
  protected activate() {
    this.pressed = !this.pressed;
    this.dispatchEvent(new CustomEvent("acme-change", { detail: { pressed: this.pressed }, bubbles: true, composed: true }));
  }
  protected renderContent() {
    return actionContent({ loading: this.loading, size: this.size, start: this.places.has("start"), end: this.places.has("end") });
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-toggle-button": AcmeToggleButton;
  }
}
