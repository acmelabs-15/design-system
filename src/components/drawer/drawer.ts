import { preventBodyScroll } from "@zag-js/remove-scroll";
import { html, nothing } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { AcmeElement, boolish, sharedCss } from "../../base";
import { atomState } from "../../shared/atom-state";
import { dialogResetCss } from "../../shared/dialog";
import { deepActive, tabbables } from "../modal/modal";
import { drawerCss } from "./drawer.styles";
import { drawerBackdropCss } from "./drawer-backdrop.styles";
import { drawerOverlayCss } from "./drawer-overlay.styles";

/** The popup's height: `max` (the viewport), a number of px, or its content's. */
export type DrawerHeight = "" | "max" | number;
/** Why the drawer asks to close: the Escape key, a press outside the popup, or a swipe down past the threshold. */
export type DrawerDismissReason = "escape" | "outside" | "swipe";

/** The entrance and the exit: the length of the popup's transform transition. */
const MOTION_MS = 500;
/** A swipe released at this speed (px per ms) or faster, downward, closes the drawer. */
const SWIPE_VELOCITY = 0.5;
/** The release speed comes from the last move within this window; an older one reads as a stop. */
const VELOCITY_WINDOW_MS = 80;
/** A move sample shorter than this counts as one frame. */
const MIN_SAMPLE_MS = 16;
/** Movement under this many px is a press, not a swipe. */
const SWIPE_START_PX = 1;
/** A swipe past this distance closes the drawer: half the popup's height, at least 10px. */
const closeThreshold = (height: number) => Math.max(0.5 * height, 10);
/** A pull up, against the open edge, is damped: it moves the square root of its distance. */
const damp = (dy: number) => (dy >= 0 ? dy : -Math.sqrt(-dy));
/** A press on one of these never starts a swipe. */
const CONTROLS = 'button, a, [role="button"], [role="menuitem"], [role="menuitemradio"], [role="menuitemcheckbox"], [role="option"], [role="tab"]';
/** The keyboard's inset is padded under the popup once it is taller than this. */
const KEYBOARD_MIN_PX = 50;

const heightAttr = {
  fromAttribute: (v: string | null): DrawerHeight => (v === null || v === "" ? "" : v === "max" ? "max" : Number.isFinite(Number(v)) ? Number(v) : ""),
  toAttribute: (v: DrawerHeight) => (v === "" ? null : String(v)),
};

/**
 * Drawer: a bottom sheet for small viewports. The native dialog opens in the top layer (focus stays
 * inside it, the page behind is inert), the page stops scrolling, the black 40% backdrop fades in and
 * the full-width popup slides up from the bottom edge, rounded at the top, capped at 80% of the
 * viewport; `height` fixes it (a number of px, or `max` for the whole viewport). The slotted content
 * scrolls inside the popup (`vertical-scroll="false"` clips it instead); `heading` puts a title above
 * it. A swipe down follows the pointer and closes the drawer when released fast, or past half the
 * popup's height; a shorter one springs back. Escape and a press outside ask to close too, all
 * through the cancelable `acme-dismiss`; a request during the entrance waits. On close the popup
 * slides out, then `acme-close` fires and focus returns to the opener. `nested` raises it above an
 * open modal; `reset-scroll` scrolls the popup to its top whenever it changes; `acme-scroll` fires as
 * the popup scrolls.
 */
