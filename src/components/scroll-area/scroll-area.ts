import { optionalString } from "../../shared/attributes";
import { ContextProvider } from "@lit/context";
import { createAtom } from "@tanstack/lit-store";
import { Debouncer } from "@tanstack/pacer";
import { html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { composedContains } from "../../shared/composed-tree";
import { atomState } from "../../shared/atom-state";
import { StoreSelector } from "../../shared/store-connection";
import { ComposedParticipants } from "../../shared/composed-participants";
import { scrollGeometry, physicalScrollLeft } from "../../shared/scroll-geometry";
import { scrollContext, scrollPartFor, scrollBoundary, markScrollBoundary, type ScrollPart, type ScrollOwner, type ScrollState } from "../../shared/scroll-area-context";
import { scrollAreaCss } from "../../generated/components/scroll-area/scroll-area.styles";
/** Custom controls around one native viewport.
 * @slot - One Scroll Viewport and optional custom bars/corner.
 * @slot controls - Optional Scroll Buttons outside the viewport.
 * @csspart root - The complete region.
 * @csspart surface - The viewport and overlaid controls.
 */
export class AcmeScrollArea extends AcmeElement {
  static styles = [sharedCss, scrollAreaCss];
  @atomState() private orientationValue: "horizontal" | "vertical" | "both" = "both";
  /** @default "both" */
  @property({ noAccessor: true, reflect: true, attribute: "orientation", converter: optionalString }) get orientation(): "horizontal" | "vertical" | "both" {
    return this.orientationValue;
  }
  set orientation(value: "horizontal" | "vertical" | "both" | undefined) {
    const next = value ?? "both";
    if (!["horizontal", "vertical", "both"].includes(next)) {
      throw new TypeError("Invalid orientation");
    }
    const previous = this.orientationValue;
    this.orientationValue = next;
    this.requestUpdate("orientation", previous);
  }
  @atomState() private scrollbarVisibilityValue: "hover" | "always" = "hover";
  /** @default "hover" */
  @property({ noAccessor: true, reflect: true, attribute: "scrollbar-visibility", converter: optionalString }) get scrollbarVisibility(): "hover" | "always" {
    return this.scrollbarVisibilityValue;
  }
  set scrollbarVisibility(value: "hover" | "always" | undefined) {
    const next = value ?? "hover";
    if (!["hover", "always"].includes(next)) {
      throw new TypeError("Invalid scrollbarVisibility");
    }
    const previous = this.scrollbarVisibilityValue;
    this.scrollbarVisibilityValue = next;
    this.requestUpdate("scrollbarVisibility", previous);
  }
  @atomState() private sizeValue: "tiny" | "small" | "medium" | "large" = "medium";
  /** @default "medium" */
  @property({ noAccessor: true, reflect: true, attribute: "size", converter: optionalString }) get size(): "tiny" | "small" | "medium" | "large" {
    return this.sizeValue;
  }
  set size(value: "tiny" | "small" | "medium" | "large" | undefined) {
    const next = value ?? "medium";
    if (!["tiny", "small", "medium", "large"].includes(next)) {
      throw new TypeError("Invalid size");
    }
    const previous = this.sizeValue;
    this.sizeValue = next;
    this.requestUpdate("size", previous);
  }
  @atomState() @property({ noAccessor: true, type: Boolean, reflect: true, attribute: "edge-fades" }) edgeFades = false;
  private readonly members = createAtom<readonly ScrollPart[]>([]);
  private readonly current = createAtom<ScrollState>({
    x: scrollGeometry(0, 0, 0, 0),
    y: scrollGeometry(0, 0, 0, 0),
    hover: false,
    scrolling: false,
    focus: false,
    dragging: false,
    rtl: false,
    visibility: "hover",
    orientation: "both",
  });
  private readonly owner: ScrollOwner = {
    state: this.current,
    register: (part) => {
      if (part.kind === "viewport" && this.members.get().some((other) => other.kind === "viewport" && other.host.isConnected)) {
        throw new Error("Scroll Area accepts exactly one Scroll Viewport");
      }
      this.members.set((parts) => [...parts, part]);
      this.refresh();
      return () => {
        this.members.set((parts) => parts.filter((p) => p !== part));
        this.refresh();
      };
    },
    refresh: () => this.refresh(),
    viewport: () => this.viewportPart()?.element(),
    dragging: (dragging) => {
      this.current.set((previous) => ({ ...previous, dragging }));
    },
  };
  private readonly provider = new ContextProvider(this, { context: scrollContext, initialValue: this.owner });
  private readonly projection = createAtom(() => ({ members: this.members.get(), axes: this.members.get().map((part) => part.axis?.()), state: this.current.get() }));
  private readonly updates = new StoreSelector(this, () => this.projection);
  private readonly participants = new ComposedParticipants(this, {
    owner: this.owner,
    parts: () => this.members.get(),
    find: scrollPartFor,
    boundary: scrollBoundary,
    slots: () => [...this.renderRoot.querySelectorAll("slot")],
    descend: (part) => part.kind !== "viewport",
  });
  private viewportPart() {
    return this.members.get().find((part) => part.kind === "viewport");
  }
  private directionObservers: MutationObserver[] = [];
  private viewCleanup?: () => void;
  private frame?: number;
  private frameWindow?: Window;
  private observed?: HTMLElement;
  private resize?: ResizeObserver;
  private observedElements = new Set<Element>();
  private mutations?: MutationObserver;
  private cleanup?: () => void;
  private readonly idle = new Debouncer(() => this.current.set((previous) => ({ ...previous, scrolling: false })), { wait: 1000 });
  constructor() {
    super();
    markScrollBoundary(this);
    this.addEventListener("pointerenter", () => this.current.set((previous) => ({ ...previous, hover: true })));
    this.addEventListener("pointerleave", () => this.current.set((previous) => ({ ...previous, hover: false })));
    this.addEventListener("focusin", () => this.current.set((previous) => ({ ...previous, focus: true })));
    this.addEventListener("focusout", () =>
      queueMicrotask(() => {
        if (this.isConnected) {
          this.current.set((previous) => ({ ...previous, focus: this.matches(":focus-within") }));
        }
      }),
    );
  }
  /** The real scroll owner used by native APIs and virtualizers. */
  getViewport(): HTMLElement {
    const viewport = this.viewportPart()?.element();
    if (!viewport) {
      throw new Error("Scroll Area requires one connected Scroll Viewport");
    }
    return viewport;
  }
  scrollTo(options?: ScrollToOptions): void;
  scrollTo(x: number, y: number): void;
  scrollTo(options: ScrollToOptions | number = {}, y?: number) {
    const value = typeof options === "number" ? { left: options, top: y } : options;
    this.getViewport().scrollTo({ ...value, ...(this.ownerDocument.defaultView?.matchMedia("(prefers-reduced-motion: reduce)").matches ? { behavior: "instant" as const } : {}) });
  }
  scrollBy(options?: ScrollToOptions): void;
  scrollBy(x: number, y: number): void;
  scrollBy(options: ScrollToOptions | number = {}, y?: number) {
    const value = typeof options === "number" ? { left: options, top: y } : options;
    this.getViewport().scrollBy({ ...value, ...(this.ownerDocument.defaultView?.matchMedia("(prefers-reduced-motion: reduce)").matches ? { behavior: "instant" as const } : {}) });
  }
  private refresh() {
    if (!this.isConnected || this.frame !== undefined) {
      return;
    }
    const view = this.ownerDocument.defaultView!;
    this.frameWindow = view;
    this.frame = view.requestAnimationFrame(() => {
      this.frame = undefined;
      this.measure();
    });
  }
  private measure() {
    const viewport = this.viewportPart()?.element();
    if (!viewport) {
      this.release();
      const previous = this.current.get();
      if (previous.x.maximum || previous.y.maximum) {
        this.current.set({ ...previous, x: scrollGeometry(0, 0, 0, 0), y: scrollGeometry(0, 0, 0, 0), scrolling: false, focus: false, dragging: false });
      }
      return;
    }
    if (this.observed !== viewport) {
      this.release();
      this.observed = viewport;
      const onScroll = () => {
        if (!this.current.get().scrolling) {
          this.current.set((previous) => ({ ...previous, scrolling: true }));
        }
        this.idle.maybeExecute();
        this.refresh();
      };
      viewport.addEventListener("scroll", onScroll, { passive: true });
      this.cleanup = () => viewport.removeEventListener("scroll", onScroll);
      this.resize = new ResizeObserver(() => this.refresh());
      this.mutations = new MutationObserver(() => this.refresh());
      this.mutations.observe(this.viewportPart()!.host, { subtree: true, childList: true, attributes: true, characterData: true });
    }
    const elements = new Set<Element>([viewport]);
    const content = this.viewportPart()?.content?.();
    if (content) {
      elements.add(content);
    }
    for (const child of this.viewportPart()!.host.children) {
      elements.add(child);
    }
    const bars = this.members.get().filter((part) => part.kind === "bar");
    for (const part of bars) {
      const el = part.element();
      if (el) {
        elements.add(el);
      }
    }
    for (const element of this.observedElements) {
      if (!elements.has(element)) {
        this.resize?.unobserve(element);
      }
    }
    for (const element of elements) {
      if (!this.observedElements.has(element)) {
        this.resize?.observe(element);
      }
    }
    this.observedElements = elements;
    const xTrack = bars.find((part) => part.axis?.() === "horizontal")?.element(),
      yTrack = bars.find((part) => part.axis?.() === "vertical")?.element();
    const rtl = this.ownerDocument.defaultView!.getComputedStyle(viewport).direction === "rtl";
    const x = scrollGeometry(
      viewport.clientWidth,
      viewport.scrollWidth,
      xTrack?.clientWidth ?? 0,
      physicalScrollLeft(viewport.scrollLeft, Math.max(0, viewport.scrollWidth - viewport.clientWidth), rtl),
    );
    const y = scrollGeometry(viewport.clientHeight, viewport.scrollHeight, yTrack?.clientHeight ?? 0, viewport.scrollTop);
    for (const [name, value] of [
      ["--_scroll-corner-width", x.overflow && y.overflow ? (yTrack?.clientWidth ?? 0) + "px" : "0px"],
      ["--_scroll-corner-height", x.overflow && y.overflow ? (xTrack?.clientHeight ?? 0) + "px" : "0px"],
    ]) {
      if (this.style.getPropertyValue(name) !== value) {
        this.style.setProperty(name, value);
      }
    }
    const previous = this.current.get(),
      next = { ...previous, x, y, rtl, visibility: this.scrollbarVisibility, orientation: this.orientation };
    if (JSON.stringify(previous) !== JSON.stringify(next)) {
      this.current.set(next);
    }
  }
  private release() {
    this.resize?.disconnect();
    this.mutations?.disconnect();
    this.cleanup?.();
    this.resize = undefined;
    this.observedElements.clear();
    this.mutations = undefined;
    this.cleanup = undefined;
    this.observed = undefined;
  }
  connectedCallback() {
    super.connectedCallback();
    let scope: Node | undefined = this.getRootNode();
    while (scope) {
      const observer = new MutationObserver((records) => {
        if (records.some((record) => composedContains(record.target, this))) {
          this.refresh();
        }
      });
      observer.observe(scope, { subtree: true, attributes: true, attributeFilter: ["dir", "style", "class"] });
      this.directionObservers.push(observer);
      scope = "host" in scope ? (scope as ShadowRoot).host.getRootNode() : undefined;
    }
    const view = this.ownerDocument.defaultView!,
      refresh = () => this.refresh();
    view.addEventListener("resize", refresh);
    this.viewCleanup = () => view.removeEventListener("resize", refresh);
    this.refresh();
  }
  disconnectedCallback() {
    for (const observer of this.directionObservers) {
      observer.disconnect();
    }
    this.directionObservers = [];
    this.viewCleanup?.();
    this.viewCleanup = undefined;
    if (this.frame !== undefined) {
      this.frameWindow?.cancelAnimationFrame(this.frame);
    }
    this.frame = undefined;
    this.release();
    this.idle.cancel();
    this.current.set((previous) => ({ ...previous, hover: false, scrolling: false, focus: false, dragging: false }));
    super.disconnectedCallback();
  }
  protected updated() {
    this.refresh();
  }
  render() {
    const custom = (kind: string, axis?: string) => this.members.get().some((part) => part.kind === kind && part.host.getRootNode() !== this.shadowRoot && (!axis || part.axis?.() === axis));
    const state = this.current.get();
    return html`<div part="root"><div part="surface" ?data-fade-top=${this.edgeFades && this.orientation !== "horizontal" && state.y.position > 1} ?data-fade-bottom=${this.edgeFades && this.orientation !== "horizontal" && state.y.maximum - state.y.position > 1} ?data-fade-left=${this.edgeFades && this.orientation !== "vertical" && state.x.position > 1} ?data-fade-right=${this.edgeFades && this.orientation !== "vertical" && state.x.maximum - state.x.position > 1}><slot></slot><span class="inline-fades" aria-hidden="true"></span>${custom("bar", "horizontal") ? nothing : html`<acme-scrollbar orientation="horizontal"></acme-scrollbar>`}${custom("bar", "vertical") ? nothing : html`<acme-scrollbar orientation="vertical"></acme-scrollbar>`}${custom("corner") ? nothing : html`<acme-scroll-corner></acme-scroll-corner>`}</div><div class="controls"><slot name="controls"></slot></div></div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-scroll-area": AcmeScrollArea;
  }
}
