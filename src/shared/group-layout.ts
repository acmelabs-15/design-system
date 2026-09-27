import type { ReadonlyAtom } from "@tanstack/lit-store";
import type { ReactiveController, ReactiveElement } from "lit";
import type { AppearanceDefaults } from "./inherited-appearance";
import { groupParticipant, groupParticipantChange, type GroupMemberController, type GroupEdges, type GroupMemberLayout } from "./group-member";

type Options = { root(): HTMLElement | null; nodes(): readonly Node[]; defaults: ReadonlyAtom<AppearanceDefaults>; attached(): boolean; outline(): boolean; grow(): boolean };
const noFrame: GroupEdges = Object.freeze({ top: false, right: false, bottom: false, left: false });
const pixels = (value: string) => Math.max(0, Number.parseFloat(value) || 0);
const transparent = (color: string) => color === "transparent" || /^(?:rgba|hsla)\(.*,[\s]*0(?:\.0*)?\)$/.test(color) || /\/\s*0(?:\.0*)?\)$/.test(color);

/** Coordinates explicit direct participants; controls retain their values and interaction owners. */
export class GroupLayout implements ReactiveController {
  private connected = false;
  private readonly participants = new Set<GroupMemberController>();
  private mutation?: MutationObserver;
  private resize?: ResizeObserver;
  private targets = new Set<Element>();
  private root?: HTMLElement;
  private cleanup: (() => void)[] = [];
  private frame?: { view: Window; id: number };
  private orderWarning = false;
  constructor(
    private host: ReactiveElement,
    private options: Options,
  ) {
    host.addController(this);
  }
  private changed = (event?: Event): void => {
    if (event?.type === groupParticipantChange) {
      event.stopPropagation();
    }
    this.refresh();
    this.schedule();
  };
  private refresh(): void {
    if (!this.connected) {
      return;
    }
    const next = new Set(this.options.nodes().flatMap((node) => (node.nodeType === 1 ? [groupParticipant(node as Element)].filter((member): member is GroupMemberController => !!member) : [])));
    for (const member of this.participants) {
      if (!next.has(member)) {
        member.release(this);
        this.participants.delete(member);
      }
    }
    for (const member of next) {
      this.participants.add(member);
      member.provide(this, this.options.defaults);
    }
    const targets = new Set<Element>([this.host, ...(this.root ? [this.root] : []), ...[...next].flatMap((member) => [member.host, ...(member.surface ? [member.surface] : [])])]);
    if (targets.size !== this.targets.size || [...targets].some((target) => !this.targets.has(target))) {
      this.resize?.disconnect();
      for (const target of targets) {
        this.resize?.observe(target);
      }
      this.targets = targets;
    }
  }
  schedule = (): void => {
    if (!this.connected || this.frame) {
      return;
    }
    const view = this.host.ownerDocument.defaultView;
    if (!view) {
      return;
    }
    this.frame = {
      view,
      id: view.requestAnimationFrame(() => {
        this.frame = undefined;
        this.measure();
      }),
    };
  };
  private measure(): void {
    const root = this.root,
      view = this.host.ownerDocument.defaultView;
    if (!this.connected || !root || !view) {
      return;
    }
    this.refresh();
    const style = view.getComputedStyle(root),
      vertical = style.flexDirection.startsWith("column"),
      rtl = style.direction === "rtl";
    const joined = this.options.attached(),
      grow = this.options.grow(),
      runs: GroupMemberController[][] = [];
    let run: GroupMemberController[] = [];
    const close = () => {
      if (run.length) {
        runs.push(run);
      }
      run = [];
    };
    const visible = new Set<GroupMemberController>();
    let reordered = false;
    for (const node of this.options.nodes()) {
      if (node.nodeType === 3) {
        if (node.textContent?.trim()) {
          close();
        }
        continue;
      }
      if (node.nodeType !== 1) {
        continue;
      }
      const element = node as Element,
        css = view.getComputedStyle(element);
      if (!element.getClientRects().length || css.display === "none" || css.position === "absolute" || css.position === "fixed") {
        continue;
      }
      const member = groupParticipant(element);
      if (!member || !member.surface) {
        close();
        continue;
      }
      if (css.order !== "0") {
        reordered = true;
      }
      visible.add(member);
      run.push(member);
    }
    close();
    if (joined && reordered && !this.orderWarning) {
      console.warn(this.host.localName, "Attached members use DOM order; CSS order is not supported.");
    }
    this.orderWarning = joined && reordered;
    for (const member of this.participants) {
      if (!visible.has(member)) {
        member.present(this, { joined: false, grow: false, vertical, rtl, first: true, last: true, overlap: 0, frame: noFrame });
      }
    }
    const layouts = new Map<GroupMemberController, GroupMemberLayout>();
    for (const group of runs) {
      for (let index = 0; index < group.length; index++) {
        const member = group[index],
          border = member.borders(),
          before = group[index - 1]?.borders();
        const overlap = joined && before ? Math.min(vertical ? before.bottom : rtl ? before.left : before.right, vertical ? border.top : rtl ? border.right : border.left) : 0;
        const layout = { joined, grow, vertical, rtl, first: index === 0, last: index === group.length - 1, overlap, frame: member.layout.get()?.frame ?? noFrame };
        member.present(this, layout);
        layouts.set(member, layout);
      }
    }
    const hostStyle = view.getComputedStyle(this.host),
      bounds = this.host.getBoundingClientRect();
    const scaleX = pixels(hostStyle.width) > 0 ? bounds.width / pixels(hostStyle.width) : 1,
      scaleY = pixels(hostStyle.height) > 0 ? bounds.height / pixels(hostStyle.height) : 1;
    const widths = { top: pixels(hostStyle.borderTopWidth), right: pixels(hostStyle.borderRightWidth), bottom: pixels(hostStyle.borderBottomWidth), left: pixels(hostStyle.borderLeftWidth) };
    const inner = { top: bounds.top + widths.top * scaleY, right: bounds.right - widths.right * scaleX, bottom: bounds.bottom - widths.bottom * scaleY, left: bounds.left + widths.left * scaleX };
    const painted = {
      top: widths.top > 0 && !transparent(hostStyle.borderTopColor),
      right: widths.right > 0 && !transparent(hostStyle.borderRightColor),
      bottom: widths.bottom > 0 && !transparent(hostStyle.borderBottomColor),
      left: widths.left > 0 && !transparent(hostStyle.borderLeftColor),
    };
    for (const [member, layout] of layouts) {
      let frame = noFrame;
      if (joined && this.options.outline() && member.surface) {
        const rectangle = member.surface.getBoundingClientRect();
        frame = {
          top: painted.top && Math.abs(rectangle.top - inner.top) < 0.5 * scaleY,
          right: painted.right && Math.abs(rectangle.right - inner.right) < 0.5 * scaleX,
          bottom: painted.bottom && Math.abs(rectangle.bottom - inner.bottom) < 0.5 * scaleY,
          left: painted.left && Math.abs(rectangle.left - inner.left) < 0.5 * scaleX,
        };
      }
      member.present(this, { ...layout, frame });
    }
  }
  hostConnected(): void {
    this.connected = true;
    this.host.addEventListener(groupParticipantChange, this.changed);
    this.host.addEventListener("slotchange", this.changed);
    this.resize = new ResizeObserver(this.schedule);
    this.mutation = new MutationObserver(() => this.changed());
    this.mutation.observe(this.host, { childList: true, subtree: true, attributes: true, characterData: true });
    const view = this.host.ownerDocument.defaultView;
    view?.addEventListener("resize", this.schedule);
    this.cleanup.push(() => view?.removeEventListener("resize", this.schedule));
    const fonts = this.host.ownerDocument.fonts;
    fonts?.addEventListener("loadingdone", this.schedule);
    this.cleanup.push(() => fonts?.removeEventListener("loadingdone", this.schedule));
    this.refresh();
  }
  hostUpdated(): void {
    if (!this.connected) {
      return;
    }
    const root = this.options.root();
    if (root !== this.root) {
      this.root?.removeEventListener("slotchange", this.changed);
      this.root = root ?? undefined;
      this.root?.addEventListener("slotchange", this.changed);
    }
    this.changed();
  }
  hostDisconnected(): void {
    this.connected = false;
    if (this.frame) {
      this.frame.view.cancelAnimationFrame(this.frame.id);
      this.frame = undefined;
    }
    this.host.removeEventListener(groupParticipantChange, this.changed);
    this.host.removeEventListener("slotchange", this.changed);
    this.root?.removeEventListener("slotchange", this.changed);
    this.root = undefined;
    this.mutation?.disconnect();
    this.mutation = undefined;
    this.resize?.disconnect();
    this.resize = undefined;
    this.targets.clear();
    for (const release of this.cleanup.splice(0)) {
      release();
    }
    for (const member of this.participants) {
      member.release(this);
    }
    this.participants.clear();
  }
}