@customElement("acme-drawer")
export class AcmeDrawer extends AcmeElement {
  static styles = [sharedCss, dialogResetCss, drawerOverlayCss, drawerBackdropCss, drawerCss];
  /** Open state; `show()` and `close()` set it. */
  @property({ type: Boolean, reflect: true }) open = false;
  /** The title above the content; the dialog is labelled by it. */
  @property() heading = "";
  /** The popup's height: `max` (the viewport) or a number of px; unset, its content's, capped at 80% of the viewport. */
  @property({ converter: heightAttr }) height: DrawerHeight = "";
  /** `vertical-scroll="false"` clips the popup's content instead of scrolling it. */
  @property({ converter: boolish, attribute: "vertical-scroll" }) verticalScroll = true;
  /** The drawer opens from inside a modal: it sits one layer above it. */
  @property({ type: Boolean }) nested = false;
  /** Any change scrolls the popup back to its top. */
  @property({ attribute: "reset-scroll" }) resetScroll = "";
  /** The popup is on screen at its resting place (false during the entrance and the exit). */
  @atomState() private rendered = false;
  /** The dialog is open (the exit keeps it open until the drawer leaves). */
  @atomState() private mounted = false;
  /** The entrance has ended: a request to close is taken up. */
  @atomState() private entered = false;
  /** The pointer is swiping the popup. */
  @atomState() private swiping = false;
  /** The keyboard's inset under the popup, in px. */
  @atomState() private keyboard = 0;
  @query("dialog") private dialog!: HTMLDialogElement;
  @query(".drawer") private panel!: HTMLElement;
  private opener: HTMLElement | null = null;
  private unlock?: () => void;
  private exit?: ReturnType<typeof setTimeout>;
  private enter?: ReturnType<typeof setTimeout>;
  private viewport?: VisualViewport;
  /** The swipe in progress: where it started, the last move, the pointer that holds it. */
  private swipe: { y0: number; y: number; time: number; last: { y: number; time: number } | null; pointerId: number | null; touch: boolean } | null = null;

  show() {
    this.open = true;
  }
  close() {
    this.open = false;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    clearTimeout(this.exit);
    clearTimeout(this.enter);
    this.unwatchKeyboard();
    this.unlock?.();
    this.unlock = undefined;
  }

  /** Asks to close: the cancelable `acme-dismiss` event, then the exit. A request during the entrance is dropped. */
  private dismiss(reason: DrawerDismissReason) {
    if (!this.entered) return;
    const ok = this.dispatchEvent(new CustomEvent<{ reason: DrawerDismissReason }>("acme-dismiss", { detail: { reason }, bubbles: true, composed: true, cancelable: true }));
    if (ok) this.close();
  }

  private onCancel = (e: Event) => {
    e.preventDefault();
    this.dismiss("escape");
  };

  /** The dialog closed on its own (a second Escape the platform no longer lets us cancel): the drawer leaves at once. */
  private onNativeClose = () => {
    if (this.open) this.open = false;
    else if (this.mounted) this.unmount();
  };

  /** A press on the backdrop or the viewport around the popup. */
  private onOutsidePress = (e: PointerEvent) => {
    if (e.target === this.dialog) this.dismiss("outside");
  };

  private onScroll = () => {
    this.dispatchEvent(new CustomEvent<{ scrollTop: number }>("acme-scroll", { detail: { scrollTop: this.panel.scrollTop }, bubbles: true, composed: true }));
  };

  /* ---- the swipe ---- */

  /** Whether a press here may start a swipe: not on a control, and not inside content scrolled away from its top. */
  private canSwipe(e: Event) {
    const path = e.composedPath();
    const end = path.indexOf(this.panel);
    if (end < 0) return false;
    for (const n of path.slice(0, end + 1)) {
      if (!(n instanceof Element)) continue;
      if (n.matches(CONTROLS)) return false;
      if (n.scrollTop > 0) return false;
    }
    return true;
  }

  private begin(y: number, time: number, pointerId: number | null, touch: boolean) {
    this.swipe = { y0: y, y, time, last: null, pointerId, touch };
  }

