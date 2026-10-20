import { html, nothing } from "lit";
import { AcmeNumberInputAction } from "../../shared/number-input-action";
/** Increases the nearest Number Input value.
 * @slot - Replaces the increment icon.
 * @csspart root - The native increment button.
 */
export class AcmeNumberInputIncrement extends AcmeNumberInputAction {
  protected get direction() {
    return 1 as const;
  }
  protected renderContent() {
    const custom = this.places.has("");
    return html`<span class="label" part="icon"><slot ?hidden=${!custom} @slotchange=${this.places.read}></slot>${custom ? nothing : html`<acme-add-icon></acme-add-icon>`}</span>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-number-input-increment": AcmeNumberInputIncrement;
  }
}
