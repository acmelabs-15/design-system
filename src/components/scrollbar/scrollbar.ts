import { optionalString } from "../../shared/attributes";
import { ContextProvider } from "@lit/context";
import { createAtom } from "@tanstack/lit-store";
import { html } from "lit";
import { property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { atomState } from "../../shared/atom-state";
import { SpringValue } from "../../shared/spring-value";
import { readMotionSpring } from "../../shared/motion-spring";
import { ScrollPartBinding, scrollbarContext } from "../../shared/scroll-area-context";
import { scrollGeometry, scrollFromPointer, nativeScrollLeft, physicalScrollLeft } from "../../shared/scroll-geometry";
import { scrollbarCss } from "../../generated/components/scrollbar/scrollbar.styles";
/** Custom track and thumb over native scrolling.
 * @slot - An optional Scroll Thumb; one is supplied when omitted.
 * @csspart scrollbar - Pointer-operated track.
 */
export class AcmeScrollbar extends AcmeElement {
  static styles = [sharedCss, scrollbarCss];
  @atomState() private orientationValue: "horizontal" | "vertical" = "vertical";
  /** @default "vertical" */
  @property({ noAccessor: true, reflect: true, attribute: "orientation", converter: optionalString }) get orientation(): "horizontal" | "vertical" {
    return this.orientationValue;
  }
  set orientation(value: "horizontal" | "vertical" | undefined) {
    const next = value ?? "vertical";
    if (!["horizontal", "vertical"].includes(next)) {
      throw new TypeError("Invalid orientation");
    }
    const previous = this.orientationValue;
    this.orientationValue = next;
    this.requestUpdate("orientation", previous);
  }
  private readonly binding = new ScrollPartBinding(this, { kind: "bar", element: () => this.track, axis: () => this.orientation });
  private get track() {
    return this.renderRoot?.querySelector<HTMLElement>("[part=scrollbar]") ?? undefined;
  }
  private readonly projection = createAtom(() => ({ axis: this.orientation, geometry: this.geometry }));
  private readonly provider = new ContextProvider(this, { context: scrollbarContext, initialValue: this.projection });
  private get geometry() {
    const state = this.binding.current?.state.get();
    return (this.orientation === "horizontal" ? state?.x : state?.y) ?? scrollGeometry(0, 0, 0, 0);
  }
  private get active() {
    const state = this.binding.current?.state.get();
    return !!state && this.geometry.overflow && (state.orientation === "both" || state.orientation === this.orientation);
  }
  private get visible() {
    const state = this.binding.current?.state.get();
    return this.active && !!state && (state.visibility === "always" || state.hover || state.focus || state.scrolling || state.dragging);
  }
  private readonly motion = new SpringValue(
    this,
    () => (this.visible ? 1 : 0),
    () => readMotionSpring(this, "standard", "effects", "fast"),
  );
  @atomState() private drag?: { id: number; grab: number; track: HTMLElement; viewport: HTMLElement };
  private releaseDrag?: () => void;
  private end = () => {
    const drag = this.drag;
    this.drag = undefined;
    this.releaseDrag?.();
    this.releaseDrag = undefined;
    this.binding.current?.dragging(false);
    if (drag?.track.hasPointerCapture(drag.id)) {
      drag.track.releasePointerCapture(drag.id);
    }
  };
  private setPosition(point: number, grab: number) {
    const track = this.track,
      viewport = this.binding.current?.viewport();
    if (!track || !viewport) {
      return;
    }
    const bounds = track.getBoundingClientRect(),
      horizontal = this.orientation === "horizontal",
      position = scrollFromPointer(point, horizontal ? bounds.left : bounds.top, grab, this.geometry);
    if (horizontal) {
      viewport.scrollLeft = nativeScrollLeft(position, this.geometry.maximum, this.binding.current!.state.get().rtl);
    } else {
      viewport.scrollTop = position;
    }
    this.binding.current?.refresh();
  }
  private pointer = (event: PointerEvent) => {
    if (event.button !== 0 || !event.isPrimary || !this.active || this.drag || this.binding.current?.state.get().dragging) {
      return;
    }
    const track = this.track!;
    const horizontal = this.orientation === "horizontal";
    const thumb = event.composedPath().find((node) => (node as Node).nodeType === 1 && (node as Element).getAttribute("part")?.split(" ").includes("thumb")) as Element | undefined;
    const coordinate = horizontal ? event.clientX : event.clientY;
    const rect = thumb?.getBoundingClientRect();
    const grab = rect ? coordinate - (horizontal ? rect.left : rect.top) : this.geometry.thumb / 2;
    event.preventDefault();
    this.drag = { id: event.pointerId, grab, track, viewport: this.binding.current!.viewport()! };
    this.binding.current?.dragging(true);
    if (!thumb) {
      this.setPosition(coordinate, grab);
    }
    const move = (e: PointerEvent) => {
      if (e.pointerId === this.drag?.id) {
        this.setPosition(horizontal ? e.clientX : e.clientY, this.drag.grab);
      }
    };
    const end = (e: PointerEvent) => {
      if (e.pointerId === this.drag?.id) {
        this.end();
      }
    };
    const view = this.ownerDocument.defaultView!;
    track.addEventListener("pointermove", move);
    track.addEventListener("pointerup", end);
    track.addEventListener("pointercancel", end);
    track.addEventListener("lostpointercapture", end);
    view.addEventListener("blur", this.end);
    this.releaseDrag = () => {
      track.removeEventListener("pointermove", move);
      track.removeEventListener("pointerup", end);
      track.removeEventListener("pointercancel", end);
      track.removeEventListener("lostpointercapture", end);
      view.removeEventListener("blur", this.end);
    };
    try {
      track.setPointerCapture(event.pointerId);
    } catch {
      this.end();
    }
  };
  private wheel = (event: WheelEvent) => {
    const viewport = this.binding.current?.viewport();
    if (!viewport || event.ctrlKey) {
      return;
    }
    const horizontal = this.orientation === "horizontal";
    let delta = horizontal ? event.deltaX : event.deltaY;
    if (!delta) {
      return;
    }
    const style = this.ownerDocument.defaultView!.getComputedStyle(viewport);
    if (event.deltaMode === 1) {
      delta *= parseFloat(style.lineHeight) || parseFloat(style.fontSize);
    } else if (event.deltaMode === 2) {
      delta *= horizontal ? viewport.clientWidth : viewport.clientHeight;
    }
    const geometry = this.geometry,
      rtl = this.binding.current!.state.get().rtl,
      current = horizontal ? physicalScrollLeft(viewport.scrollLeft, geometry.maximum, rtl) : viewport.scrollTop,
      next = Math.max(0, Math.min(geometry.maximum, current + delta));
    if (Math.abs(next - current) < 0.5) {
      return;
    }
    event.preventDefault();
    if (horizontal) {
      viewport.scrollLeft = nativeScrollLeft(next, geometry.maximum, rtl);
    } else {
      viewport.scrollTop = next;
    }
    this.binding.current?.refresh();
  };
  protected willUpdate(changes: Map<PropertyKey, unknown>) {
    if (this.drag && (!this.active || changes.has("orientation") || this.drag.viewport !== this.binding.current?.viewport())) {
      this.end();
    }
    this.motion.update();
  }
  protected updated() {
    this.toggleAttribute("data-inactive", !this.active);
    this.toggleAttribute("data-visible", this.visible);
    this.style.setProperty("--_scroll-opacity", String(this.motion.value));
  }
  disconnectedCallback() {
    this.end();
    super.disconnectedCallback();
  }
  render() {
    return html`<div part="scrollbar" aria-hidden="true" @pointerdown=${this.pointer} @wheel=${this.wheel}><slot><acme-scroll-thumb></acme-scroll-thumb></slot></div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-scrollbar": AcmeScrollbar;
  }
}
