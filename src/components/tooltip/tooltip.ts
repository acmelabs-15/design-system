import { arrow, autoUpdate, computePosition, flip, offset, shift } from "@floating-ui/dom";
import { css, html, nothing, svg } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { AcmeElement, boolish, sharedCss } from "../../base";
import { atomState } from "../../shared/atom-state";
import { tooltipCss } from "./tooltip.styles";
import { tooltipBackdropCss } from "./tooltip-backdrop.styles";
import { tooltipTriggerCss } from "./tooltip-trigger.styles";

/** Where the bubble opens; `auto` picks top or bottom by the trigger's place in the viewport. */
export type TooltipPosition = "auto" | "top" | "bottom" | "left" | "right";
/** Where the bubble sits along a top or bottom trigger; `auto` moves it inward near a viewport edge. */
export type TooltipAlign = "auto" | "left" | "center" | "right";
export type TooltipVariant = "" | "success" | "error" | "warning" | "violet";
type Side = "top" | "bottom" | "left" | "right";
type Align = "left" | "center" | "right";

/** The bits of `shown`: opened by hover or keyboard, by a sticky focus, by a touch. */
const HOVER = 1;
const FOCUS = 2;
const TOUCH = 4;
const ALL = 7;
/** Space between the trigger and the bubble. */
const GAP = 10;
/** A pointer that leaves the trigger closes the bubble this long after. */
const LEAVE_MS = 100;
/** A touch that travels this far is a scroll, not a tap. */
const TAP_PX = 16;
/** The trigger is measured again this long after the window stops resizing. */
const RESIZE_MS = 150;
/** Within this distance of a viewport edge, an `auto` alignment moves the bubble inward. */
const EDGE = 100;
/** Focusable content in the trigger: a touch there is the content's, not the bubble's. */
const FOCUSABLE = "a[href],input,button,select";
/** The arrow glyph per side: 14 by 6 pointing down or up, 6 by 14 pointing right or left. */
const GLYPH: Record<Side, { w: number; h: number; d: string }> = {
  top: {
    w: 14,
    h: 6,
    d: "M13.8284 0H0.17157C0.702003 0 1.21071 0.210714 1.58578 0.585787L5.58578 4.58579C6.36683 5.36684 7.63316 5.36683 8.41421 4.58579L12.4142 0.585786C12.7893 0.210714 13.298 0 13.8284 0Z",
  },
  bottom: {
    w: 14,
    h: 6,
    d: "M0.17157 6L13.8284 6C13.298 6 12.7893 5.78929 12.4142 5.41422L8.41421 1.41422C7.63316 0.633168 6.36683 0.633168 5.58578 1.41422L1.58578 5.41422C1.21071 5.78929 0.702003 6 0.17157 6Z",
  },
  left: {
    w: 6,
    h: 14,
    d: "M8.33551e-07 13.8284L0 0.17157C2.31859e-08 0.702003 0.210714 1.21071 0.585787 1.58578L4.58579 5.58578C5.36684 6.36683 5.36683 7.63316 4.58579 8.41421L0.585787 12.4142C0.210715 12.7893 8.10365e-07 13.298 8.33551e-07 13.8284Z",
  },
  right: {
    w: 6,
    h: 14,
    d: "M6 13.8284L6 0.171575C6 0.702008 5.78929 1.21072 5.41422 1.58579L1.41422 5.58579C0.633167 6.36684 0.633168 7.63317 1.41422 8.41422L5.41422 12.4142C5.78929 12.7893 6 13.298 6 13.8284Z",
  },
};
/** The arrow's distance from the bubble's edge when the bubble is aligned to the trigger's start or end. */
const arrowOffset = (bubbleWidth: number) => Math.min(20, Math.max(12, bubbleWidth / 5));

