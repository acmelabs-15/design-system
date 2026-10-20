import { html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { boolish } from "../../base";
import { atomState } from "../../shared/atom-state";
import { AcmeSingleLineControl } from "../../shared/single-line-control";
/** A native password field with a labelled visibility action.
 * @slot start - Content inside the field start.
 * @slot end - Content inside the field end.
 * @slot start-addon - Attached start content.
 * @slot end-addon - Attached end content.
 * @csspart root - The field surface.
 * @csspart input - The native password input.
 * @csspart reveal - The visibility action.
 * @fires {CustomEvent<{value:string}>} acme-input - A live value edit.
 * @fires {CustomEvent<{value:string}>} acme-change - A committed value edit.
 * @fires {CustomEvent<{visible:boolean}>} acme-visible-change - The user changes password visibility.
 */
export class AcmePasswordInput extends AcmeSingleLineControl {
  @atomState() private revealed = false;
  /** @default false */
  @property({ noAccessor: true, type: Boolean }) get visible() {
    return this.revealed ?? false;
  }
  set visible(value: boolean) {
    const input = this.control as HTMLInputElement;
    const start = input?.selectionStart,
      end = input?.selectionEnd,
      direction = input?.selectionDirection;
    this.revealed = Boolean(value);
    this.nativeForm?.sync();
    if (start != null && end != null) {
      input.setSelectionRange(start, end, direction ?? undefined);
    }
    this.requestUpdate("visible");
  }
  @atomState() @property({ noAccessor: true, converter: boolish }) revealable = true;
  protected get inputType() {
    return this.visible ? "text" : "password";
  }
  private reveal = () => {
    if (this.nativeForm.effectiveDisabled) {
      return;
    }
    this.visible = !this.visible;
    this.focus({ preventScroll: true });
    this.dispatchEvent(new CustomEvent("acme-visible-change", { detail: { visible: this.visible }, bubbles: true, composed: true }));
  };
  protected trailing() {
    return this.revealable
      ? html`<acme-icon-button part="reveal" variant="tertiary" size=${this.size === "small" ? "tiny" : "small"} .disabled=${this.nativeForm.effectiveDisabled} aria-label=${this.text(this.visible ? "password.hide" : "password.show", this.visible ? "Hide password" : "Show password")} @click=${this.reveal}>${this.visible ? html`<acme-visibility-off-icon></acme-visibility-off-icon>` : html`<acme-visibility-icon></acme-visibility-icon>`}</acme-icon-button>`
      : nothing;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-password-input": AcmePasswordInput;
  }
}
