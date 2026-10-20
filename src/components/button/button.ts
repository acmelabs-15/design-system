import { AcmeFormActionElement } from "../../shared/form-action-element";
import { actionContent } from "../../shared/action-content";

export type { ButtonSize, ButtonVariant } from "../../shared/action-element";
/** A native action or navigation control.
 * @slot - The action label.
 * @slot start - Leading content.
 * @slot end - Trailing content.
 * @csspart root - The native button or anchor.
 * @csspart label - The label container.
 * @csspart start - Leading content.
 * @csspart end - Trailing content.
 * @csspart spinner - The loading indicator.
 */
export class AcmeButton extends AcmeFormActionElement {
  protected renderContent() {
    return actionContent({ loading: this.loading, size: this.size, start: this.places.has("start"), end: this.places.has("end") });
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-button": AcmeButton;
  }
}
