import { html } from "lit";
import { actionContent } from "../../shared/action-content";
import { AcmeActionElement } from "../../shared/action-element";
import { SidebarBinding } from "../../shared/sidebar-context";
/** Named control for desktop expansion and mobile Drawer visibility.
 * @acmeDefault variant "secondary"
 * @slot - Required action label.
 */
export class AcmeSidebarTrigger extends AcmeActionElement {
  private readonly binding = new SidebarBinding(this, "trigger", () => this.control);
  protected get fallbackAppearance() {
    return { variant: "secondary" };
  }
  private get unavailable() {
    const state = this.binding?.current?.view.get();
    return !state || (!state.mobile && !state.collapsible);
  }
  protected get effectiveDisabled() {
    return super.effectiveDisabled || this.unavailable;
  }
  protected get submission() {
    return { ...super.submission, disabled: super.submission.disabled || this.unavailable };
  }
  protected get semanticDefaults() {
    return { ...super.semanticDefaults, ...(this.binding?.current ? { controlsElements: [this.binding.current.host] } : {}) };
  }
  protected semanticUpdated() {
    this.synchronizeControl();
  }
  protected synchronizeControl() {
    super.synchronizeControl();
    if (!this.control) return;
    const state = this.binding?.current?.view.get();
    if (this.control.localName === "button") (this.control as HTMLButtonElement).disabled = this.effectiveDisabled;
    this.control.setAttribute("aria-expanded", String(state?.mobile ? state.mobileOpen : state?.expanded || !state?.collapsible));
    if (state?.mobile) this.control.setAttribute("aria-haspopup", "dialog");
    else this.control.removeAttribute("aria-haspopup");
  }
  protected activate() {
    this.binding.current?.toggle(this.control);
  }
  protected renderContent() {
    return actionContent({ loading: this.loading, size: this.size, start: this.places.has("start"), end: this.places.has("end"), label: html`<slot></slot>` });
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-sidebar-trigger": AcmeSidebarTrigger;
  }
}
