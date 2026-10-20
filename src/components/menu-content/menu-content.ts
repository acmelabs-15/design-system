import { html } from "lit";
import { sharedCss } from "../../base";
import { menuContentStructureCss } from "../../generated/components/menu-content/menu-content-structure.styles";
import { MenuConnection } from "../../shared/menu-context";
import { AcmeSemanticElement } from "../../shared/semantic-element";
/** The native popup surface of a menu.
 * @slot - Items, sections, and separators.
 * @csspart root - The semantic menu.
 */
export class AcmeMenuContent extends AcmeSemanticElement {
  static styles = [sharedCss, menuContentStructureCss];
  private readonly menu = new MenuConnection(this, "content");
  connectedCallback() {
    this.popover = "manual";
    super.connectedCallback();
  }
  protected get semanticDefaults() {
    const trigger = this.menu?.owner?.triggerElement;
    return { role: "menu", labelledByElements: trigger ? [trigger] : undefined };
  }
  focus(options?: FocusOptions) {
    this.semanticTarget?.focus(options);
  }
  constructor() {
    super();
    this.addEventListener("focusout", () => this.menu.owner?.focusLeft());
  }
  render() {
    return html`<acme-overlay-theme density="normal" .source=${this.themeContext.scope.effective} .reference=${this}><div part="root" tabindex="-1" @keydown=${(event: KeyboardEvent) => this.menu.owner?.key(event)}><slot></slot></div></acme-overlay-theme>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-menu-content": AcmeMenuContent;
  }
}
