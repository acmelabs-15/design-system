import { html } from "lit";
import { AcmeSemanticElement } from "../../shared/semantic-element";
import { sharedCss } from "../../base";
import { ScrollPartBinding } from "../../shared/scroll-area-context";
import { scrollViewportCss } from "../../generated/components/scroll-viewport/scroll-viewport.styles";
/** The native scrolling element and author-owned content.
 * @slot - Content with application-owned layout and optional virtualization.
 * @csspart viewport - Native scroll container.
 * @csspart content - Intrinsic content measurement box.
 */
export class AcmeScrollViewport extends AcmeSemanticElement {
  static styles = [sharedCss, scrollViewportCss];
  private readonly binding = new ScrollPartBinding(this, {
    kind: "viewport",
    element: () => this.getViewport(),
    content: () => this.renderRoot?.querySelector<HTMLElement>("[part=content]") ?? undefined,
  });
  getViewport(): HTMLElement | undefined {
    return this.renderRoot?.querySelector<HTMLElement>("[part~=viewport]") ?? undefined;
  }
  focus(options?: FocusOptions) {
    this.getViewport()?.focus(options);
  }
  protected get semanticDefaults() {
    return { role: this.ariaLabel || this.ariaLabelledByElements?.length ? "region" : undefined };
  }
  render() {
    const state = this.binding.current?.state.get(),
      overflow = state && ((state.orientation !== "vertical" && state.x.overflow) || (state.orientation !== "horizontal" && state.y.overflow));
    return html`<div part="root viewport" tabindex=${overflow ? 0 : -1} data-orientation=${state?.orientation ?? "both"}><div part="content"><slot @slotchange=${() => this.binding.current?.refresh()}></slot></div></div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-scroll-viewport": AcmeScrollViewport;
  }
}