  /** The popup follows the pointer: down as it moves, up only a little; the transition waits until release. */
  private move(y: number, time: number) {
    const s = this.swipe;
    if (!s) return;
    s.last = { y: s.y, time: s.time };
    s.y = y;
    s.time = time;
    const dy = y - s.y0;
    if (!this.swiping) {
      if (Math.abs(dy) < SWIPE_START_PX) return;
      this.swiping = true;
      this.dialog.setAttribute("data-swiping", "");
    }
    this.panel.style.transition = "none";
    this.panel.style.setProperty("--drawer-swipe-movement-y", `${damp(dy)}px`);
  }

  /** Released: past the threshold or fast enough, the drawer closes; else the popup springs back. */
  private end(time: number) {
    const s = this.swipe;
    this.swipe = null;
    if (!s || !this.swiping) return;
    this.swiping = false;
    this.dialog.removeAttribute("data-swiping");
    const dy = s.y - s.y0;
    // The release speed is the last move's own, if the release follows it within the window.
    let velocity = 0;
    if (s.last && time - s.time <= VELOCITY_WINDOW_MS) velocity = (s.y - s.last.y) / Math.max(s.time - s.last.time, MIN_SAMPLE_MS);
    this.panel.style.removeProperty("transition");
    if (dy > 0 && (velocity >= SWIPE_VELOCITY || dy > closeThreshold(this.panel.offsetHeight))) {
      // The exit runs from where the popup is: the swipe's offset stays until it leaves.
      this.dismiss("swipe");
      if (!this.open) return;
    }
    this.panel.style.removeProperty("--drawer-swipe-movement-y");
  }

  private onPointerDown = (e: PointerEvent) => {
    if (e.pointerType === "touch" || e.button !== 0 || !this.canSwipe(e)) return;
    this.begin(e.clientY, e.timeStamp, e.pointerId, false);
    try {
      this.panel.setPointerCapture(e.pointerId);
    } catch {
      // A pointer the platform does not track (a synthetic event): the moves still reach the popup.
    }
  };
  private onPointerMove = (e: PointerEvent) => {
    if (this.swipe && !this.swipe.touch && e.pointerId === this.swipe.pointerId) this.move(e.clientY, e.timeStamp);
  };
  private onPointerUp = (e: PointerEvent) => {
    if (this.swipe && !this.swipe.touch && e.pointerId === this.swipe.pointerId) this.end(e.timeStamp);
  };
  private onTouchStart = (e: TouchEvent) => {
    if (e.touches.length !== 1 || !this.canSwipe(e)) return;
    this.begin(e.touches[0].clientY, e.timeStamp, null, true);
  };
  /** Once the swipe is on, the touch moves the popup, not the page or the content. */
  private onTouchMove = (e: TouchEvent) => {
    if (!this.swipe?.touch) return;
    this.move(e.touches[0].clientY, e.timeStamp);
    if (this.swiping && e.cancelable) e.preventDefault();
  };
  private onTouchEnd = (e: TouchEvent) => {
    if (this.swipe?.touch) this.end(e.timeStamp);
  };

  /* ---- the keyboard inset ---- */

  private watchKeyboard() {
    const vv = typeof window !== "undefined" ? window.visualViewport : null;
    if (!vv) return;
    this.viewport = vv;
    vv.addEventListener("resize", this.onViewport);
    vv.addEventListener("scroll", this.onViewport);
    this.onViewport();
  }
  private unwatchKeyboard() {
    this.viewport?.removeEventListener("resize", this.onViewport);
    this.viewport?.removeEventListener("scroll", this.onViewport);
    this.viewport = undefined;
    this.keyboard = 0;
  }
  private onViewport = () => {
    const vv = this.viewport;
    if (!vv) return;
    const inset = window.innerHeight - vv.height - vv.offsetTop;
    this.keyboard = inset > KEYBOARD_MIN_PX ? inset : 0;
  };

  /* ---- open and close ---- */

  /** Focus on open: the first tabbable element in the popup, else the popup. */
  private focusInitial() {
    const panel = this.panel;
    if (!panel) return;
    (tabbables(panel)[0] ?? panel).focus({ preventScroll: true });
  }

