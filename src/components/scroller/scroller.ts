import { Debouncer } from "@tanstack/pacer";
import { css, html, nothing, type PropertyValues } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { AcmeElement, glyphSized, sharedCss } from "../../base";
import { scrollerCss } from "./scroller.styles";
import { scrollerButtonsCss } from "./scroller-buttons.styles";
import "../button/button";
import { atomState } from "../../shared/atom-state";

/** A number is a length in px; anything else is a CSS length. */
const len = (v: string) => (/^\d+(\.\d+)?$/.test(v) ? `${v}px` : v);
/** How far past the viewport the content must lie before an edge's fade shows. */
const EDGE = 5;
/** The scroll position is re-read this long after the last scroll or size change. */
const SETTLE_MS = 100;
/** The buttons stay idle this long after they start a scroll. */
const LOCK_MS = 400;

type Edges = { top: boolean; right: boolean; bottom: boolean; left: boolean };
const NONE: Edges = { top: false, right: false, bottom: false, left: false };

/**
 * Scroller. A viewport that scrolls along `x`, `y` or `both` (the default), `width` by `height`
 * (a number is px, any other value a CSS length; both default to 100%), with a 40px fade at
 * every edge the content lies past. The position is re-read 100ms after the last scroll or size
 * change; while an edge is past the viewport the host carries `data-overflowing`. `with-buttons`
 * adds two round secondary buttons that scroll to the previous or next direct child: above the
 * viewport for `y`, below it for `x`, none for `both`. `gradient` replaces the fade's stops;
 * `mobile-grid` lays the children out in two equal columns on viewports between 470 and 670px.
 * The children sit in the default slot; the container that holds them is the `content` part
 * (the place for a gap between them).
 */
@customElement("acme-scroller")
export class AcmeScroller extends AcmeElement {
  static styles = [
    sharedCss,
    scrollerCss,
    scrollerButtonsCss,
    css`
      :host {
        display: block;
      }
      /* The buttons sit beside the viewport in a column that takes the parent's gap between them. */
      :host([with-buttons]) {
        display: flex;
        flex-direction: column;
        gap: inherit;
      }
    `,
  ];
  /** The viewport's width: a number in px, or any CSS length. */
  @property() width = "100%";
  /** The viewport's height: a number in px, or any CSS length. */
  @property() height = "100%";
  /** The axes that scroll. */
  @property() overflow: "x" | "y" | "both" = "both";
  /** Two round buttons that scroll to the previous or next direct child: above the viewport for `y`, below it for `x`; none for `both`. */
  @property({ type: Boolean, attribute: "with-buttons", reflect: true }) withButtons = false;
  /** The fade's colour stops (a gradient stop list), in place of the theme's white or black run. */
  @property() gradient = "";
  /** Lays the children out in two equal columns on viewports between 470 and 670px. */
  @property({ type: Boolean, attribute: "mobile-grid" }) mobileGrid = false;
  /** The edges the content lies past. */
  @atomState() private edges: Edges = NONE;
  /** The index of the first child at or past the scroll position: the child the buttons step from. */
  private index = 0;
  private locked = false;
  private lockTimer?: ReturnType<typeof setTimeout>;
  private observer?: ResizeObserver;
  private settle = new Debouncer(() => this.read(), { wait: SETTLE_MS });
  @query(".container") private box?: HTMLElement;
  @query(".content") private content?: HTMLElement;

