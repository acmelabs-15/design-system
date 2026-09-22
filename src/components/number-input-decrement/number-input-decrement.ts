import { html, nothing } from "lit";
import { AcmeNumberInputAction } from "../../shared/number-input-action";
/** Decreases the nearest Number Input value.
 * @slot - Replaces the decrement icon.
 * @csspart root - The native decrement button.
 */
export class AcmeNumberInputDecrement extends AcmeNumberInputAction {
  protected get direction() {
    return -1 as const;
  }
  protected renderContent() {
    const custom = this.places.has("");
    return html`<span class="label" part="icon"><slot ?hidden=${!custom} @slotchange=${this.places.read}></slot>${custom ? nothing : html`<acme-remove-icon></acme-remove-icon>`}</span>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-number-input-decrement": AcmeNumberInputDecrement;
  }
}
