import { html } from "lit";
import { AcmeActionElement } from "./action-element";
import { actionContent } from "./action-content";
import { DialogBinding, type DialogPart } from "./dialog-context";
import { message, messageCatalogs } from "./messages";
import { StoreSelector } from "./store-connection";
/** Native action behavior shared by dialog triggers and explicit close controls. */
export abstract class AcmeDialogAction extends AcmeActionElement {
  private readonly binding: DialogBinding;
  constructor(private readonly kind: DialogPart["kind"]) {
    super();
    this.binding = new DialogBinding(this, kind, () => this.control);
  }
  private readonly localeUpdates = new StoreSelector(this, () => this.themeContext.scope.effective);
  private readonly messageUpdates = new StoreSelector(this, () => messageCatalogs);
  protected get fallbackAppearance() {
    return { variant: "secondary" };
  }
  private get unavailable() {
    return !this.binding?.current || (this.kind !== "trigger" && !this.binding.current.state.get().open);
  }
  protected get submission() {
    return { ...super.submission, disabled: super.submission.disabled || this.unavailable };
  }
  protected get effectiveDisabled() {
    return super.effectiveDisabled || this.unavailable;
  }
  protected get semanticDefaults() {
    return { ...super.semanticDefaults, ...(this.kind === "trigger" && this.binding?.current ? { controlsElements: [this.binding.current.host] } : {}) };
  }
  protected semanticUpdated() {
    this.synchronizeControl();
  }
  protected synchronizeControl() {
    super.synchronizeControl();
    if (!this.control) return;
    if (this.control.localName === "button") (this.control as HTMLButtonElement).disabled = this.disabled || this.nativeAction.fieldsetDisabled || this.unavailable;
    if (this.kind === "trigger") {
      this.control.setAttribute("aria-haspopup", "dialog");
      this.control.setAttribute("aria-expanded", String(!!this.binding?.current?.state.get().open));
    }
  }
  protected activate() {
    const owner = this.binding.current;
    if (owner) owner.request(this.kind === "trigger" ? !owner.state.get().open : false, this.kind === "trigger" ? "trigger" : "close-control", this.kind === "trigger" ? this.control : undefined);
  }
  protected renderContent() {
    const label =
      this.kind === "trigger" ? html`<slot></slot>` : html`<slot>${message(this.themeContext.scope.effective.get().locale, "dialog." + this.kind, this.kind === "cancel" ? "Cancel" : "Close")}</slot>`;
    return actionContent({ loading: this.loading, size: this.size, start: this.places.has("start"), end: this.places.has("end"), label });
  }
}
