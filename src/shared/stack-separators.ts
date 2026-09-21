import { createAtom } from "@tanstack/lit-store";
import type { ReactiveController, ReactiveElement } from "lit";
import { responsiveStyleDelivery } from "../generated/responsive-styles";
import { stackSeparatorRectangles, type StackRectangle } from "./stack-geometry";
import { StoreSelector } from "./store-connection";

type Geometry = Readonly<{ vertical: boolean; rectangles: readonly StackRectangle[] }>;
const empty: Geometry = Object.freeze({ vertical: false, rectangles: Object.freeze([]) });
const same = (a: Geometry, b: Geometry) =>
  a.vertical === b.vertical &&
  a.rectangles.length === b.rectangles.length &&
  a.rectangles.every((r, i) => r.x === b.rectangles[i].x && r.y === b.rectangles[i].y && r.width === b.rectangles[i].width && r.height === b.rectangles[i].height);
type Options = { enabled(): boolean; root(): HTMLElement | null };
type OwnedValue = { previous: string; priority: string; requested?: string; written?: string };
const rowGap = responsiveStyleDelivery.rules.rowGap.property;
const columnGap = responsiveStyleDelivery.rules.columnGap.property;

/** Measures native flex lines only while automatic separators are enabled. */
export class StackSeparators implements ReactiveController {
  private readonly geometry = createAtom<Geometry>(empty, { compare: same });
  readonly state = createAtom(() => this.geometry.get());
  private connected = false;
  private root?: HTMLElement;
  private slot?: HTMLSlotElement;
  private resize?: ResizeObserver;
  private mutation?: MutationObserver;
  private observedMembers: Element[] = [];
  private readonly values = new Map<string, OwnedValue>();
  private cleanup: (() => void)[] = [];
  private frame?: { view: Window; id: number };
  private diagnostic?: string;
  constructor(
    private host: ReactiveElement,
    private options: Options,
  ) {
    host.addController(this);
    new StoreSelector(host, () => this.state);
  }
  schedule = (): void => {
    if (!this.connected || !this.options.enabled() || this.frame) return;
    const view = this.host.ownerDocument.defaultView;
    if (!view) return;
    this.frame = {
      view,
      id: view.requestAnimationFrame(() => {
        this.frame = undefined;
        this.measure();
      }),
    };
  };
  private write(property: string, value: string): void {
    if (!this.root) return;
    let owned = this.values.get(property);
    if (!owned) {
      owned = { previous: this.root.style.getPropertyValue(property), priority: this.root.style.getPropertyPriority(property) };
      this.values.set(property, owned);
    }
    if (owned.requested === value && this.root.style.getPropertyValue(property) === owned.written) return;
    this.root.style.setProperty(property, value);
    owned.requested = value;
    owned.written = this.root.style.getPropertyValue(property);
  }
  private restore(): void {
    if (this.root)
      for (const [property, owned] of this.values) {
        if (this.root.style.getPropertyValue(property) !== owned.written) continue;
        if (owned.previous) this.root.style.setProperty(property, owned.previous, owned.priority);
        else this.root.style.removeProperty(property);
      }
    this.values.clear();
  }
  private warn(message: string): void {
    if (this.diagnostic !== message) console.warn(this.host.localName, message);
    this.diagnostic = message;
  }
  private bind(root: HTMLElement): void {
    this.stop();
    this.root = root;
    this.slot = root.querySelector("slot") ?? undefined;
    this.resize = new ResizeObserver(this.schedule);
    this.resize.observe(root);
    this.resize.observe(this.host);
    const meter = root.querySelector("[data-stack-measure]");
    if (meter) this.resize.observe(meter);
    this.mutation = new MutationObserver(this.schedule);
    this.mutation.observe(this.host, { childList: true, subtree: true, attributes: true, characterData: true });
    let ancestor: Element | null = this.host;
    while (ancestor) {
      if (ancestor !== this.host) this.mutation.observe(ancestor, { attributes: true });
      const scope = ancestor.getRootNode();
      ancestor = ancestor.assignedSlot ?? ancestor.parentElement ?? (scope.nodeType === 11 && "host" in scope ? (scope as ShadowRoot).host : null);
    }
    this.slot?.addEventListener("slotchange", this.schedule);
    const scope = this.host.getRootNode();
    scope.addEventListener("slotchange", this.schedule);
    this.cleanup.push(() => scope.removeEventListener("slotchange", this.schedule));
    const view = this.host.ownerDocument.defaultView;
    view?.addEventListener("resize", this.schedule);
    this.cleanup.push(() => view?.removeEventListener("resize", this.schedule));
    const fonts = this.host.ownerDocument.fonts;
    fonts?.addEventListener("loadingdone", this.schedule);
    this.cleanup.push(() => fonts?.removeEventListener("loadingdone", this.schedule));
  }
  private measure(): void {
    if (!this.connected || !this.options.enabled() || !this.root || !this.slot) return;
    const root = this.root,
      view = this.host.ownerDocument.defaultView;
    if (!view) return;
    const assigned = this.slot.assignedNodes({ flatten: true });
    if (assigned.some((node) => node.nodeType === 3 && !!node.textContent?.trim())) {
      this.warn("Automatic separators require element children; text remains ordinary Stack content.");
      this.restore();
      this.geometry.set(empty);
      return;
    }
    const children = assigned.filter((node): node is Element => node.nodeType === 1);
    if (children.some((child) => view.getComputedStyle(child).display === "contents")) {
      this.warn("Automatic separators require each child to have its own rendered box.");
      this.restore();
      this.geometry.set(empty);
      return;
    }
    this.diagnostic = undefined;
    const members = children.filter((child) => {
      const style = view.getComputedStyle(child);
      return child.getClientRects().length > 0 && style.display !== "none" && style.position !== "absolute" && style.position !== "fixed";
    });
    if (members.length !== this.observedMembers.length || members.some((member, i) => member !== this.observedMembers[i])) {
      for (const member of this.observedMembers) this.resize?.unobserve(member);
      for (const member of members) this.resize?.observe(member);
      this.observedMembers = members;
    }
    const authored = view.getComputedStyle(this.host),
      computed = view.getComputedStyle(root);
    const vertical = computed.flexDirection.startsWith("column");
    const gap = (value: string) => (value === "normal" ? "0px" : value);
    const thickness = "max(0px, var(--acme-stack-separator-width, 1px))";
    this.write(rowGap, vertical ? `calc(2 * (${gap(authored.rowGap)}) + ${thickness})` : gap(authored.rowGap));
    this.write(columnGap, vertical ? gap(authored.columnGap) : `calc(2 * (${gap(authored.columnGap)}) + ${thickness})`);
    const bounds = root.getBoundingClientRect(),
      pixels = (value: string) => Number.parseFloat(value) || 0;
    const leftBorder = pixels(computed.borderLeftWidth),
      topBorder = pixels(computed.borderTopWidth);
    const borderBox = computed.boxSizing === "border-box";
    const layoutWidth = pixels(computed.width) + (borderBox ? 0 : leftBorder + pixels(computed.borderRightWidth) + pixels(computed.paddingLeft) + pixels(computed.paddingRight));
    const layoutHeight = pixels(computed.height) + (borderBox ? 0 : topBorder + pixels(computed.borderBottomWidth) + pixels(computed.paddingTop) + pixels(computed.paddingBottom));
    const scaleX = layoutWidth > 0 && bounds.width > 0 ? bounds.width / layoutWidth : 1,
      scaleY = layoutHeight > 0 && bounds.height > 0 ? bounds.height / layoutHeight : 1;
    const paddingStart = pixels(vertical ? computed.paddingLeft : computed.paddingTop);
    const crossSize = Math.max(
      0,
      (vertical ? bounds.width / scaleX : bounds.height / scaleY) -
        pixels(vertical ? computed.borderLeftWidth : computed.borderTopWidth) -
        pixels(vertical ? computed.borderRightWidth : computed.borderBottomWidth) -
        paddingStart -
        pixels(vertical ? computed.paddingRight : computed.paddingBottom),
    );
    const meter = root.querySelector("[data-stack-measure]")?.getBoundingClientRect();
    const measuredWidth = (meter?.width ?? 0) / scaleX,
      inset = (meter?.height ?? 0) / scaleY;
    const overlay = root.querySelector("[data-stack-overlay]")?.getBoundingClientRect();
    if (!overlay) return;
    const offsetX = (bounds.x - overlay.x) / scaleX + leftBorder,
      offsetY = (bounds.y - overlay.y) / scaleY + topBorder;
    const rectangles = stackSeparatorRectangles(
      members.map((member, index) => {
        const rect = member.getBoundingClientRect();
        return {
          x: (rect.x - bounds.x) / scaleX - leftBorder,
          y: (rect.y - bounds.y) / scaleY - topBorder,
          width: rect.width / scaleX,
          height: rect.height / scaleY,
          order: Number(view.getComputedStyle(member).order) || 0,
          index,
        };
      }),
      {
        vertical,
        reverse: computed.flexDirection.endsWith("reverse"),
        rtl: computed.direction === "rtl",
        wrap: computed.flexWrap !== "nowrap",
        thickness: measuredWidth,
        crossStart: paddingStart,
        crossSize,
      },
    ).map((rectangle) =>
      Object.freeze({
        x: rectangle.x + offsetX + (vertical ? inset : 0),
        y: rectangle.y + offsetY + (vertical ? 0 : inset),
        width: Math.max(0, rectangle.width - (vertical ? 2 * inset : 0)),
        height: Math.max(0, rectangle.height - (vertical ? 0 : 2 * inset)),
      }),
    );
    this.geometry.set(Object.freeze({ vertical, rectangles: Object.freeze(rectangles) }));
  }
  private stop(): void {
    if (this.frame) {
      this.frame.view.cancelAnimationFrame(this.frame.id);
      this.frame = undefined;
    }
    this.resize?.disconnect();
    this.resize = undefined;
    this.observedMembers = [];
    this.mutation?.disconnect();
    this.mutation = undefined;
    this.slot?.removeEventListener("slotchange", this.schedule);
    this.slot = undefined;
    for (const release of this.cleanup.splice(0)) release();
    this.restore();
    this.root = undefined;
  }
  hostConnected(): void {
    this.connected = true;
  }
  hostUpdated(): void {
    if (!this.connected || !this.options.enabled()) {
      this.stop();
      this.geometry.set(empty);
      return;
    }
    const root = this.options.root();
    if (!root) return;
    if (root !== this.root) this.bind(root);
    this.schedule();
  }
  hostDisconnected(): void {
    this.connected = false;
    this.stop();
  }
}
