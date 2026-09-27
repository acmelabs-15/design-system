import type { ReactiveController, ReactiveElement } from "lit";
import { focusable } from "tabbable";
import { OverlayPresence } from "./overlay-presence";
import { SpringValue } from "./spring-value";
import { readMotionSpring } from "./motion-spring";
import { composedContains, deepActiveElement } from "./composed-tree";
import { focusSection } from "./focus-recovery";
import { StoreSelector } from "./store-connection";
import type { DialogFocusTarget, DialogReason } from "./dialog-context";
import type { ThemeScope } from "./theme-scope";

type DialogState = {
  open: boolean;
  modal: boolean;
  alert: boolean;
  closeOnEscape: boolean;
  closeOnOutside: boolean;
  initialFocus: DialogFocusTarget;
  returnFocus: DialogFocusTarget;
  reason: DialogReason;
};
type Options = {
  state(): DialogState;
  surface(): HTMLDialogElement | undefined;
  body(): HTMLElement | undefined;
  focusArea?(): HTMLElement | undefined;
  fallback(): HTMLElement | undefined;
  heading(): HTMLElement | undefined;
  cancel(): HTMLElement | undefined;
  requestClose(reason: DialogReason): void;
  nativeClosed(): void;
};
/** Connects a component's intended state to the existing native presence and motion controllers. */
export class DialogLifetime implements ReactiveController {
  readonly presence: OverlayPresence;
  private readonly motion: SpringValue;
  private readonly spatial: SpringValue;
  private readonly phaseUpdates: StoreSelector<unknown>;
  private opener?: HTMLElement;
  private requestedOpener?: HTMLElement;
  private nativeMode?: boolean;
  private cachedTheme?: ThemeScope;
  private epoch = 0;
  private opening = false;
  private suppressNative = false;
  private notifiedOpen = false;
  private releaseFocus?: () => void;
  private closing = false;
  constructor(
    private host: ReactiveElement,
    private options: Options,
  ) {
    host.addController(this);
    this.presence = new OverlayPresence(host, {
      surface: () => options.surface()!,
      mode: () => (options.state().modal ? "modal" : "dialog"),
      parentFrom: "surface",
      anchorMustRemainConnected: false,
      closeOnEscape: () => options.state().open && options.state().closeOnEscape,
      closeOnOutside: () => options.state().open && options.state().closeOnOutside,
      dismiss: (reason) => options.requestClose(reason),
      after: (phase) => {
        if (phase === "closed" && !this.suppressNative) {
          options.nativeClosed();
          this.after("close");
        }
      },
    });
    this.motion = new SpringValue(
      host,
      () => (options.state().open ? 1 : 0),
      () => readMotionSpring(options.surface() ?? host, "standard", "effects", "fast"),
    );
    this.spatial = new SpringValue(
      host,
      () => (options.state().open ? 1 : 0),
      () => readMotionSpring(options.surface() ?? host, "standard", "spatial", "fast"),
    );
    this.phaseUpdates = new StoreSelector(host, () => this.presence.phase);
  }
  get active() {
    return this.presence.phase.get() !== "closed";
  }
  get themeReference() {
    return this.opener;
  }
  get theme(): ThemeScope | undefined {
    return this.presence.phase.get() === "closed" ? undefined : (this.presence.theme?.scope ?? this.cachedTheme);
  }
  openingFrom(opener?: HTMLElement) {
    this.requestedOpener = opener;
  }
  private resolve(value: DialogFocusTarget): Element | undefined {
    if (typeof value !== "string") {
      return value;
    }
    try {
      return this.host.querySelector(value) ?? this.host.renderRoot?.querySelector(value) ?? (this.host.getRootNode() as Document | ShadowRoot).querySelector(value) ?? undefined;
    } catch {
      console.warn(this.host.localName, { code: "invalid-focus-selector" });
      return undefined;
    }
  }
  private focusTarget(target: Element | undefined): boolean {
    if (!target?.isConnected || !("focus" in target)) {
      return false;
    }
    (target as HTMLElement).focus();
    const active = deepActiveElement(target.ownerDocument);
    return !!active && composedContains(target, active);
  }
  focus() {
    const surface = this.options.surface();
    if (!surface?.open) {
      return;
    }
    const state = this.options.state(),
      explicit = this.resolve(state.initialFocus);
    if (explicit && composedContains(surface, explicit) && this.focusTarget(explicit)) {
      return;
    }
    if (state.alert) {
      if (this.focusTarget(this.options.cancel())) {
        return;
      }
    } else {
      const body = this.options.focusArea?.() ?? this.options.body();
      const first = body ? focusable(body, { getShadowRoot: true }).find((target) => !this.options.cancel() || target !== this.options.cancel()) : undefined;
      if (this.focusTarget(first)) {
        return;
      }
    }
    if (!this.focusTarget(this.options.heading())) {
      this.focusTarget(surface);
    }
  }
  private restore(external?: Element | null) {
    if (external?.isConnected && this.focusTarget(external)) {
      return;
    }
    if (this.focusTarget(this.resolve(this.options.state().returnFocus))) {
      return;
    }
    if (this.focusTarget(this.opener)) {
      return;
    }
    const fallback = this.options.fallback();
    if (fallback) {
      this.releaseFocus = focusSection(fallback, this.options.heading() ? [this.options.heading()!] : []);
    }
  }
  private after(phase: "open" | "close") {
    if (!this.host.isConnected) {
      return;
    }
    const detail = Object.freeze({ reason: this.options.state().reason });
    const notify = () => {
      if (this.host.isConnected) {
        this.host.dispatchEvent(new CustomEvent("acme-after-" + phase, { detail, bubbles: true, composed: true }));
      }
    };
    if (phase === "close") {
      queueMicrotask(notify);
    } else {
      notify();
    }
  }
  hostUpdate() {
    this.motion.update();
    this.spatial.update();
  }
  hostUpdated() {
    const surface = this.options.surface();
    if (!surface || !this.host.isConnected) {
      return;
    }
    const state = this.options.state(),
      body = this.options.body();
    surface.style.setProperty("--_dialog-progress", String(Math.max(0, Math.min(1, this.motion.value))));
    surface.style.setProperty("--_dialog-spatial", String(this.spatial.value));
    if (state.open) {
      this.closing = false;
      if (body) {
        body.inert = false;
      }
      if (surface.open && this.nativeMode !== state.modal) {
        const focused = deepActiveElement(this.host.ownerDocument);
        this.cachedTheme = this.presence.theme?.scope ?? this.cachedTheme;
        this.suppressNative = true;
        if (body) {
          body.inert = true;
        }
        try {
          void this.presence.hide([], false);
          this.presence.show(this.opener?.isConnected ? this.opener : undefined);
          this.nativeMode = state.modal;
        } catch (error) {
          this.options.nativeClosed();
          throw error;
        } finally {
          this.suppressNative = false;
          if (body) {
            body.inert = false;
          }
        }
        if (focused && composedContains(surface, focused)) {
          this.focusTarget(focused);
        } else {
          this.focus();
        }
      }
      if (this.presence.phase.get() === "closed" && !this.opening) {
        this.opening = true;
        const epoch = ++this.epoch;
        const theme = this.host.renderRoot.querySelector("acme-overlay-theme") as HTMLElement & { updateComplete?: Promise<unknown> };
        void Promise.resolve(theme?.updateComplete).then(() => {
          this.opening = false;
          if (epoch !== this.epoch || !this.host.isConnected || !this.options.state().open) {
            return;
          }
          const active = deepActiveElement(this.host.ownerDocument);
          this.opener = this.requestedOpener?.isConnected
            ? this.requestedOpener
            : active?.isConnected && active !== this.host.ownerDocument.body && "focus" in active
              ? (active as HTMLElement)
              : undefined;
          this.requestedOpener = undefined;
          // Keep native opening focus away from application actions until the chosen target is ready.
          if (body) {
            body.inert = true;
          }
          this.presence.show(this.opener);
          this.cachedTheme = this.presence.theme?.scope;
          this.nativeMode = this.options.state().modal;
          if (body) {
            body.inert = false;
          }
          this.focus();
          this.host.requestUpdate();
        });
      }
      if (surface.open && this.motion.settled && this.spatial.settled && !this.notifiedOpen) {
        this.notifiedOpen = true;
        this.after("open");
      }
    } else {
      this.epoch++;
      this.opening = false;
      this.notifiedOpen = false;
      if (surface.open && !this.closing) {
        this.closing = true;
        const active = deepActiveElement(this.host.ownerDocument);
        if (active && composedContains(surface, active)) {
          surface.focus({ preventScroll: true });
        }
      }
      if (body) {
        body.inert = true;
      }
      if (this.motion.settled && this.presence.phase.get() !== "closed") {
        const active = deepActiveElement(this.host.ownerDocument),
          external = active && active !== this.host.ownerDocument.body && !composedContains(surface, active) ? active : undefined;
        void this.presence.hide([], false);
        this.restore(external);
        this.opener = undefined;
        this.cachedTheme = undefined;
      }
    }
  }
  nativeClose = () => {
    if (this.suppressNative || this.options.surface()?.open || this.presence.phase.get() === "closed") {
      return;
    }
    this.options.nativeClosed();
    void this.presence.hide([], false);
    this.restore();
    this.opener = undefined;
  };
  cancel = (event: Event) => {
    event.preventDefault();
    if (this.options.state().open && this.options.state().closeOnEscape) {
      this.options.requestClose("escape");
    }
  };
  hostDisconnected() {
    this.epoch++;
    this.opening = false;
    this.notifiedOpen = false;
    this.opener = undefined;
    this.requestedOpener = undefined;
    this.cachedTheme = undefined;
    this.releaseFocus?.();
    this.releaseFocus = undefined;
  }
}
