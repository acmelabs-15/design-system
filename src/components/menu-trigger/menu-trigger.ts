import { AcmeActionElement } from "../../shared/action-element";
import { actionContent } from "../../shared/action-content";
import { MenuConnection } from "../../shared/menu-context";
/** A native button that opens its owning menu.
 * @slot - Trigger label.
 * @slot start - Leading content.
 * @slot end - Trailing content.
 */
export class AcmeMenuTrigger extends AcmeActionElement {
  private readonly menu = new MenuConnection(this, "trigger");
  protected get semanticDefaults() {
    const content = this.menu?.owner?.contentElement;
    return { ...super.semanticDefaults, controlsElements: content ? [content] : undefined };
  }
  protected activate() {
    this.menu.owner?.toggle();
  }
  constructor() {
    super();
    this.addEventListener("keydown", (event) => {
      if (event.defaultPrevented || event.isComposing || this.effectiveDisabled) {
        return;
      }
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        this.menu.owner?.openFromTrigger(event.key === "ArrowUp" ? "last" : "first");
      }
    });
  }
  protected synchronizeControl() {
    super.synchronizeControl();
    this.control?.setAttribute("aria-haspopup", "menu");
    this.control?.setAttribute("aria-expanded", String(this.menu?.owner?.state.get().open ?? false));
  }
  protected renderContent() {
    return actionContent({ loading: this.loading, size: this.size, start: this.places.has("start"), end: this.places.has("end") });
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-menu-trigger": AcmeMenuTrigger;
  }
}
