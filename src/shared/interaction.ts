import { createAtom } from "@tanstack/lit-store";
import type { ReactiveController, ReactiveControllerHost } from "lit";

export type InteractionOptions = {
  disabled?: () => boolean;
  anyFocus?: boolean;
  ownFocus?: boolean;
  onPress?: (event: PointerEvent | KeyboardEvent) => void;
  onCancel?: () => void;
};
type State = Readonly<{ hover: boolean; focus: boolean; within: boolean; pointer: number | undefined; space: boolean; enter: boolean }>;
const empty: State = Object.freeze({ hover: false, focus: false, within: false, pointer: undefined, space: false, enter: false });

/** Owns visual interaction state and its temporary listeners; native controls own activation. */
export class Interaction implements ReactiveController {
  private target?: HTMLElement;
  private connected = false;
  private cleanup: (() => void)[] = [];
  private releases: (() => void)[] = [];
  private subscription?: { unsubscribe(): void };
  private readonly state = createAtom<State>(empty, {
    compare: (a, b) => a.hover === b.hover && a.focus === b.focus && a.within === b.within && a.pointer === b.pointer && a.space === b.space && a.enter === b.enter,
  });

  constructor(
    host: ReactiveControllerHost,
    private options: InteractionOptions = {},
  ) {
    host.addController(this);
  }

  attach(target: HTMLElement | null | undefined): void {
    if (this.target === target && this.cleanup.length) return;
    this.unbind();
    this.target = target ?? undefined;
    this.bind();
  }

  private disabled(): boolean {
    return this.options.disabled?.() ?? (!!(this.target as HTMLButtonElement | undefined)?.disabled || this.target?.getAttribute("aria-disabled") === "true");
  }
  private set(patch: Partial<State>): void {
    this.state.set((previous) => Object.freeze({ ...previous, ...patch }));
  }
  private pressed(): boolean {
    const state = this.state.get();
    return state.pointer !== undefined || state.space || state.enter;
  }
  private paint = (): void => {
    const target = this.target;
    if (!target) return;
    const state = this.state.get();
    for (const [name, present] of [
      ["data-hover", state.hover],
      ["data-active", this.pressed()],
      ["data-focus", state.focus],
      ["data-focus-within", state.within],
    ] as const) {
      if (present) {
        if (target.getAttribute(name) !== "true") target.setAttribute(name, "true");
      } else target.removeAttribute(name);
    }
  };
  private releaseListeners(): void {
    for (const remove of this.releases.splice(0)) remove();
  }
  private endPress(): void {
    this.set({ pointer: undefined, space: false, enter: false });
    this.releaseListeners();
  }
  private listenForRelease(): void {
    if (this.releases.length || !this.target) return;
    const owner: EventTarget = this.target.ownerDocument.defaultView ?? this.target.ownerDocument;
    const released = (event: Event) => {
      const pointer = this.state.get().pointer;
      if (pointer === undefined || (event as PointerEvent).pointerId !== pointer) return;
      this.set({ pointer: undefined });
      if (event.type === "pointercancel") this.options.onCancel?.();
      if (!this.pressed()) this.releaseListeners();
    };
    const blurred = () => {
      this.endPress();
      this.options.onCancel?.();
    };
    for (const [type, handler] of [
      ["pointerup", released],
      ["pointercancel", released],
      ["blur", blurred],
    ] as const) {
      owner.addEventListener(type, handler);
      this.releases.push(() => owner.removeEventListener(type, handler));
    }
  }
  private bind(): void {
    const target = this.target;
    if (!this.connected || !target || this.cleanup.length) return;
    this.subscription = this.state.subscribe(this.paint);
    this.paint();
    const on = <Key extends keyof HTMLElementEventMap>(type: Key, handler: (event: HTMLElementEventMap[Key]) => void) => {
      target.addEventListener(type, handler);
      this.cleanup.push(() => target.removeEventListener(type, handler));
    };
    on("pointerenter", (event) => {
      if ((event.pointerType === "mouse" || event.pointerType === "pen") && !this.disabled()) this.set({ hover: true });
    });
    on("pointerleave", () => {
      this.options.onCancel?.();
      this.set({ hover: false, pointer: undefined });
      if (!this.pressed()) this.releaseListeners();
    });
    on("pointerdown", (event) => {
      if (this.disabled() || event.button !== 0 || !event.isPrimary) return;
      const pressed = this.pressed();
      this.set({ pointer: event.pointerId });
      if (!pressed) this.options.onPress?.(event);
      this.listenForRelease();
    });
    on("lostpointercapture", (event) => {
      if (this.state.get().pointer === event.pointerId) {
        this.options.onCancel?.();
        this.set({ pointer: undefined });
        if (!this.pressed()) this.releaseListeners();
      }
    });
    on("keydown", (event) => {
      if (this.disabled() || (event.key !== " " && event.key !== "Enter")) return;
      const pressed = this.pressed();
      this.set(event.key === " " ? { space: true } : { enter: true });
      if (!pressed) this.options.onPress?.(event);
      this.listenForRelease();
    });
    on("keyup", (event) => {
      if (event.key === " ") this.set({ space: false });
      else if (event.key === "Enter") this.set({ enter: false });
      if (!this.pressed()) this.releaseListeners();
    });
    on("focusin", (event) => {
      if (this.disabled()) return;
      const focused = event.composedPath()[0] as Element;
      const own = !this.options.ownFocus || focused === target;
      this.set({ focus: own && (this.options.anyFocus || focused.matches(":focus-visible")) === true, within: true });
    });
    on("focusout", () => {
      this.options.onCancel?.();
      this.set({ focus: false, within: false });
      this.endPress();
    });
  }
  private unbind(): void {
    this.options.onCancel?.();
    this.releaseListeners();
    for (const remove of this.cleanup.splice(0)) remove();
    this.state.set(empty);
    this.subscription?.unsubscribe();
    this.subscription = undefined;
  }
  detach(): void {
    this.unbind();
    this.target = undefined;
  }
  hostConnected(): void {
    this.connected = true;
    this.bind();
  }
  hostDisconnected(): void {
    this.connected = false;
    this.unbind();
  }
  hostUpdated(): void {
    if (!this.connected || !this.target || !this.disabled()) return;
    this.options.onCancel?.();
    this.releaseListeners();
    this.state.set(empty);
  }
}