  /** The scroll container: scroll it to move the viewport, the fades follow. */
  get container(): HTMLElement | null {
    return this.box ?? null;
  }
  private get horizontal() {
    return this.overflow !== "y";
  }
  private get vertical() {
    return this.overflow !== "x";
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.hasUpdated) this.observe();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.observer?.disconnect();
    this.observer = undefined;
    this.settle.cancel();
    clearTimeout(this.lockTimer);
  }

  firstUpdated() {
    this.observe();
  }

  updated(changed: PropertyValues) {
    if (changed.has("overflow")) this.settle.maybeExecute();
    if (changed.has("edges")) this.toggleAttribute("data-overflowing", Object.values(this.edges).some(Boolean));
  }

  /** A size change of the children re-reads the position. */
  private observe() {
    if (this.observer || typeof ResizeObserver === "undefined" || !this.content) return;
    this.observer = new ResizeObserver(() => this.settle.maybeExecute());
    this.observer.observe(this.content);
  }

  /** A child's offset inside the container, in whole px, the way the container lays it out. */
  private offset(child: Element, box: DOMRect, c: HTMLElement) {
    const r = child.getBoundingClientRect();
    return { left: Math.round(r.left - box.left + c.scrollLeft), top: Math.round(r.top - box.top + c.scrollTop) };
  }

  /** Reads the edges the content lies past, and the child the viewport starts on. */
  private read() {
    const c = this.box;
    if (!c) return;
    const { horizontal: h, vertical: v } = this;
    const next: Edges = {
      top: v && c.scrollTop > EDGE,
      bottom: v && c.scrollTop + c.clientHeight + EDGE < c.scrollHeight,
      left: h && c.scrollLeft > EDGE,
      right: h && c.scrollLeft + c.clientWidth + EDGE < c.scrollWidth,
    };
    const e = this.edges;
    if (next.top !== e.top || next.right !== e.right || next.bottom !== e.bottom || next.left !== e.left) this.edges = next;
    const box = c.getBoundingClientRect();
    let i = 0;
    for (const child of this.children) {
      const o = this.offset(child, box, c);
      if (h ? o.left < c.scrollLeft : o.top < c.scrollTop) i++;
      else break;
    }
    this.index = i;
  }

  private onScroll = () => this.settle.maybeExecute();
  private onSlotChange = () => this.settle.maybeExecute();

  /** Scrolls the container to the child at `i`, smoothly, and holds the buttons while it moves. */
  private go(i: number) {
    const c = this.box;
    const child = this.children[i];
    if (!c || !child) return;
    const o = this.offset(child, c.getBoundingClientRect(), c);
    const to: ScrollToOptions = { behavior: "smooth" };
    if (this.vertical) to.top = o.top;
    if (this.horizontal) to.left = o.left;
    this.locked = true;
    c.scrollTo(to);
    clearTimeout(this.lockTimer);
    this.lockTimer = setTimeout(() => {
      this.locked = false;
    }, LOCK_MS);
  }

  private prev = () => {
    if (this.locked || this.index <= 0) return;
    this.index -= 1;
    this.go(this.index);
  };

  private next = () => {
    if (this.locked || this.index >= this.children.length - 1) return;
    this.index += 1;
    this.go(this.index);
  };

  render() {
    const { horizontal: h, vertical: v, edges: e } = this;
    const buttons =
      this.withButtons && !(h && v)
        ? html`<div class=${this.cls("buttons", { x: h, y: v })} part="buttons"><acme-button
              variant="secondary"
              size="small"
              shape="circle"
              svg-only
              aria-label=${h ? "scroll left" : "scroll top"}
              @click=${this.prev}
              >${glyphSized(h ? "chev-l" : "chev-u")}</acme-button
            ><acme-button
              variant="secondary"
              size="small"
              shape="circle"
              svg-only
              aria-label=${h ? "scroll right" : "scroll bottom"}
              @click=${this.next}
              >${glyphSized(h ? "chev" : "chev-d")}</acme-button
            ></div>`
        : nothing;
    const root = this.cls("scroller", {
      x: this.overflow === "x",
      y: this.overflow === "y",
      both: this.overflow === "both",
      top: e.top,
      right: e.right,
      bottom: e.bottom,
      left: e.left,
      grid: this.mobileGrid,
    });
    return html`${v ? buttons : nothing}<div class=${root} part="scroller" style=${styleMap({ width: len(this.width), height: len(this.height) })}>
        <div class="overlay" part="overlay" style=${styleMap({ "--scroller-gradient": this.gradient || null })}></div>
        <div class="container" part="container" data-overflow=${this.overflow} @scroll=${this.onScroll}><div class="content" part="content"><slot @slotchange=${this.onSlotChange}></slot></div></div>
      </div>${h ? buttons : nothing}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-scroller": AcmeScroller;
  }
}
