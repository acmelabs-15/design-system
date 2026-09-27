import { createAtom } from "@tanstack/lit-store";
import type { ReactiveController, ReactiveElement } from "lit";

type Press = Readonly<{ pointer: number; direction: 1 | -1; changed: boolean; target: HTMLElement }>;
/** Owns one pointer hold, its repeat timer and all release paths. */
export class PressRepeat implements ReactiveController {
  private readonly current = createAtom<Press | undefined>(undefined);
  private timer?: number;
  private window?: Window;
  private cleanup?: () => void;
  constructor(
    private host: ReactiveElement,
    private options: { disabled(): boolean; repeat(): boolean; step(direction: 1 | -1): boolean; commit(): void; focus(): void },
  ) {
    host.addController(this);
  }
  start(event: PointerEvent, direction: 1 | -1): void {
    if (event.defaultPrevented || event.button !== 0 || this.options.disabled() || this.current.get() || !this.host.isConnected) {
      return;
    }
    event.preventDefault();
    this.options.focus();
    if (!this.host.isConnected) {
      return;
    }
    this.current.set({ pointer: event.pointerId, direction, changed: false, target: event.currentTarget as HTMLElement });
    const changed = this.options.step(direction),
      press = this.current.get();
    if (!press || !this.host.isConnected) {
      return;
    }
    this.current.set({ ...press, changed });
    if (this.options.disabled()) {
      this.stop();
      return;
    }
    const target = event.currentTarget as HTMLElement,
      document = this.host.ownerDocument,
      win = document.defaultView!;
    this.window = win;
    const release = (event: Event) => {
      if ("pointerId" in event && (event as PointerEvent).pointerId !== this.current.get()?.pointer) {
        return;
      }
      this.stop();
    };
    const hidden = () => {
      if (document.hidden) {
        this.stop();
      }
    };
    win.addEventListener("pointerup", release);
    win.addEventListener("pointercancel", release);
    win.addEventListener("blur", release);
    target.addEventListener("pointerleave", release);
    document.addEventListener("visibilitychange", hidden);
    this.cleanup = () => {
      win.removeEventListener("pointerup", release);
      win.removeEventListener("pointercancel", release);
      win.removeEventListener("blur", release);
      target.removeEventListener("pointerleave", release);
      document.removeEventListener("visibilitychange", hidden);
    };
    if (this.options.repeat()) {
      this.timer = win.setTimeout(this.tick, 300);
    }
  }
  private tick = () => {
    const press = this.current.get();
    if (!press) {
      return;
    }
    if (this.options.disabled() || !this.host.isConnected || !press.target.isConnected || !this.options.repeat()) {
      this.stop();
      return;
    }
    const changed = this.options.step(press.direction);
    if (!this.current.get() || !this.host.isConnected) {
      return;
    }
    if (!changed) {
      this.stop();
      return;
    }
    this.current.set({ ...press, changed: true });
    this.timer = this.window!.setTimeout(this.tick, 50);
  };
  stop(target?: HTMLElement): void {
    const press = this.current.get();
    if (target && press?.target !== target) {
      return;
    }
    this.current.set(() => undefined);
    if (this.timer !== undefined) {
      this.window?.clearTimeout(this.timer);
    }
    this.timer = undefined;
    this.cleanup?.();
    this.cleanup = undefined;
    this.window = undefined;
    if (press?.changed) {
      this.options.commit();
    }
  }
  hostDisconnected() {
    this.stop();
  }
}
