import { nativeScrollLeft, physicalScrollLeft } from "../../shared/scroll-geometry";
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
  private key = (event: KeyboardEvent) => {
    const viewport = this.getViewport();
    if (!viewport || event.composedPath()[0] !== viewport || event.altKey || event.ctrlKey || event.metaKey) {
      return;
    }
    const orientation = this.binding.current?.state.get().orientation ?? "both";
    const rtl = this.ownerDocument.defaultView!.getComputedStyle(viewport).direction === "rtl";
    const maxX = Math.max(0, viewport.scrollWidth - viewport.clientWidth),
      maxY = Math.max(0, viewport.scrollHeight - viewport.clientHeight);
    const fromX = physicalScrollLeft(viewport.scrollLeft, maxX, rtl),
      fromY = viewport.scrollTop;
    let x = fromX,
      y = fromY;
    switch (event.key) {
      case "ArrowLeft":
        if (orientation !== "vertical") {
          x -= 40;
        }
        break;
      case "ArrowRight":
        if (orientation !== "vertical") {
          x += 40;
        }
        break;
      case "ArrowUp":
        if (orientation !== "horizontal") {
          y -= 40;
        }
        break;
      case "ArrowDown":
        if (orientation !== "horizontal") {
          y += 40;
        }
        break;
      case "PageUp":
      case "PageDown":
      case " ": {
        const forward = event.key === "PageDown" || (event.key === " " && !event.shiftKey);
        if (orientation === "horizontal") {
          x += (forward ? 1 : -1) * (rtl ? -1 : 1) * viewport.clientWidth * 0.9;
        } else {
          y += (forward ? 1 : -1) * viewport.clientHeight * 0.9;
        }
        break;
      }
      case "Home":
        if (orientation === "horizontal") {
          x = rtl ? maxX : 0;
        } else {
          y = 0;
        }
        break;
      case "End":
        if (orientation === "horizontal") {
          x = rtl ? 0 : maxX;
        } else {
          y = maxY;
        }
        break;
      default:
        return;
    }
    x = Math.max(0, Math.min(maxX, x));
    y = Math.max(0, Math.min(maxY, y));
    if (x === fromX && y === fromY) {
      return;
    }
    event.preventDefault();
    viewport.scrollTo({ left: nativeScrollLeft(x, maxX, rtl), top: y, behavior: "instant" });
    this.binding.current?.refresh();
  };
  render() {
    const state = this.binding.current?.state.get(),
      overflow = state && ((state.orientation !== "vertical" && state.x.overflow) || (state.orientation !== "horizontal" && state.y.overflow));
    return html`<div part="root viewport" @keydown=${this.key} tabindex=${overflow ? 0 : -1} data-orientation=${state?.orientation ?? "both"}><div part="content"><slot @slotchange=${() => this.binding.current?.refresh()}></slot></div></div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-scroll-viewport": AcmeScrollViewport;
  }
}