  /** The drawer leaves: the dialog closes, the page scrolls again, focus returns to the opener. */
  private unmount() {
    clearTimeout(this.exit);
    this.exit = undefined;
    this.mounted = false;
    this.rendered = false;
    this.entered = false;
    this.swipe = null;
    this.swiping = false;
    if (this.dialog?.open) this.dialog.close();
    this.unwatchKeyboard();
    this.unlock?.();
    this.unlock = undefined;
    this.opener?.focus?.();
    this.opener = null;
    this.dispatchEvent(new CustomEvent("acme-close", { bubbles: true, composed: true }));
  }

  willUpdate(ch: Map<string, unknown>) {
    if (ch.has("open") && this.open) {
      clearTimeout(this.exit);
      this.exit = undefined;
      this.mounted = true;
    }
  }

  updated(ch: Map<string, unknown>) {
    if (ch.has("resetScroll") && this.panel) this.panel.scrollTop = 0;
    if (!ch.has("open")) return;
    if (this.open) {
      this.opener = deepActive();
      if (!this.dialog.open) this.dialog.showModal();
      this.unlock ??= preventBodyScroll();
      this.panel.scrollTop = 0;
      this.focusInitial();
      this.watchKeyboard();
      // The entrance: the popup is laid out at its start (below the edge, the backdrop clear), then
      // shown, so the transition runs from that start; a request to close waits until it has ended.
      void this.dialog.offsetWidth;
      this.rendered = true;
      clearTimeout(this.enter);
      this.enter = setTimeout(() => {
        this.enter = undefined;
        this.entered = true;
      }, MOTION_MS);
      this.dispatchEvent(new CustomEvent("acme-open", { bubbles: true, composed: true }));
    } else if (this.mounted) {
      clearTimeout(this.enter);
      this.enter = undefined;
      this.rendered = false;
      this.entered = false;
      this.exit = setTimeout(() => this.unmount(), MOTION_MS);
    }
  }

  private panelStyle() {
    const h = this.height;
    return h === "max" ? { height: "100dvh", maxHeight: "100dvh" } : typeof h === "number" ? { height: `${h}px` } : {};
  }

  render() {
    // The starting and ending frames of the transition.
    const starting = this.mounted && !this.rendered && this.open;
    const ending = this.mounted && !this.rendered && !this.open;
    const panel = html`<div
      class=${this.cls("drawer", { noscroll: !this.verticalScroll, max: this.height === "max" })}
      role="dialog"
      aria-modal="true"
      aria-labelledby=${this.heading ? "title" : nothing}
      tabindex="-1"
      style=${styleMap(this.panelStyle())}
      ?data-starting-style=${starting}
      ?data-ending-style=${ending}
      ?data-swiping=${this.swiping}
      data-swipe-direction=${this.swiping ? "down" : nothing}
      @scroll=${this.onScroll}
      @pointerdown=${this.onPointerDown}
      @pointermove=${this.onPointerMove}
      @pointerup=${this.onPointerUp}
      @pointercancel=${this.onPointerUp}
      @touchstart=${this.onTouchStart}
      @touchmove=${this.onTouchMove}
      @touchend=${this.onTouchEnd}
      @touchcancel=${this.onTouchEnd}
      part="drawer"
    >${this.heading ? html`<h2 class="title" id="title">${this.heading}</h2>` : nothing}<slot></slot></div>`;
    return html`<dialog
      class=${this.cls("dialog", { nested: this.nested })}
      style=${styleMap(this.keyboard ? { paddingBottom: `${this.keyboard}px` } : {})}
      ?data-starting-style=${starting}
      ?data-ending-style=${ending}
      @cancel=${this.onCancel}
      @close=${this.onNativeClose}
      @pointerdown=${this.onOutsidePress}
      part="dialog"
    >${this.mounted ? panel : nothing}</dialog>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-drawer": AcmeDrawer;
  }
}
