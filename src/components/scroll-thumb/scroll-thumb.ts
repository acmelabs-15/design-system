import { ContextConsumer } from "@lit/context";
import { createAtom } from "@tanstack/lit-store";
import { html } from "lit";
import { AcmeElement, sharedCss } from "../../base";
import { StoreSelector } from "../../shared/store-connection";
import { scrollbarContext, type ScrollbarState } from "../../shared/scroll-area-context";
import { scrollGeometry } from "../../shared/scroll-geometry";
import { scrollThumbCss } from "../../generated/components/scroll-thumb/scroll-thumb.styles";
/** Pointer-operated thumb; keyboard scrolling belongs to the viewport.
 * @slot - Optional decorative thumb content.
 * @csspart thumb - The thumb surface.
 */
export class AcmeScrollThumb extends AcmeElement {
  static styles = [sharedCss, scrollThumbCss];
  private readonly context = new ContextConsumer(this, { context: scrollbarContext, subscribe: true, callback: () => this.requestUpdate() });
  private readonly empty = createAtom<ScrollbarState>({ axis: "vertical", geometry: scrollGeometry(0, 0, 0, 0) });
  private readonly updates = new StoreSelector(this, () => this.context.value ?? this.empty);
  protected updated() {
    const state = this.context.value?.get() ?? this.empty.get();
    this.setAttribute("data-axis", state.axis);
    this.style.setProperty("--_scroll-thumb-size", `${state.geometry.thumb}px`);
    this.style.setProperty("--_scroll-thumb-offset", `${state.geometry.offset}px`);
  }
  render() {
    return html`<div part="thumb" aria-hidden="true"><slot></slot></div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-scroll-thumb": AcmeScrollThumb;
  }
}
