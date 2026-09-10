// Interaction states as attributes on the styled element, so styles key off plain selectors:
// data-hover (mouse and pen pointers only, never touch),
// data-active (pressed), data-focus (keyboard focus, the focus-visible rule), plus data-focus-within
// on a wrapper. Attach to the element that carries the styles: `interaction(this, el)`.
import type { ReactiveController, ReactiveControllerHost } from "lit";

export type InteractionOptions = {
  disabled?: () => boolean;
  onPress?: (e: Event) => void;
  /** data-focus on any focus, not only a visible one (a control whose rules key off `:focus`). */
  anyFocus?: boolean;
  /** data-focus only when the element itself is the focused node, never a descendant (a wrapper whose ring is its own, around a field with its own). */
  ownFocus?: boolean;
};

export class Interaction implements ReactiveController {
  private el?: HTMLElement;
  private cleanup: (() => void)[] = [];
  constructor(
    private host: ReactiveControllerHost,
    private options: InteractionOptions = {},
  ) {
    host.addController(this);
  }
  /** Binds to the styled element; call from firstUpdated or whenever the element changes. */
  attach(el: HTMLElement | null | undefined) {
    if (this.el === el) return;
    this.detach();
    if (!el) return;
    this.el = el;
    const on = <K extends keyof HTMLElementEventMap>(type: K, fn: (e: HTMLElementEventMap[K]) => void, opts?: AddEventListenerOptions) => {
      el.addEventListener(type, fn as EventListener, opts);
      this.cleanup.push(() => el.removeEventListener(type, fn as EventListener, opts));
    };
    const disabled = () => this.options.disabled?.() ?? ((el as HTMLButtonElement).disabled || el.getAttribute("aria-disabled") === "true");
    on("pointerenter", (e) => {
      if (e.pointerType !== "touch" && !disabled()) el.setAttribute("data-hover", "true");
    });
    on("pointerleave", () => {
      el.removeAttribute("data-hover");
      el.removeAttribute("data-active");
    });
    on("pointerdown", (e) => {
      if (disabled() || e.button !== 0) return;
      el.setAttribute("data-active", "true");
      const up = () => {
        el.removeAttribute("data-active");
        window.removeEventListener("pointerup", up);
        window.removeEventListener("pointercancel", up);
      };
      window.addEventListener("pointerup", up);
      window.addEventListener("pointercancel", up);
    });
    on("keydown", (e) => {
      if ((e.key === " " || e.key === "Enter") && !disabled()) el.setAttribute("data-active", "true");
    });
    on("keyup", () => el.removeAttribute("data-active"));
    // focusin/focusout bubble, so a wrapper (a label around a hidden input) sees its control's focus too.
    on("focusin", (e) => {
      const target = e.target as Element;
      const own = !this.options.ownFocus || target === el;
      if (own && (this.options.anyFocus || target.matches(":focus-visible"))) el.setAttribute("data-focus", "true");
      el.setAttribute("data-focus-within", "true");
    });
    on("focusout", () => {
      el.removeAttribute("data-focus");
      el.removeAttribute("data-focus-within");
      el.removeAttribute("data-active");
    });
  }
  detach() {
    for (const c of this.cleanup) c();
    this.cleanup = [];
    this.el = undefined;
  }
  hostDisconnected() {
    this.detach();
  }
}