/**
 * Tooltip. The slotted content sits in a focusable inline-flex trigger; the bubble is a 13px
 * inverted-theme box with an 8px radius, 10px from the trigger on the `position` side (top by
 * default, `auto` picks top or bottom), its arrow centred on the facing edge or, with `box-align`
 * left or right (`auto` near a viewport edge), at the arrow offset from the bubble's start or
 * end. The bubble takes `text`, or the `content` slot (a key in it draws small and flat), and
 * `max-width` (250px), `padding`, `variant` (the themed colour variables of success, error, warning
 * and violet), `tip` (the arrow), `center`, `wrap` and `invert-theme`, each on by default.
 * It fades in after 400ms (`delay="false"`: at once; `lower-delay`, or a touch: 100ms), placed
 * with floating-ui in the top layer, so it escapes clipping ancestors, and flips or shifts only
 * when the viewport leaves no room. A mouse or pen opens it on enter (after `delay-time`) and
 * closes it 100ms after leaving; Enter and Space open it, Escape closes it; focus opens it with
 * `sticky`; a tap opens it on a touch screen (never with `desktop-only`) over a backdrop that
 * catches the next tap; a scroll closes it. `shown` sets the open bits (1 hover, 2 focus, 4
 * touch), `force-hide` keeps it closed, `disable-triggers` ignores every trigger, `hide-on-click`
 * closes it as the trigger takes focus, `trigger-tabindex` sets the trigger's tab order (`none`
 * for no tab stop), `cursor` its pointer, `use-parent-for-bounding-rect` measures the host's parent.
 */
