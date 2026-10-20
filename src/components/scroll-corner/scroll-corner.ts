import { html } from "lit";
import { AcmeElement, sharedCss } from "../../base";
import { ScrollPartBinding } from "../../shared/scroll-area-context";
import { scrollCornerCss } from "../../generated/components/scroll-corner/scroll-corner.styles";
/** Fills the intersection of two visible overflow axes.
 * @csspart corner - Decorative corner surface.
 */
export class AcmeScrollCorner extends AcmeElement {
  static styles = [sharedCss, scrollCornerCss];
  private readonly binding = new ScrollPartBinding(this, { kind: "corner", element: () => this.renderRoot?.querySelector<HTMLElement>("[part=corner]") ?? undefined });
  protected updated() {
    const state = this.binding.current?.state.get();
    this.toggleAttribute("data-inactive", !state?.x.overflow || !state.y.overflow || state.orientation !== "both");
  }
  render() {
    return html`<div part="corner" aria-hidden="true"></div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-scroll-corner": AcmeScrollCorner;
  }
}
