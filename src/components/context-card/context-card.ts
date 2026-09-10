import { css, html, nothing, svg } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { AcmeElement, sharedCss } from "../../base";
import { atomState } from "../../shared/atom-state";
import { contextCardCss } from "./context-card.styles";
import { contextCardTriggerCss } from "./context-card-trigger.styles";

/** The side of the trigger the card opens on. */
export type ContextCardSide = "top" | "bottom" | "left" | "right";
/** Where the card sits along the trigger: its start edge, the middle, or its end edge. */
export type ContextCardAlign = "start" | "center" | "end";
type Box = { x: number; y: number; width: number; height: number };
/** A computed placement: the card's origin, the content's size, the side it opens on, and the arrow's offset from the card's centre. */
type Placement = { origin: { x: number; y: number }; size: { width: number; height: number }; side: ContextCardSide; arrow: { x: number; y: number } };

/** The bits of `shown`: opened by hover or keyboard (1), by focus (2), by a touch (4); moved here from a neighbouring card (8). */
const HOVER = 1;
const FOCUS = 2;
const MOVED = 8;
/** A hover opens the card this long after it starts, when no card is up; at once when one is. */
const OPEN_MS = 150;
/** The content stays mounted this long after the pointer leaves, for its fade. */
const LEFT_MS = 1000;
/** Scrolling ends this long after the last scroll event. */
const SCROLL_MS = 66;
/** A card that moves further than this from the last one appears there instead of sliding. */
const NEAR_PX = 150;
/** The card keeps this far from the viewport's edges. */
const EDGE = 8;
/** The shell is this much wider and taller than the content box. */
const RING = 2;
/** The arrow keeps this far from the shell's corners. */
const ARROW_INSET = 7;
/** Focusable content in the trigger: the element focus returns to. */
const FOCUSABLE = "a[href],button,input,select,textarea,[tabindex],acme-button";
/** The arrow glyph: a 14 by 7 stem with a 1px stroke, drawn pointing down and rotated per side. */
const GLYPH =
  "M15 -0.5V0.5H12.9834L12.8184 0.508789C12.4377 0.550822 12.0853 0.738056 11.8359 1.03418L8.53027 4.95996C7.73114 5.90893 6.26886 5.90892 5.46973 4.95996L2.16406 1.03418C1.87905 0.695733 1.45907 0.5 1.0166 0.5H-1V-0.5H15Z";

const dist = (a: Box, b: Box | null) => (b ? Math.hypot(a.x - b.x, a.y - b.y) : 0);

/**
 * The stage every card on the page shares: one card is up at a time, and the pointer moving from
 * one trigger to the next slides the card there. The stage remembers where the card was drawn
 * last (`prevBox`) and whether one was up at all (`prevActive`), so the next card knows whether
 * to slide (a neighbour within 150px, not scrolling) or to appear. A card pinned open through
 * `shown` stays off the stage.
 */
const stage = {
  active: null as AcmeContextCard | null,
  hovered: null as AcmeContextCard | null,
  box: null as Box | null,
  prevActive: null as AcmeContextCard | null,
  prevBox: null as Box | null,
  scrolling: false,
  scrollTimer: undefined as ReturnType<typeof setTimeout> | undefined,
  /** The stage settles: the card up reads whether its move is skipped, and the last box is kept. */
  tick() {
    const a = this.active;
    if (a && this.box) {
      const skip = this.scrolling || this.prevActive === null || dist(this.box, this.prevBox) > NEAR_PX;
      a.settle(skip, skip ? null : this.prevBox);
    }
    this.prevActive = a;
    this.prevBox = this.box;
  },
  /** A scroll: no card slides while the page moves; scrolling ends 66ms after the last event. */
  scrolled() {
    clearTimeout(this.scrollTimer);
    this.scrollTimer = setTimeout(() => {
      this.scrolling = false;
      this.tick();
    }, SCROLL_MS);
    if (!this.scrolling) {
      this.scrolling = true;
      this.tick();
    }
  },
};

