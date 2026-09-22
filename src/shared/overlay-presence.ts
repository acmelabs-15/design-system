import { createAtom, type ReadonlyAtom } from "@tanstack/lit-store";
import { preventBodyScroll } from "@zag-js/remove-scroll";
import type { ReactiveController, ReactiveControllerHost } from "lit";
import { bindThemeContext, type ThemeContextBinding } from "./theme-context";
import { coordinateOverlay, type OverlayDismissReason } from "./overlay-coordination";
import { deepActiveElement } from "./composed-tree";

export type OverlayPhase = "closed" | "open" | "closing";
export type OverlayPresenceOptions = {
  surface(): HTMLElement;
  mode(): "modal" | "dialog" | "popover";
  closeOnEscape(): boolean;
  closeOnOutside(): boolean;
  dismiss(reason: OverlayDismissReason, event?: Event): void;
  after(phase: "open" | "closed"): void;
};

/** Keeps native modality and resources alive through only the exit animations it owns. */
export class OverlayPresence implements ReactiveController {
  private readonly current = createAtom<OverlayPhase>("closed");
  readonly phase: ReadonlyAtom<OverlayPhase> = createAtom(() => this.current.get());
  private epoch = 0;
  private animations: readonly Animation[] = [];
  private release?: () => void;
  private surface?: HTMLElement;
  private opener?: HTMLElement;
  private themeBinding?: ThemeContextBinding;
  get theme(): ThemeContextBinding | undefined {
    return this.themeBinding;
  }
  constructor(
    host: ReactiveControllerHost,
    private options: OverlayPresenceOptions,
  ) {
    host.addController(this);
  }

  show(opener?: HTMLElement): void {
    this.epoch++;
    for (const animation of this.animations) animation.cancel();
    this.animations = [];
    if (this.current.get() === "open") return;
    if (this.current.get() === "closing") {
      this.current.set("open");
      this.options.after("open");
      return;
    }
    const surface = this.options.surface(),
      document = surface.ownerDocument,
      mode = this.options.mode();
    if (!surface.isConnected) throw new Error("An overlay surface must be connected before opening");
    if (mode !== "popover" && surface.localName !== "dialog") throw new Error("Dialog presence requires a native dialog surface");
    const focused = deepActiveElement(document);
    this.opener = opener ?? (focused && focused !== document.body && focused !== document.documentElement && "focus" in focused ? (focused as HTMLElement) : undefined);
    this.surface = surface;
    const cleanups: (() => void)[] = [];
    this.release = () => {
      const errors: unknown[] = [];
      for (const cleanup of cleanups.splice(0).reverse()) {
        try {
          cleanup();
        } catch (error) {
          errors.push(error);
        }
      }
      if (errors.length) throw new AggregateError(errors, "Overlay cleanup failed");
    };
    try {
      if (this.opener) {
        this.themeBinding = bindThemeContext(this.opener);
        cleanups.push(() => {
          this.themeBinding?.release();
          this.themeBinding = undefined;
        });
      }
      if (mode === "popover") {
        surface.popover = "manual";
        surface.showPopover();
        cleanups.push(() => {
          if (surface.matches(":popover-open")) surface.hidePopover();
        });
      } else {
        const dialog = surface as HTMLDialogElement;
        if (mode === "modal") dialog.showModal();
        else dialog.show();
        cleanups.push(() => {
          if (dialog.open) dialog.close();
        });
      }
      if (mode === "modal") cleanups.push(preventBodyScroll(document));
      cleanups.push(
        coordinateOverlay({
          surface,
          anchor: this.opener,
          closeOnEscape: this.options.closeOnEscape,
          closeOnOutside: this.options.closeOnOutside,
          dismiss: this.options.dismiss,
          ownerRemoved: () => this.finish(false),
        }),
      );
      this.current.set("open");
      this.options.after("open");
    } catch (error) {
      this.finish(false);
      throw error;
    }
  }

  async hide(animations: readonly Animation[] = [], returnFocus = true): Promise<void> {
    if (this.current.get() === "closed") return;
    const epoch = ++this.epoch;
    for (const animation of this.animations) animation.cancel();
    this.animations = [...animations];
    this.current.set("closing");
    const reduced = this.surface?.ownerDocument.defaultView?.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduced && animations.length) await Promise.allSettled(animations.map((animation) => animation.finished));
    if (epoch !== this.epoch) return;
    this.finish(returnFocus);
  }
  private finish(returnFocus: boolean): void {
    this.epoch++;
    for (const animation of this.animations) animation.cancel();
    this.animations = [];
    const wasOpen = this.current.get() !== "closed";
    let failure: unknown;
    try {
      this.release?.();
    } catch (error) {
      failure = error;
    }
    this.release = undefined;
    this.surface = undefined;
    this.current.set("closed");
    if (returnFocus && this.opener?.isConnected) this.opener.focus();
    this.opener = undefined;
    if (wasOpen) this.options.after("closed");
    if (failure) throw failure;
  }
  hostDisconnected(): void {
    this.finish(false);
  }
}
