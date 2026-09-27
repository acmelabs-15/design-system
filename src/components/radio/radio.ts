import { html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { AcmeSelectionControl } from "../../shared/selection-control";
import { RadioPeers } from "../../shared/radio-peers";
import { toolbarKeyboardOwner } from "../../shared/keyboard-delegation";
import { message } from "../../shared/messages";
import { radioStructureCss } from "../../generated/components/radio/radio-structure.styles";
/** One native radio choice, standalone or owned by a Radio Group.
 * @slot - The visible label.
 * @slot description - Supporting text.
 * @csspart root - The label hit surface.
 * @csspart control - The native radio.
 * @csspart indicator - The selected mark.
 * @csspart label - The visible label.
 * @csspart description - Supporting text.
 * @fires {CustomEvent<{value:string}>} acme-change - The user selected this standalone radio.
 */
export class AcmeRadio extends AcmeSelectionControl {
  static styles = [...AcmeSelectionControl.styles, radioStructureCss];
  protected get selectionKind() {
    return "radio" as const;
  }
  protected get initialValue() {
    return "";
  }
  private readonly peers = new RadioPeers({
    host: this,
    member: this.selectionMember,
    name: () => this.name,
    form: () => this.form,
    checked: () => this.checked,
    setChecked: (value) => {
      this.checked = value;
    },
    required: () => this.required,
    grouped: () => !!this.selection.owner,
    sync: () => this.nativeForm.sync(),
  });
  /** Required nonempty choice value.
   * @default ""
   */
  @property({ noAccessor: true }) get value() {
    return super.value;
  }
  set value(value: string) {
    super.value = value;
  }
  protected stateChanged() {
    this.peers?.reconcile();
  }
  protected membershipChanged() {
    this.peers?.reconcile();
  }
  protected controlSynchronized() {
    this.input.name = this.name;
    this.input.required = false;
    if (!this.selection?.owner && this.peers?.required) {
      this.input.setAttribute("aria-required", "true");
    } else {
      this.input.removeAttribute("aria-required");
    }
    if (!this.selection?.owner && !toolbarKeyboardOwner(this)) {
      this.input.tabIndex = this.peers?.tabIndex() ?? 0;
    }
  }
  protected validateControl() {
    if (!this.value) {
      return { flags: { customError: true }, message: message(this.themeContext.scope.effective.get().locale, "radio.value", "Each radio needs a nonempty value.") };
    }
    return this.peers?.validation() ?? super.validateControl();
  }
  protected emitUserChange() {
    this.dispatchEvent(new CustomEvent<{ value: string }>("acme-change", { detail: { value: this.value }, bubbles: true, composed: true }));
  }
  formAssociatedCallback() {
    super.formAssociatedCallback();
    this.peers?.reconcile();
  }
  protected renderIndicator() {
    return nothing;
  }
  protected renderControl() {
    return html`<span class="control">${this.input}<span class="indicator" part="indicator" aria-hidden="true"></span></span>`;
  }
  render() {
    return html`<label class="selection-label" part="root" data-size=${this.size} ?data-checked=${this.checked} ?data-disabled=${this.effectiveDisabled}>${this.renderControl()}<span class="content"><span part="label" ?hidden=${!this.places.has("")}><slot></slot></span><span part="description" ?hidden=${!this.places.has("description")}><slot name="description"></slot></span></span>${this.pressEffect.render()}</label>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-radio": AcmeRadio;
  }
}