/**
 * Context card. The slotted content sits in an inline-flex trigger with a pointer cursor; the
 * card is a floating shell (the page background, a 6px radius, the tooltip shadow under a 1px
 * ring, a 14 by 7 stem on the facing edge) 16px off the trigger on `side` (right by default),
 * along it at `align` (start, center or end), moved by `side-offset` and `align-offset`, with
 * the `content` text or the `content` slot in a 12px padded box (`no-padding` drops it). It
 * flips to the side with more room when the viewport leaves none, keeps 8px from its edges, and
 * the stem follows the trigger's centre. A mouse opens it 150ms after entering the trigger, at
 * once when a card is already up, and it slides there from the last card within 150px (a move
 * of 250ms; a card opened from rest, further away, or while scrolling appears in place); the
 * pointer may cross onto the card, and it closes `inactive-timeout-ms` (250) after leaving
 * both, or on a click on a link in the trigger. Focus on the trigger opens it too, and Escape
 * closes it and returns focus. `ignore-card-pointer-events` lets the pointer pass through the
 * card, `hide` keeps it closed, `shown` sets the open bits (1 hover, 2 focus, 4 touch; 8 marks
 * a card that moved here from a neighbour), `disable-triggers` ignores every trigger.
 */
@customElement("acme-context-card")
export class AcmeContextCard extends AcmeElement {
  static styles = [
    sharedCss,
    contextCardTriggerCss,
    contextCardCss,
    css`
      /* The floating layer is a popover in the top layer: the browser's own box for one (centred,
         bordered, padded, clipping, on a canvas) gives way to the flat viewport-filling layer the
         card is placed in, in viewport coordinates. */
      .layer {
        margin: 0;
        border: 0;
        padding: 0;
        overflow: visible;
        background: none;
        color: inherit;
      }
    `,
  ];
  /** The card's text; the `content` slot takes markup instead or as well. */
  @property() content = "";
  @property() side: ContextCardSide = "right";
  @property() align: ContextCardAlign = "center";
  /** Space between the trigger and the card. */
  @property({ type: Number, attribute: "side-offset" }) sideOffset = 16;
  /** The card's shift along the trigger. */
  @property({ type: Number, attribute: "align-offset" }) alignOffset = 0;
  /** The pointer passes through the card. */
  @property({ type: Boolean, attribute: "ignore-card-pointer-events" }) ignoreCardPointerEvents = false;
  /** The content box has no padding. */
  @property({ type: Boolean, attribute: "no-padding" }) noPadding = false;
  /** Keeps the card closed. */
  @property({ type: Boolean }) hide = false;
  /** Milliseconds after the pointer leaves the trigger and the card before the card closes. */
  @property({ type: Number, attribute: "inactive-timeout-ms" }) inactiveTimeoutMs = 250;
  /** The open bits: 1 hover or keyboard, 2 focus, 4 touch; 8 a card that moved here from a neighbour. */
  @property({ type: Number }) shown = 0;
  /** Ignores hover, focus, keys and touch. */
  @property({ type: Boolean, attribute: "disable-triggers" }) disableTriggers = false;
  /** The open bits at hand: the pinned ones from `shown`. */
  @atomState() private bits = 0;
  /** The pointer, or focus, is on the trigger or the card. */
  @atomState() private hovered = false;
  /** The pointer left recently: the content stays mounted for its fade. */
  @atomState() private recentlyLeft = false;
  /** The card is up on the stage. */
  @atomState() private active = false;
  /** The content is visible: this card is the one hovered last. */
  @atomState() private visible = false;
  /** The shell yielded the stage to another card: its layer goes at once. */
  @atomState() private yielded = false;
  /** The side the card is drawn on: the resolved side, or the one with more room. */
  @atomState() private shownSide: ContextCardSide = "right";
  /** Escape dismissed the card: focus stays where it is, so focus alone does not reopen it. */
  private dismissed = false;
  /** The move transition is skipped: opened from rest, moved too far, or scrolling. */
  @atomState() private skip = true;
  @query(".trigger") private trigger?: HTMLElement;
  @query(".layer") private layer?: HTMLElement;
  @query(".fade") private fade?: HTMLElement;
  @query(".card") private card?: HTMLElement;
  @query(".arrow") private arrowEl?: HTMLElement;
  @query(".box") private box?: HTMLElement;
  @query(".body") private body?: HTMLElement;
  private shownLayer?: HTMLElement;
  /** The placement to draw on the next update, and the box the shell slides from. */
  private pending: { placement: Placement; from: Box | null } | null = null;
  private openTimer?: ReturnType<typeof setTimeout>;
  private inactiveTimer?: ReturnType<typeof setTimeout>;
  private leftTimer?: ReturnType<typeof setTimeout>;

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener("scroll", this.onScroll, true);
    window.addEventListener("resize", this.onResize);
    this.addEventListener("keydown", this.onKeyDown);
    // Focus and click on the slotted content bubble through the light tree to the host, never into
    // the shadow trigger box: the host is where they are heard.
    this.addEventListener("click", this.onClick);
    this.addEventListener("focusin", this.onFocusIn);
    this.addEventListener("focusout", this.onFocusOut);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("scroll", this.onScroll, true);
    window.removeEventListener("resize", this.onResize);
    this.removeEventListener("keydown", this.onKeyDown);
    this.removeEventListener("click", this.onClick);
    this.removeEventListener("focusin", this.onFocusIn);
    this.removeEventListener("focusout", this.onFocusOut);
    clearTimeout(this.openTimer);
    clearTimeout(this.inactiveTimer);
    clearTimeout(this.leftTimer);
    if (stage.active === this) this.deactivate();
    if (stage.hovered === this) stage.hovered = null;
    this.shownLayer = undefined;
  }

  /** The stage settled: whether this card's move is skipped, and the box it slides from when not. */
  settle(skip: boolean, from: Box | null) {
    this.skip = skip;
    if (from && this.pending) this.pending.from = from;
  }

  /** The stage went to another card: the layer goes at once. */
  private yield() {
    this.active = false;
    this.yielded = true;
  }

  /**
   * Where the card goes, from the trigger's and the content's boxes: 16px off the trigger on
   * the side, centred along it or at its start or end, flipped to the side with more room when
   * the viewport leaves none, kept 8px from the viewport's edges, the arrow offset to the
   * trigger's centre and kept 7px from the corners.
   */
  private measure(forced?: ContextCardSide): Placement {
    const trigger = this.trigger;
    const box = this.box;
    if (!trigger || !box) throw new Error("Trigger or content not found");
    const r = forced ?? this.side;
    const o = trigger.getBoundingClientRect();
    const i = box.getBoundingClientRect();
    const size = { width: Math.max(i.width, box.offsetWidth), height: i.height };
    const f = this.sideOffset;
    const h = this.alignOffset;
    let x = o.left + o.width / 2 - size.width / 2 + h;
    if (this.align === "start") x = o.left + h;
    if (this.align === "end") x = o.left + o.width - i.width + h;
    let y = o.top + o.height / 2 - size.height / 2 + h;
    if (this.align === "start") y = o.top + h;
    if (this.align === "end") y = o.top + o.height - i.height + h;
    let n: { x: number; y: number };
    switch (r) {
      case "top":
        n = { x, y: o.top - i.height - f };
        break;
      case "right":
        n = { x: o.left + o.width + f, y };
        break;
      case "bottom":
        n = { x, y: o.top + o.height + f };
        break;
      default:
        n = { x: o.left - i.width - f, y };
    }
    const vw = document.documentElement.clientWidth;
    const vh = document.documentElement.clientHeight;
    const offLeft = n.x < 0;
    const offRight = n.x + i.width > vw;
    const offTop = n.y < 0;
    const offBottom = n.y + i.height > vh;
    if (!forced) {
      const below = vh - (o.top + o.height);
      const right = vw - (o.left + o.width);
      const c = this.side;
      const vertical = c === "top" || c === "bottom";
      if (c === "top" && offTop && below > o.top) return this.measure("bottom");
      if (c === "bottom" && offBottom && o.top > below) return this.measure("top");
      if (c === "right" && offRight && o.left > right) return this.measure("left");
      if ((c === "left" && offLeft && right > o.left) || (vertical && offLeft && right > i.width)) return this.measure("right");
      if (vertical && offRight && o.left > i.width) return this.measure("left");
      if (!vertical && offTop && below > i.height) return this.measure("bottom");
      if (!vertical && offBottom && o.top > i.height) return this.measure("top");
    }
    if (r === "left" || r === "right") n.y = Math.max(EDGE, Math.min(n.y, vh - size.height - EDGE));
    else n.x = Math.max(EDGE, Math.min(n.x, vw - size.width - EDGE));
    n.y = Math.max(EDGE, Math.min(n.y, vh - size.height - EDGE));
    const half = { x: size.width / 2 - ARROW_INSET, y: size.height / 2 - ARROW_INSET };
    let ax = o.left + o.width / 2 - (n.x + size.width / 2);
    let ay = o.top + o.height / 2 - (n.y + size.height / 2);
    if (r === "top" || r === "bottom") ax = Math.max(-half.x, Math.min(ax, half.x));
    else ay = Math.max(-half.y, Math.min(ay, half.y));
    return { origin: n, size, side: r, arrow: { x: ax, y: ay } };
  }

  /** The shell's box for a placement: the content plus the ring. */
  private static shell(p: Placement): Box {
    return { x: p.origin.x, y: p.origin.y, width: p.size.width + RING, height: p.size.height + RING };
  }

  /** Takes the stage: the card up before yields, and this one is placed. */
  private activate() {
    if (!this.box) return;
    const placement = this.measure();
    const prev = stage.active;
    stage.active = this;
    stage.box = AcmeContextCard.shell(placement);
    this.pending = { placement, from: null };
    this.active = true;
    this.yielded = false;
    stage.tick();
    if (prev && prev !== this) prev.yield();
    this.shownSide = placement.side;
    this.requestUpdate();
  }

  /** Leaves the stage: the layer fades. */
  private deactivate() {
    if (stage.active === this) {
      stage.active = null;
      stage.tick();
    }
    this.active = false;
  }

  /** The card up is placed again, on a scroll or a resize. */
  private replace() {
    if (stage.active !== this || !this.box) return;
    const placement = this.measure();
    stage.box = AcmeContextCard.shell(placement);
    this.pending = { placement, from: null };
    stage.tick();
    this.shownSide = placement.side;
    this.requestUpdate();
  }

  /** The pointer or focus arrives: the card opens after the delay, at once when one is up. */
  private enter(bit: number) {
    if (this.disableTriggers) return;
    clearTimeout(this.inactiveTimer);
    clearTimeout(this.leftTimer);
    clearTimeout(this.openTimer);
    if (stage.hovered && stage.hovered !== this) stage.hovered.visible = false;
    stage.hovered = this;
    this.visible = true;
    this.hovered = true;
    this.recentlyLeft = false;
    this.yielded = false;
    stage.tick();
    const wait = stage.active ? 0 : this.delayFor(bit);
    this.openTimer = setTimeout(() => this.activate(), wait);
  }

  /** The entry delay: hover waits so a sweeping pointer does not open it; keyboard focus opens at once. */
  private delayFor(bit: number) {
    return bit === FOCUS ? 0 : OPEN_MS;
  }

  /** The pointer or focus leaves: the card closes after the inactive timeout, its content staying a while for the fade. */
  private leave() {
    if (this.disableTriggers) return;
    clearTimeout(this.openTimer);
    this.hovered = false;
    clearTimeout(this.inactiveTimer);
    this.inactiveTimer = setTimeout(() => this.deactivate(), this.inactiveTimeoutMs);
    this.recentlyLeft = true;
    clearTimeout(this.leftTimer);
    this.leftTimer = setTimeout(() => {
      this.recentlyLeft = false;
    }, LEFT_MS);
  }

  /** Closes at once: `hide`, or Escape. */
  private close() {
    clearTimeout(this.openTimer);
    clearTimeout(this.inactiveTimer);
    clearTimeout(this.leftTimer);
    this.hovered = false;
    this.recentlyLeft = false;
    this.deactivate();
  }

  private onMouseEnter = () => this.enter(HOVER);
  private onMouseLeave = () => this.leave();

  /** A click on a link in the trigger: the page moves on, the card closes. */
  private onClick = (e: MouseEvent) => {
    if (e.composedPath().some((n) => n instanceof HTMLAnchorElement && n.hasAttribute("href"))) this.leave();
  };

  /** Focus opens the card, unless Escape dismissed it and focus has not left since. */
  private onFocusIn = () => {
    if (this.dismissed) return;
    this.enter(FOCUS);
  };

  /** Focus left the trigger and the card together. */
  private onFocusOut = (e: FocusEvent) => {
    const to = e.relatedTarget as Node | null;
    if (to && (this.contains(to) || this.shadowRoot?.contains(to))) return;
    // Focus left for good: a later focus opens the card again.
    this.dismissed = false;
    this.leave();
  };

  private onKeyDown = (e: KeyboardEvent) => {
    if (e.key !== "Escape" || this.disableTriggers || !(this.active || this.hovered)) return;
    this.close();
    this.dismissed = true;
    this.querySelector<HTMLElement>(FOCUSABLE)?.focus();
  };

  private onScroll = () => {
    stage.scrolled();
    this.replace();
  };

  private onResize = () => this.replace();

  /** The slotted content changed: the card reads it again. */
  private markContent = () => this.requestUpdate();

  /** Draws a pending placement: the shell's box and the arrow's offset, the shell sliding from the last box when it moves. */
  private draw() {
    const p = this.pending;
    const card = this.card;
    const arrowEl = this.arrowEl;
    if (!p || !card || !arrowEl) return;
    this.pending = null;
    const box = AcmeContextCard.shell(p.placement);
    const at = (b: Box) => {
      card.style.transform = `translate(${b.x}px,${b.y}px)`;
      card.style.width = `${b.width}px`;
      card.style.height = `${b.height}px`;
    };
    if (p.from) {
      at(p.from);
      void card.offsetWidth;
    }
    at(box);
    const vertical = p.placement.side === "top" || p.placement.side === "bottom";
    arrowEl.style.left = vertical ? `calc(50% + ${p.placement.arrow.x}px)` : "";
    arrowEl.style.top = vertical ? "" : `calc(50% + ${p.placement.arrow.y}px)`;
  }

  willUpdate(ch: Map<string, unknown>) {
    if (ch.has("shown")) this.bits = this.shown;
    if (ch.has("hide") && this.hide) this.close();
  }

  updated(ch: Map<string, unknown>) {
    const layer = this.layer;
    if (layer !== this.shownLayer) {
      this.shownLayer = layer;
      // The layer joins the top layer; a runtime without popovers keeps it in the tree.
      if (layer && typeof layer.showPopover === "function")
        try {
          layer.showPopover();
        } catch {
          // Already shown.
        }
      // A pinned card is placed as soon as its box exists.
      if (layer && this.bits && this.box && !this.pending) {
        const placement = this.measure();
        this.pending = { placement, from: null };
        this.shownSide = placement.side;
        this.skip = !(this.bits & MOVED);
      }
    }
    if (!layer) this.pending = null;
    this.draw();
    // The fades run from the box's first drawn style, so the change lands after a layout.
    const fade = this.fade;
    const body = this.body;
    if (fade && body) {
      const up = this.active || this.bits > 0;
      const seen = this.visible || this.bits > 0;
      if (fade.style.opacity !== (up ? "1" : "0") || body.style.opacity !== (seen ? "1" : "0")) {
        void fade.offsetWidth;
        fade.style.opacity = up ? "1" : "0";
        body.style.opacity = seen ? "1" : "0";
      }
    }
  }

  render() {
    const pinned = this.bits > 0;
    const mounted = !this.hide && (pinned || ((this.hovered || this.recentlyLeft) && !this.yielded));
    const side = this.shownSide;
    const skip = pinned ? !(this.bits & MOVED) : this.skip;
    const cls = this.cls("layer", { top: side === "top", bottom: side === "bottom", left: side === "left", skip });
    const catches = (pinned || stage.active === this) && (this.visible || pinned) && !this.ignoreCardPointerEvents;
    return html`<div class="trigger" part="trigger" @mouseenter=${this.onMouseEnter} @mouseleave=${this.onMouseLeave}>
        <slot @slotchange=${this.markContent}></slot>
      </div>
      ${
        mounted
          ? html`<div class=${cls} popover="manual">
              <div class="fade" style="opacity:0">
                <div class="card" part="card" style="transform:translate(0px,0px);width:0px;height:0px">
                  <div class="arrow" part="arrow" aria-hidden="true">
                    <svg width="14" height="7" viewBox="0 0 14 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                      ${svg`<g clip-path="url(#stem)"><path d=${GLYPH} fill="var(--ds-background-100)" style="fill:var(--ds-background-100);fill-opacity:1;stroke:var(--context-card-tip-stroke);stroke-opacity:1"></path></g><defs><clipPath id="stem"><rect width="14" height="7" fill="white" style="fill:white;fill-opacity:1"></rect></clipPath></defs>`}
                    </svg>
                  </div>
                  <div>
                    <div
                      class="box"
                      part="box"
                      style=${styleMap({ pointerEvents: catches ? "all" : "none", width: "max-content", position: "absolute", padding: this.noPadding ? "0" : null })}
                      @mouseenter=${this.onMouseEnter}
                      @mouseleave=${this.onMouseLeave}
                      @focusin=${this.onFocusIn}
                      @focusout=${this.onFocusOut}
                    >
                      <div class="body" style="opacity:0">${this.content}<slot name="content" @slotchange=${this.markContent}></slot></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>`
          : nothing
      }`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-context-card": AcmeContextCard;
  }
}
