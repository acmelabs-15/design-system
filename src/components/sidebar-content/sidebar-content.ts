import { html } from "lit";
import { AcmeElement, sharedCss } from "../../base";
import { sidebarContentCss } from "../../generated/components/sidebar-content/sidebar-content.styles";
import { SidebarBinding } from "../../shared/sidebar-context";
/** Preserves full and compact content while Sidebar changes presentation.
 * @slot - Full navigation content.
 * @slot collapsed - Optional compact content for the collapsed desktop rail.
 * @csspart root - Content container.
 * @csspart content - Full content.
 * @csspart collapsed - Compact content.
 */
export class AcmeSidebarContent extends AcmeElement {
  static styles = [sharedCss, sidebarContentCss];
  private readonly binding = new SidebarBinding(this, "content", () => this.renderRoot?.querySelector<HTMLElement>("[part=root]") ?? undefined);
  render() {
    const state = this.binding.current?.view.get();
    const collapsed = !!state && !state.mobile && state.collapsible && !state.expanded;
    return html`<div part="root"><div part="content" ?hidden=${collapsed} ?inert=${collapsed}><slot></slot></div><div part="collapsed" ?hidden=${!collapsed} ?inert=${!collapsed}><slot name="collapsed"></slot></div></div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-sidebar-content": AcmeSidebarContent;
  }
}
