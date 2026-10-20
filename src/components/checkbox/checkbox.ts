import { html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { atomState } from "../../shared/atom-state";
import { AcmeSelectionControl } from "../../shared/selection-control";
import { checkboxStructureCss } from "../../generated/components/checkbox/checkbox-structure.styles";
/** A native checkbox with one canonical checked state and an independent reset target.
 * @slot - The visible label.
 * @slot description - Supporting text.
 * @csspart root - The label hit surface.
 * @csspart control - The native checkbox.
 * @csspart indicator - The checked or mixed mark.
 * @csspart label - The visible label.
 * @csspart description - Supporting text.
 * @fires {CustomEvent<{checked:boolean;indeterminate:false}>} acme-change - A user changes the checked state.
 */
export class AcmeCheckbox extends AcmeSelectionControl {
  static styles = [...AcmeSelectionControl.styles, checkboxStructureCss];
  @atomState() @property({ noAccessor: true, type: Boolean }) invalid = false;
  @atomState() private mixed = false;
  protected get invalidState() {
    return this.invalid;
  }
  protected get mixedState() {
    return this.mixed;
  }
  protected clearMixedState() {
    this.mixed = false;
  }
  /** @default false */
  @property({ noAccessor: true, type: Boolean }) get indeterminate() {
    return this.mixed;
  }
  set indeterminate(value: boolean) {
    const previous = this.mixed;
    this.mixed = Boolean(value);
    this.nativeForm?.sync();
    this.requestUpdate("indeterminate", previous);
  }
  protected emitUserChange() {
    this.dispatchEvent(new CustomEvent<{ checked: boolean; indeterminate: false }>("acme-change", { detail: { checked: this.checked, indeterminate: false }, bubbles: true, composed: true }));
  }
  protected renderIndicator() {
    return this.indeterminate ? html`<acme-remove-icon></acme-remove-icon>` : this.checked ? html`<acme-check-icon></acme-check-icon>` : nothing;
  }
  protected renderControl() {
    return html`<span class="control">${this.input}<span class="indicator" part="indicator" aria-hidden="true">${this.renderIndicator()}</span></span>`;
  }
  render() {
    return html`<label class="selection-label" part="root" data-size=${this.size} ?data-checked=${this.checked} ?data-indeterminate=${this.indeterminate} ?data-disabled=${this.effectiveDisabled} ?data-invalid=${this.effectiveInvalid}>${this.renderControl()}<span class="content"><span part="label" ?hidden=${!this.places.has("")}><slot></slot></span><span part="description" ?hidden=${!this.places.has("description")}><slot name="description"></slot></span></span>${this.pressEffect.render()}</label>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-checkbox": AcmeCheckbox;
  }
}
