import { arrow, flip, offset, type Placement, shift, size } from "@floating-ui/dom";
import type { ReactiveController, ReactiveElement } from "lit";
import { composedContains, deepActiveElement } from "./composed-tree";
import { readMotionSpring } from "./motion-spring";
import { OverlayPlacement } from "./overlay-placement";
import { OverlayPresence } from "./overlay-presence";
import { SpringValue } from "./spring-value";
import { StoreSelector } from "./store-connection";
export type HelpSide = "top" | "bottom" | "left" | "right";
export type HelpAlign = "start" | "center" | "end";
type Options = {
  open(): boolean;
  anchor(): HTMLElement | undefined;
  surface(): HTMLElement | undefined;
  arrow(): HTMLElement | undefined;
  placement(): { side: HelpSide; align: HelpAlign; sideOffset: number };
  closeOnEscape(): boolean;
  closeOnOutside(): boolean;
  dismiss(reason: string): void;
  closed(): void;
  opened(): void;
  restoreFocus(): boolean;
  constrainHeight?: boolean;
};
/** Owns native anchored presence, current geometry and one effects spring. */
export class AnchoredHelp implements ReactiveController {
  readonly presence: OverlayPresence;
  private readonly positioning: OverlayPlacement;
  private readonly motion: SpringValue;
  private readonly updates: StoreSelector<unknown>;
  private anchor?: HTMLElement;
  private opening = false;
  private epoch = 0;
  private suppressClosed = false;
  private closing = false;
  private returnOnClose = false;
  constructor(
    private host: ReactiveElement,
    private options: Options,
  ) {
    host.addController(this);
    this.presence = new OverlayPresence(host, {
      surface: () => options.surface()!,
      mode: () => "popover",
      closeOnEscape: () => options.open() && options.closeOnEscape(),
      closeOnOutside: () => options.open() && options.closeOnOutside(),
      dismiss: (reason) => options.dismiss(reason),
      after: (phase) => {
        if (phase === "closed") {
          this.positioning?.stop();
          if (!this.suppressClosed) options.closed();
        }
      },
    });
    this.motion = new SpringValue(
      host,
      () => (options.open() ? 1 : 0),
      () => readMotionSpring(options.surface() ?? host, "standard", "effects", "fast"),
    );
    this.updates = new StoreSelector(host, () => this.presence.phase);
    this.positioning = new OverlayPlacement(host, {
      configuration: () => {
        const { side, align, sideOffset } = options.placement();
        return {
          strategy: "fixed",
          placement: (side + (align === "center" ? "" : "-" + align)) as Placement,
          middleware: [
            offset(sideOffset),
            flip({ padding: 8, boundary: [] }),
            shift({ padding: 8, boundary: [] }),
            ...(options.constrainHeight
              ? [
                  size({
                    padding: 8,
                    boundary: [],
                    apply({ availableHeight, elements }) {
                      elements.floating.style.setProperty("--_help-available-height", `${Math.max(0, availableHeight)}px`);
                    },
                  }),
                ]
              : []),
            ...(options.arrow() ? [arrow({ element: options.arrow()!, padding: 8 })] : []),
          ],
        };
      },
      apply: (result) => {
        const surface = options.surface();
        if (!surface) return;
        surface.style.setProperty("--_help-x", `${result.x}px`);
        surface.style.setProperty("--_help-y", `${result.y}px`);
        surface.dataset.side = result.placement.split("-")[0];
        const indicator = options.arrow();
        if (indicator) {
          indicator.style.setProperty("--_help-arrow-x", `${result.middlewareData.arrow?.x ?? 0}px`);
          indicator.style.setProperty("--_help-arrow-y", `${result.middlewareData.arrow?.y ?? 0}px`);
        }
      },
      error: (error) => {
        options.closed();
        console.error(host.localName, error);
      },
    });
  }
  get active() {
    return this.presence.phase.get() !== "closed";
  }
  get theme() {
    return this.presence.theme?.scope.effective;
  }
  get reference() {
    return this.anchor;
  }
  hostUpdate() {
    this.motion.update();
  }
  hostUpdated() {
    const surface = this.options.surface();
    if (!surface || !this.host.isConnected) return;
    surface.style.setProperty("--_help-opacity", String(Math.max(0, Math.min(1, this.motion.value))));
    if (this.options.open()) {
      this.closing = false;
      this.returnOnClose = false;
      const anchor = this.options.anchor();
      if (!anchor?.isConnected) {
        this.options.closed();
        return;
      }
      surface.inert = false;
      if (this.active && anchor !== this.anchor) {
        this.suppressClosed = true;
        void this.presence.hide([], false);
        this.suppressClosed = false;
        this.anchor = undefined;
      }
      if (!this.active && !this.opening) {
        this.opening = true;
        const epoch = ++this.epoch;
        const theme = this.host.renderRoot.querySelector("acme-overlay-theme") as HTMLElement & { updateComplete?: Promise<unknown> };
        void Promise.resolve(theme?.updateComplete).then(() => {
          this.opening = false;
          if (epoch !== this.epoch || !this.host.isConnected || !this.options.open() || !anchor.isConnected) return;
          this.anchor = anchor;
          this.presence.show(anchor);
          this.positioning.start(anchor, surface);
          this.options.opened();
          this.host.requestUpdate();
        });
      } else if (this.active) this.positioning.refresh();
    } else {
      this.epoch++;
      this.opening = false;
      const active = deepActiveElement(this.host.ownerDocument);
      if (!this.closing) {
        this.closing = true;
        this.returnOnClose = this.options.restoreFocus() && !!active && composedContains(surface, active);
      }
      const restore = this.returnOnClose && (!active || active === this.host.ownerDocument.body || composedContains(surface, active));
      surface.inert = true;
      if (this.active && this.motion.settled) {
        void this.presence.hide([], restore);
        this.anchor = undefined;
      }
    }
  }
  hostDisconnected() {
    this.epoch++;
    this.opening = false;
    this.anchor = undefined;
    this.positioning.stop();
  }
}
