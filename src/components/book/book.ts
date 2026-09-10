import { css, html, nothing, svg } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { AnimateController, animate } from "@lit-labs/motion";
import { AcmeElement, glyphSized, sharedCss } from "../../base";
import { atomState } from "../../shared/atom-state";
import { createStore, StoreEffect, StoreSelector } from "../../shared/state";
import { Interaction } from "../../shared/interaction";
import { bookCss } from "./book.styles";

/** A width in px, or one per breakpoint: `xs` (≤ 400), `sm` (≤ 600), `smd` (≤ 768), `md` (≤ 960), `lg` (≤ 960 and above), `xl`; a missing breakpoint falls back on the nearest smaller one. */
export type BookWidth = number | { xs?: number; sm: number; smd?: number; md?: number; lg?: number; xl?: number };

const BREAKPOINTS = ["xs", "sm", "smd", "md", "lg", "xl"] as const;
/**
 * The width variables the perspective box carries: `--book-width` for a number, or one
 * `--<breakpoint>-book-width` per breakpoint given (a repeat of the previous breakpoint's value
 * is left out; `xs` is left out when it equals `sm`), which the module's media queries resolve.
 */
export function widthVars(w: BookWidth): string[] {
  if (typeof w !== "object") return [`--book-width:${w}`];
  const out: string[] = [];
  let last: number | undefined;
  for (const bp of BREAKPOINTS) {
    const v = w[bp];
    if (bp === "xs" && w.xs === w.sm) continue;
    if ((v != null && v !== last) || (bp === "smd" && w.smd === w.sm && w.smd !== w.md)) {
      out.push(`--${bp}-book-width:${v}`);
      last = v;
    }
  }
  return out;
}
/** The texture is turned upside down on half of the titles, by a hash of the title, so a row of books does not repeat one grain. */
export const textureFlipped = (title: string) => {
  let h = 0;
  for (let i = 0; i < title.length; i++) h = ((h << 5) - h + title.charCodeAt(i)) | 0;
  return (h & 1) === 1;
};

/** The two states the CSS holds; the directive only times the travel between them. */
const REST = "rotateY(0deg) scale(1) translateX(0px)";
const LIFTED = "rotateY(var(--hover-rotate)) scale(var(--hover-scale)) translateX(var(--hover-translate-x))";

/** Which way the cover is going, and the matrix it was caught at when that last changed. */
type Gesture = { hovered: boolean; from?: string };
const AT_REST: Gesture = { hovered: false };

const widthAttr = {
  fromAttribute: (v: string | null): BookWidth => (v == null || v.trim() === "" ? 196 : v.trim().startsWith("{") ? (JSON.parse(v) as BookWidth) : Number(v)),
  toAttribute: (v: BookWidth) => (typeof v === "object" ? JSON.stringify(v) : String(v)),
};

/** The mark a simple cover shows below its title when nothing is slotted as the illustration: 36 × 56, three overlapping lenses. */
const defaultIllustration = svg`<svg width="36" height="56" viewBox="0 0 36 56" fill="none" aria-hidden="true"><circle cx="18" cy="18" r="18" fill="var(--ds-teal-600)"/><circle cx="18" cy="38" r="18" fill="var(--ds-red-700)"/><path d="M3 28a18 18 0 0 1 30 0 18 18 0 0 1-30 0z" fill="var(--ds-blue-700)"/></svg>`;

/**
 * Book: a cover in perspective that turns toward the reader on hover. `variant` is `stripe` (a
 * colored band above the title, an `icon` below it; amber by default) or `simple` (the whole cover
 * in `color`, an `illustration` below the title). `width` is a px number or a per-breakpoint
 * object (`{"sm":150,"md":196}`); the cover keeps a 49:60 ratio, the spine, the title size and
 * the gaps follow the width. `textured` lays a paper grain over the cover.
 */
@customElement("acme-book")
export class AcmeBook extends AcmeElement {
  static styles = [
    sharedCss,
    bookCss,
    css`
      :host {
        display: inline-flex;
      }
      /* The generated sheet transitions this box between its rest and hover rules, and the
         directive animates the same property. Two animations on one property race for the first
         frame — the hitch on hover-in. With the transition off, the rules only HOLD the two states
         (which is what the census reads) and the directive alone travels between them. */
      .wrap {
        transition: none;
      }
    `,
  ];
  /** The cover title. The attribute is read and removed, so the element shows no tooltip. */
  @property() override title = "";
  /** stripe (default): a band in `color` above the title and an icon below it · simple: the cover in `color`, an illustration below the title. */
  @property() variant: "stripe" | "simple" = "stripe";
  /** Any CSS color or token (`#9D2127`, `var(--ds-blue-700)`). A stripe is amber-600 by default; a simple cover is gray-200 with no color. */
  @property() color = "";
  /** The title color; gray-1000 by default. */
  @property({ attribute: "text-color" }) textColor = "";
  /** The cover width in px (default 196), or per breakpoint as JSON: `{"sm":150,"md":196}`. */
  @property({ converter: widthAttr }) width: BookWidth = 196;
  /** A paper grain over the cover; the pages take a ribbed edge. */
  @property({ type: Boolean }) textured = false;
  /** Whether the `icon` slot holds an element; the default mark shows otherwise. */
  @atomState() private hasIcon = false;
  @query(".book") private root!: HTMLElement;
  @query(".wrap") private wrap?: HTMLElement;
  // ── state ──────────────────────────────────────────────────────────────────

  /**
   * The gesture, with its one transition as an action. A repeat of the current direction returns
   * the same object, which the store's compare drops, so nothing downstream moves: no recapture of
   * `from`, no dirty frames, no update.
   */
  private gesture = createStore(AT_REST, ({ setState }) => ({
    turn: (hovered: boolean, from?: string) => setState((g) => (g.hovered === hovered ? g : { hovered, from })),
  }));

