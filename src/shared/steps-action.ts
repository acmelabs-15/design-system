import { html } from "lit";
import { AcmeActionElement } from "./action-element";
import { actionContent } from "./action-content";
import { StepsBinding } from "./steps-context";
import { message, messageCatalogs } from "./messages";
import { StoreSelector } from "./store-connection";
import { deepActiveElement } from "./composed-tree";
/** Shared action lifetime for relative step movement.
 * @acmeDefault variant "secondary"
 */
export abstract class AcmeStepsAction extends AcmeActionElement {
  private readonly binding: StepsBinding;
  constructor(protected readonly direction: "previous" | "next") {
    super();
    this.binding = new StepsBinding(this, { kind: direction, value: () => "", disabled: () => this.disabled, target: () => this.control });
  }
  private readonly localeUpdates = new StoreSelector(this, () => this.themeContext.scope.effective);
  private readonly messageUpdates = new StoreSelector(this, () => messageCatalogs);
  protected get fallbackAppearance() {
    return { variant: "secondary" };
  }
  private get unavailable() {
    return !this.binding?.current?.canMove(this.binding.record);
  }
  protected get submission() {
    return { ...super.submission, disabled: super.submission.disabled || this.unavailable };
  }
  protected get effectiveDisabled() {
    return super.effectiveDisabled || this.unavailable;
  }
  protected synchronizeControl() {
    if (this.control && this.unavailable && deepActiveElement(this.ownerDocument) === this.control) this.binding?.current?.recover();
    super.synchronizeControl();
    if (this.control?.localName === "button") (this.control as HTMLButtonElement).disabled = this.disabled || this.nativeAction.fieldsetDisabled || this.unavailable;
  }
  protected activate() {
    this.binding.current?.move(this.binding.record);
  }
  protected renderContent() {
    return actionContent({
      loading: this.loading,
      size: this.size,
      start: this.places.has("start"),
      end: this.places.has("end"),
      label: html`<slot>${message(this.themeContext.scope.effective.get().locale, "steps." + this.direction, this.direction === "next" ? "Next" : "Previous")}</slot>`,
    });
  }
}
