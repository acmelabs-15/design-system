import { html, type PropertyValues } from "lit";
import { property } from "lit/decorators.js";
import { AcmeActionElement } from "../../shared/action-element";
import { actionContent } from "../../shared/action-content";
import { atomState } from "../../shared/atom-state";
import { message, messageCatalogs } from "../../shared/messages";
import { StoreSelector } from "../../shared/store-connection";
import { SpringValue } from "../../shared/spring-value";
import { readMotionSpring } from "../../shared/motion-spring";
import { showMoreStructureCss } from "../../generated/components/show-more/show-more-structure.styles";
/** A disclosure action. The application connects its expanded state to content.
 * @acmeDefault variant "secondary"
 * @acmeDefault size "small"
 * @slot - Action label, with a localized More/Less fallback.
 * @slot start - Leading content.
 * @slot end - Trailing content in place of the chevron.
 * @fires {CustomEvent<{expanded:boolean}>} acme-expanded-change - A user changes expansion.
 */
export class AcmeShowMore extends AcmeActionElement {
  static styles = [...AcmeActionElement.styles, showMoreStructureCss];
  @atomState() @property({ noAccessor: true, type: Boolean, reflect: true }) expanded = false;
  private readonly localeUpdates = new StoreSelector(this, () => this.themeContext.scope.effective);
  private readonly messageUpdates = new StoreSelector(this, () => messageCatalogs);
  private readonly rotation = new SpringValue(
    this,
    () => (this.expanded ? 180 : 0),
    () => readMotionSpring(this, "standard", "spatial", "fast"),
  );
  protected get fallbackAppearance() {
    return { size: "small", variant: "secondary" };
  }
  protected synchronizeControl() {
    super.synchronizeControl();
    this.control?.setAttribute("aria-expanded", String(this.expanded));
  }
  protected semanticUpdated() {
    this.synchronizeControl();
  }
  protected willUpdate() {
    super.willUpdate();
    this.rotation.update();
  }
  protected updated(changed: PropertyValues) {
    super.updated(changed);
    this.renderRoot.querySelector<HTMLElement>(".chevron")?.style.setProperty("--_show-more-rotation", `${this.rotation.value}deg`);
  }
  protected activate() {
    this.expanded = !this.expanded;
    this.dispatchEvent(new CustomEvent("acme-expanded-change", { detail: Object.freeze({ expanded: this.expanded }), bubbles: true, composed: true }));
  }
  protected renderContent() {
    const locale = this.themeContext.scope.effective.get().locale;
    const label = this.expanded ? message(locale, "showMore.less", "Show Less") : message(locale, "showMore.more", "Show More");
    return actionContent({
      loading: this.loading,
      size: this.size,
      start: this.places.has("start"),
      end: this.places.has("end"),
      label: html`<slot>${label}</slot>`,
      trailing: html`<span class="chevron" aria-hidden="true"><acme-expand-more-icon size="16px"></acme-expand-more-icon></span>`,
    });
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-show-more": AcmeShowMore;
  }
}
