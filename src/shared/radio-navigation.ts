import { createAtom } from "@tanstack/lit-store";
import type { ReactiveController, ReactiveElement } from "lit";
import { selectionOrder, type SelectionMember } from "./selection-member";
import { RovingTabindex } from "./roving-tabindex";
import { delegateToolbarKey, registerKeyboardCollection, toolbarKeyboardOwner } from "./keyboard-delegation";

type Options = Readonly<{ members(): readonly SelectionMember[]; value(): string | undefined; disabled(): boolean; loop(): boolean; synchronize(): void }>;
const arrows = new Set(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"]);
/** One tab-entry and arrow-key owner for an explicit radio collection. */
export class RadioNavigation implements ReactiveController {
  private readonly stop = createAtom<{ target?: HTMLElement }>({});
  private readonly navigation: RovingTabindex;
  private resize?: ResizeObserver;
  private mutation?: MutationObserver;
  private observed = new Set<HTMLElement>();
  private release?: () => void;
  constructor(
    private host: ReactiveElement,
    private options: Options,
  ) {
    this.navigation = new RovingTabindex(host, {
      items: () => this.available().map((member) => member.target()),
      current: () => 0,
      orientation: "both",
      wrap: () => options.loop(),
      rtl: () => host.ownerDocument.defaultView!.getComputedStyle(host).direction === "rtl",
      onMove: (target) => target.click(),
    });
    host.addController(this);
  }
  private available() {
    return [...this.options.members()].sort(selectionOrder).filter((member) => {
      const target = member.target();
      return !member.disabled() && target.isConnected && target.getClientRects().length > 0 && target.ownerDocument.defaultView!.getComputedStyle(target).visibility === "visible";
    });
  }
  target() {
    const members = this.available();
    return members.find((member) => member.value() === this.options.value())?.target() ?? members[0]?.target();
  }
  synchronize = () => {
    if (!this.host.isConnected) {
      return;
    }
    const members = this.options.members();
    const targets = new Set<HTMLElement>([this.host, ...members.map((member) => member.host)]);
    if (this.resize) {
      for (const target of this.observed) {
        if (!targets.has(target)) {
          this.resize.unobserve(target);
        }
      }
      for (const target of targets) {
        if (!this.observed.has(target)) {
          this.resize.observe(target);
        }
      }
      this.observed = targets;
    }
    if (toolbarKeyboardOwner(this.host)) {
      return;
    }
    const target = this.options.disabled() ? undefined : this.target();
    for (const member of members) {
      const control = member.target();
      const index = control === target ? 0 : -1;
      if (control.tabIndex !== index) {
        control.tabIndex = index;
      }
    }
    if (target !== this.stop.get().target) {
      this.stop.set({ target });
      this.options.synchronize();
    }
  };
  private keydown = (event: KeyboardEvent) => {
    if (event.defaultPrevented || this.options.disabled() || !arrows.has(event.key)) {
      return;
    }
    const origin = event.composedPath()[0];
    const members = this.available();
    const index = members.findIndex((member) => member.target() === origin || member.host === origin);
    if (index < 0) {
      return;
    }
    if (delegateToolbarKey(event, this.host)) {
      return;
    }
    this.navigation.handleKey(event, index);
    event.preventDefault();
    event.stopPropagation();
  };
  hostConnected() {
    this.host.addEventListener("keydown", this.keydown);
    this.resize = new ResizeObserver(this.synchronize);
    this.resize.observe(this.host);
    this.mutation = new MutationObserver(this.synchronize);
    this.mutation.observe(this.host, { subtree: true, attributes: true, attributeFilter: ["hidden", "inert", "style", "class", "dir"] });
    this.release = registerKeyboardCollection(this.host, () => this.available().map((member) => member.target()));
    this.synchronize();
  }
  hostUpdated() {
    this.synchronize();
  }
  hostDisconnected() {
    this.host.removeEventListener("keydown", this.keydown);
    this.resize?.disconnect();
    this.resize = undefined;
    this.mutation?.disconnect();
    this.mutation = undefined;
    this.observed.clear();
    this.release?.();
    this.release = undefined;
    this.stop.set({});
  }
}