  /**
   * The keyframes the gesture implies. Derived, lazily: recomputed on the next read after the
   * gesture moved. The first frame is where the box was caught, or the far state on a turn that
   * found nothing to catch; a hard-coded start would snap a quick in-and-out to the full hover
   * before settling.
   */
  private frames = createStore((): Keyframe[] => {
    const { hovered, from } = this.gesture.get();
    return [{ transform: from ?? (hovered ? REST : LIFTED) }, { transform: hovered ? LIFTED : REST }];
  });

  /**
   * The render's view of the gesture: `hovered` alone. `from` changes on every turn too, but it is
   * read by the frames rather than rendered, so selecting the flag keeps the update to what the
   * markup needs. Held, not read — `TanStackStoreSelector` exposes no value, only the subscription;
   * the guard reads the store itself.
   */
  private hovered = new StoreSelector(this, () => this.gesture, (g) => g.hovered);

  // ── motion ─────────────────────────────────────────────────────────────────

  /**
   * Holds the fixed options for the one directive. No `fill`: the CSS rule already holds the state
   * a finished animation lands on, so a filled animation would only stack on the next hover.
   */
  private motion = new AnimateController(this, {
    defaultOptions: { properties: [], skipInitial: true, keyframeOptions: { duration: 250, easing: "ease-out" } },
  });

  /**
   * A turn cancels the motion in flight. The directive only cancels its animation when it commits
   * styles, never when a new one starts on the same box, so without this the old animation keeps
   * advancing and the cover travels the way it was going. This runs inside `setState`, before Lit's
   * update, and `from` was measured before the write — the box is caught mid-flight, then released.
   */
  private settle = new StoreEffect(this, () => this.gesture, () => this.motion.cancel());

  private interaction = new Interaction(this);

  /**
   * The matrix the browser is drawing right now — mid-flight if animating — or nothing before any
   * transform has applied. This must run BEFORE `Interaction` flips `data-hover`: once the rule
   * applies, the computed transform is already the far state and the cover would snap. The pointer
   * bindings sit on the root next to `Interaction`'s, and Lit registers them at first render, before
   * `updated` attaches the controller, so on the same element they run first.
   */
  private caught(): string | undefined {
    const t = this.wrap && getComputedStyle(this.wrap).transform;
    return t && t !== "none" ? t : undefined;
  }

  /**
   * `Interaction` sets `data-hover` on the root for the generated rules and for the census, with
   * `setAttribute` and no update, so a hovered book renders nothing new on its own. The gesture's
   * move is what makes the selector request the update the directive runs in; the CSS then holds
   * the state the animation lands on.
   */
  private turn = (hovered: boolean) => this.gesture.actions.turn(hovered, this.caught());

  // ── lifecycle ──────────────────────────────────────────────────────────────

  override attributeChangedCallback(name: string, old: string | null, val: string | null) {
    if (name === "title") {
      if (val !== null) {
        this.title = val;
        this.removeAttribute("title");
      }
      return;
    }
    super.attributeChangedCallback(name, old, val);
  }

  override connectedCallback() {
    super.connectedCallback();
    this.hasIcon = !!this.querySelector('[slot="icon"]');
  }

  override firstUpdated() {
    // A parser that connects the element before its children (happy-dom does) misses them at connect.
    this.hasIcon ||= !!this.querySelector('[slot="icon"]');
  }

  override updated() {
    this.interaction.attach(this.root);
  }

  private iconSlotted = (e: Event) => {
    this.hasIcon = (e.target as HTMLSlotElement).assignedElements({ flatten: true }).length > 0;
  };

  render() {
    const stripe = this.variant !== "simple";
    const color = this.color || (stripe ? "var(--ds-amber-600)" : "");
    const wrapStyle = [color && `--book-color:${color}`, this.textColor && `--book-text-color:${this.textColor}`].filter(Boolean).join(";");
    const illustration = html`<div class="illustration"><slot name="illustration">${stripe ? nothing : defaultIllustration}</slot></div>`;
    return html`<div
      class=${this.cls("book", { stripe, simple: !stripe, color: !!color, textured: this.textured })}
      style=${widthVars(this.width).join(";")}
      part="book"
      @pointerenter=${() => this.turn(true)}
      @pointerleave=${() => this.turn(false)}
    >
      <div
        class="wrap"
        style=${wrapStyle || nothing}
        ${animate({
          // The guard is the selector's value, so the directive runs exactly when the gesture
          // turned. `animate` builds a transform from measured left/top/width/height, which cannot
          // express rotateY, so onFrames replaces the frames with the derived ones — the technique
          // the package's own hero demo uses.
          guard: () => this.gesture.get().hovered,
          onFrames: () => this.frames.get(),
        })}
      >
        <div class="cover">
          ${stripe ? html`<div class="band" aria-hidden="true">${illustration}<div class="bind"></div></div>` : nothing}
          <div class="body">
            <div class="bind" aria-hidden="true"></div>
            <div class="content">
              <span class="title">${this.title}</span>
              ${stripe ? html`<slot name="icon" @slotchange=${this.iconSlotted}></slot>${this.hasIcon ? nothing : glyphSized("layers", 16)}` : illustration}
            </div>
          </div>
          ${this.textured ? html`<div class="texture" aria-hidden="true" style="transform:rotate(${textureFlipped(this.title) ? 180 : 0}deg)"></div>` : nothing}
        </div>
        <div class="pages" aria-hidden="true"></div>
        <div class="back" aria-hidden="true"></div>
      </div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-book": AcmeBook;
  }
}