@customElement("acme-tooltip")
export class AcmeTooltip extends AcmeElement {
  static styles = [
    sharedCss,
    tooltipTriggerCss,
    tooltipCss,
    tooltipBackdropCss,
    css`
      /* The floating layer is a popover in the top layer: the browser's own box for one (fixed,
         centred, bordered, padded, clipping) gives way to a flat strip at the viewport's origin, as
         wide as the viewport so the bubble's fit-content width has the room a page gives it, and the
         bubble is placed from there in viewport coordinates. */
      .layer {
        position: fixed;
        inset: auto;
        top: 0;
        left: 0;
        width: 100%;
        height: 0;
        margin: 0;
        border: 0;
        padding: 0;
        overflow: visible;
        background: none;
        color: inherit;
      }
    `,
  ];
  /** The bubble's text; a trailing period is dropped. The `content` slot takes markup instead or as well. */
  @property() text = "";
  @property() position: TooltipPosition = "top";
  @property({ attribute: "box-align" }) boxAlign: TooltipAlign = "auto";
  /** `center="false"` left-aligns the text. */
  @property({ converter: boolish }) center = true;
  /** `delay="false"` fades the bubble in at once. */
  @property({ converter: boolish }) delay = true;
  /** Milliseconds before a hover or key opens the bubble. */
  @property({ type: Number, attribute: "delay-time" }) delayTime = 0;
  /** Never opens on a touch. */
  @property({ type: Boolean, attribute: "desktop-only" }) desktopOnly = false;
  /** Ignores hover, focus, keys and touch. */
  @property({ type: Boolean, attribute: "disable-triggers" }) disableTriggers = false;
  /** `fill="false"` drops the filled colour variables of `variant`. */
  @property({ converter: boolish }) fill = true;
  /** Closes the bubble as the trigger takes focus. */
  @property({ type: Boolean, attribute: "hide-on-click" }) hideOnClick = false;
  @property({ attribute: "max-width" }) maxWidth = "250px";
  /** The bubble's padding, as CSS. */
  @property() padding = "";
  /** The open bits: 1 hover or keyboard, 2 focus, 4 touch. */
  @property({ type: Number }) shown = 0;
  /** Focus on the trigger opens the bubble. */
  @property({ type: Boolean }) sticky = false;
  /** `tip="false"` hides the arrow. */
  @property({ converter: boolish }) tip = true;
  /** `success`, `error`, `warning` or `violet`: the themed colour variables of that tooltip variant. */
  @property() variant: TooltipVariant = "";
  /** `wrap="false"` keeps the text on one line. */
  @property({ converter: boolish }) wrap = true;
  /** Measures the host's parent instead of the trigger. */
  @property({ type: Boolean, attribute: "use-parent-for-bounding-rect" }) useParentForBoundingRect = false;
  /** The shorter fade-in delay. */
  @property({ type: Boolean, attribute: "lower-delay" }) lowerDelay = false;
  /** Keeps the bubble closed. */
  @property({ type: Boolean, attribute: "force-hide" }) forceHide = false;
  /** `invert-theme="false"` keeps the page's theme in the bubble. */
  @property({ converter: boolish, attribute: "invert-theme" }) invertTheme = true;
  /** The trigger's tab order (`0`); `none` takes it out of the tab order. */
  @property({ attribute: "trigger-tabindex" }) triggerTabindex = "0";
  /** The trigger's pointer, as CSS. */
  @property() cursor = "";
  /** The open bits at hand. */
  @atomState() private bits = 0;
  /** The side the bubble opens on, resolved from `position`. */
  @atomState() private side: Side = "top";
  /** The side the bubble is drawn on: the resolved side, or its opposite when that had no room. */
  @atomState() private shownSide: Side = "top";
  /** The bubble's place along a top or bottom trigger, resolved from `box-align`. */
  @atomState() private align: Align = "center";
  @query(".trigger") private trigger?: HTMLElement;
  @query(".layer") private layer?: HTMLElement;
  @query(".tip") private bubble?: HTMLElement;
  @query(".arrow") private arrowEl?: HTMLElement;
  private uid = `tooltip-${Math.random().toString(36).slice(2, 8)}`;
  private shownLayer?: HTMLElement;
  private stopAutoUpdate?: () => void;
  private openTimer?: ReturnType<typeof setTimeout>;
  private leaveTimer?: ReturnType<typeof setTimeout>;
  private resizeTimer?: ReturnType<typeof setTimeout>;
  /** A touch in progress: where it started, and whether it started off the trigger. */
  private touch: { onWindow: boolean; x: number; y: number } | null = null;
  private windowBound = false;

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("touchend", this.onTouchEnd);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("touchend", this.onTouchEnd);
    this.unbindWindow();
    this.stopAutoUpdate?.();
    this.stopAutoUpdate = undefined;
    this.shownLayer = undefined;
    clearTimeout(this.openTimer);
    clearTimeout(this.leaveTimer);
    clearTimeout(this.resizeTimer);
  }

  /** The element the bubble is anchored to: the trigger, or the host's parent. */
  private anchor(): Element {
    return (this.useParentForBoundingRect ? this.parentElement : this.trigger) ?? this;
  }

  /** Resolves `auto` position and alignment from where the anchor sits in the viewport. */
  private measure() {
    const r = this.anchor().getBoundingClientRect();
    this.side = this.position === "auto" ? (r.top < window.innerHeight / 2 ? "bottom" : "top") : this.position;
    this.shownSide = this.side;
    const vertical = this.side === "top" || this.side === "bottom";
    if (vertical && this.boxAlign === "auto") {
      const right = document.documentElement.clientWidth - r.right;
      this.align = r.left < EDGE ? "left" : right < EDGE ? "right" : "center";
    } else this.align = this.boxAlign === "auto" ? "center" : this.boxAlign;
  }

  private show(bit: number) {
    if (this.disableTriggers) return;
    this.measure();
    this.bits |= bit;
  }

  private showLater(bit: number) {
    clearTimeout(this.openTimer);
    this.openTimer = setTimeout(() => this.show(bit), this.delay ? this.delayTime : 0);
  }

  private hide(bit: number) {
    if (this.disableTriggers) return;
    clearTimeout(this.openTimer);
    this.bits &= ~bit;
  }

  /** The pointer left: the bubble closes after a beat. */
  private hideSoon(bit: number) {
    clearTimeout(this.leaveTimer);
    this.leaveTimer = setTimeout(() => this.hide(bit), LEAVE_MS);
  }

  /** Focusable content in the trigger, its own or inside an element of ours; null when it is disabled. */
  private focusableContent(): HTMLElement | null {
    const own = this.querySelector<HTMLElement>(FOCUSABLE);
    const composed = own ?? [...this.querySelectorAll<HTMLElement>("*")].find((el) => el.shadowRoot?.querySelector(FOCUSABLE)) ?? null;
    if (!composed) return null;
    const control = own ?? composed.shadowRoot?.querySelector<HTMLElement>(FOCUSABLE) ?? composed;
    const disabled = (control as HTMLButtonElement).disabled || composed.hasAttribute("disabled") || control.getAttribute("aria-disabled") === "true";
    return disabled ? null : composed;
  }

  private onPointerEnter = (e: PointerEvent) => {
    if (e.pointerType === "touch") {
      if (this.desktopOnly) return;
      if (!this.focusableContent() && !this.touch) this.touch = { onWindow: false, x: e.clientX, y: e.clientY };
      return;
    }
    this.showLater(HOVER);
  };

  private onPointerLeave = (e: PointerEvent) => {
    if (e.pointerType !== "touch") this.hideSoon(HOVER);
  };

  private onFocusIn = (e: FocusEvent) => {
    if (this.hideOnClick) {
      this.hide(HOVER);
      (e.target as HTMLElement | null)?.blur();
    }
    if (e.target === this.trigger && this.sticky && !this.disableTriggers) this.showLater(FOCUS);
  };

  private onFocusOut = () => this.hide(FOCUS);

  private onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") this.showLater(HOVER);
    else if (e.key === "Escape") this.hide(FOCUS);
  };

  private onWindowKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") this.hide(ALL);
  };

  private onTouchStart = (e: TouchEvent) => {
    const t = e.touches[0];
    if (t) this.touch = { onWindow: true, x: t.clientX, y: t.clientY };
  };

  /** A tap on the trigger opens the bubble; a tap anywhere while it is open closes it and goes no further. */
  private onTouchEnd = (e: TouchEvent) => {
    const t = this.touch;
    if (!t) return;
    const c = e.changedTouches[0];
    const moved = !!c && Math.hypot(c.clientX - t.x, c.clientY - t.y) >= TAP_PX;
    if (!t.onWindow && !moved) {
      this.show(TOUCH);
      return;
    }
    this.touch = null;
    if (!moved) {
      e.stopPropagation();
      e.preventDefault();
    }
    requestAnimationFrame(() => this.hide(ALL));
  };

  private onResize = () => {
    clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(() => this.measure(), RESIZE_MS);
  };

  private onScroll = () => this.hide(ALL);

  /** While the bubble is open the window closes it on Escape and scroll, records a touch, and re-measures on resize. */
  private bindWindow() {
    if (this.windowBound) return;
    this.windowBound = true;
    window.addEventListener("keydown", this.onWindowKey);
    window.addEventListener("touchstart", this.onTouchStart);
    window.addEventListener("resize", this.onResize);
    window.addEventListener("scroll", this.onScroll, { capture: true, passive: true });
  }

  private unbindWindow() {
    if (!this.windowBound) return;
    this.windowBound = false;
    window.removeEventListener("keydown", this.onWindowKey);
    window.removeEventListener("touchstart", this.onTouchStart);
    window.removeEventListener("resize", this.onResize);
    window.removeEventListener("scroll", this.onScroll, { capture: true });
  }

  /**
   * Places the bubble 10px off the anchor on the resolved side, centred, or with its arrow offset
   * over the anchor's centre when aligned to the start or end; it flips when the side has no room
   * and shifts to stay in the viewport, and then the arrow moves to keep pointing at the anchor.
   */
  private place = async () => {
    const bubble = this.bubble;
    const arrowEl = this.arrowEl;
    if (!bubble) return;
    const side = this.side;
    const align = this.align;
    const vertical = side === "top" || side === "bottom";
    // The layer is in the top layer, whose containing block is the viewport: viewport coordinates place the bubble.
    const { x, y, placement, middlewareData } = await computePosition(this.anchor(), bubble, {
      placement: side,
      strategy: "fixed",
      middleware: [
        offset(({ rects }) => ({ mainAxis: GAP, crossAxis: vertical && align !== "center" ? (align === "left" ? 1 : -1) * (rects.floating.width / 2 - arrowOffset(rects.floating.width)) : 0 })),
        // The bubble sits in the top layer: nothing clips it but the viewport.
        flip({ boundary: [] }),
        shift({ padding: 8, boundary: [] }),
        ...(arrowEl ? [arrow({ element: arrowEl })] : []),
      ],
    });
    // Placed by a translation from the layer's origin (the bubble renders at it, so its first measure is its true size).
    bubble.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
    const final = placement.split("-")[0] as Side;
    if (final !== this.shownSide) this.shownSide = final;
    if (!arrowEl) return;
    const shifted = !!(middlewareData.shift?.x || middlewareData.shift?.y);
    const a = middlewareData.arrow;
    if (shifted && a) {
      // The arrow's own rules centre it on its edge; the shift's correction lands on the axis along that edge.
      const along = final === "top" || final === "bottom";
      arrowEl.style.left = along && a.x != null ? `${a.x + arrowEl.offsetWidth / 2}px` : "";
      arrowEl.style.right = along ? "auto" : "";
      arrowEl.style.top = !along && a.y != null ? `${a.y + arrowEl.offsetHeight / 2}px` : "";
    } else {
      arrowEl.style.left = "";
      arrowEl.style.right = "";
      arrowEl.style.top = "";
    }
  };

  /** The bubble's content nodes: the `content` slot's light DOM. */
  private content(): Element[] {
    return [...this.children].filter((c) => c.getAttribute("slot") === "content");
  }

  /** The slotted content changed: the bubble reads it again. */
  private markContent = () => this.requestUpdate();

  willUpdate(ch: Map<string, unknown>) {
    if (ch.has("shown")) {
      this.measure();
      this.bits = this.shown;
    }
    if (ch.has("position") || ch.has("boxAlign")) this.measure();
  }

  updated(ch: Map<string, unknown>) {
    // A key among the content is the bubble's: it takes the bubble's rules for a key.
    for (const el of this.content()) if (el.localName === "acme-kbd") el.toggleAttribute("data-in-tooltip", true);
    const layer = this.layer;
    if (layer !== this.shownLayer) {
      this.stopAutoUpdate?.();
      this.stopAutoUpdate = undefined;
      this.shownLayer = layer;
      if (layer && this.bubble) {
        // The layer joins the top layer; a runtime without popovers keeps it in the tree.
        if (typeof layer.showPopover === "function")
          try {
            layer.showPopover();
          } catch {
            // Already shown.
          }
        this.stopAutoUpdate = autoUpdate(this.anchor(), this.bubble, this.place);
        this.bindWindow();
      } else this.unbindWindow();
    } else if (layer && (ch.has("side") || ch.has("align"))) this.place();
    // A flip redraws the arrow on the other edge; the bubble's box is where it was.
    if (ch.has("shownSide") && this.stopAutoUpdate) this.place();
  }

  render() {
    const content = this.content();
    const text = this.text.endsWith(".") ? this.text.slice(0, -1) : this.text;
    // Without text or content there is nothing to show: the content stands alone, as it does when the triggers are off and the bubble is closed.
    if ((!text && !content.length) || (this.disableTriggers && this.bits === 0)) return html`<slot @slotchange=${this.markContent}></slot>`;
    const open = this.bits > 0 && !this.forceHide;
    const touch = (this.bits & TOUCH) > 0;
    const hasKbd = content.some((el) => el.matches("kbd, acme-kbd") || el.querySelector("kbd, acme-kbd"));
    const side = this.shownSide;
    const vertical = side === "top" || side === "bottom";
    const cls = this.cls("tip", {
      bottom: side === "bottom",
      left: side === "left",
      right: side === "right",
      start: vertical && this.align === "left",
      end: vertical && this.align === "right",
      nodelay: !this.delay,
      faster: this.lowerDelay || touch,
      nocenter: !this.center,
      nowrap: !this.wrap,
      success: this.variant === "success",
      error: this.variant === "error",
      warning: this.variant === "warning",
      violet: this.variant === "violet",
      nofill: !!this.variant && !this.fill,
      noinvert: !this.invertTheme,
    });
    const g = GLYPH[side];
    const tabindex = this.triggerTabindex === "none" ? nothing : this.triggerTabindex;
    return html`<span
        class="trigger"
        part="trigger"
        tabindex=${tabindex}
        aria-describedby=${open ? this.uid : nothing}
        style=${styleMap({ cursor: this.cursor || null })}
        @pointerenter=${this.onPointerEnter}
        @pointerleave=${this.onPointerLeave}
        @focusin=${this.onFocusIn}
        @focusout=${this.onFocusOut}
        @keydown=${this.onKeyDown}
        ><slot @slotchange=${this.markContent}></slot></span
      >${
        open
          ? html`<div class="layer" popover="manual">
              ${touch ? html`<div class="backdrop"></div>` : nothing}
              <div class=${cls} id=${this.uid} role="tooltip" part="tooltip" ?data-kbd=${hasKbd} style=${styleMap({ left: "0px", top: "0px", maxWidth: this.maxWidth || null, padding: this.padding || null })}>${
                this.tip
                  ? html`<div class="arrow" part="arrow" aria-hidden="true"><svg height=${g.h} viewBox=${`0 0 ${g.w} ${g.h}`} width=${g.w} xmlns="http://www.w3.org/2000/svg">${svg`<path d=${g.d}></path>`}</svg></div>`
                  : nothing
              }${text}<slot name="content" @slotchange=${this.markContent}></slot></div>
            </div>`
          : nothing
      }`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-tooltip": AcmeTooltip;
  }
}
