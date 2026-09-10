import { css, html, nothing, svg } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { AcmeElement, glyphSized, sharedCss } from "../../base";
import { atomState } from "../../shared/atom-state";
import { animate } from "@lit-labs/motion";
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
      /* The generated sheet carries the reference's own transition on this box. The animate
         directive drives the same property now, at the same 250ms and easing, so the transition
         would run a second animation against it. The CSS rule still holds the rest and hover
         states, which is what the directive animates BETWEEN and what the census reads. */
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
  /** The cover's matrix at the moment the pointer turned; the first keyframe of the reversal. */
  private turnedFrom?: string;
  /**
   * The hover, as reactive state. `Interaction` sets `data-hover` on the root for the generated
   * rules and for the census, but it does that with `setAttribute` and never asks for an update, so
   * a hovered book renders nothing new. The `animate` directive runs only in Lit's update cycle
   * (`hostUpdate` measures, `hostUpdated` plays), so it needs a render to fire: this property is it.
   */
  @atomState() private hovered = false;
  private interaction = new Interaction(this);

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

  /**
   * The cover's 3D hover, as keyframes rather than the directive's own transform. `animate` builds a
   * transform from measured left/top/width/height, which cannot express `rotateY`, so `onFrames`
   * replaces the frames outright — the technique the package's own hero demo uses. The two frames
   * are the CSS rest and hover states, so the motion is the reference's and the directive only times
   * it.
   */
  /** Records where the cover is, stops the turn in progress, then flips the state. */
  private turn(hovered: boolean) {
    const now = this.wrap ? getComputedStyle(this.wrap).transform : "none";
    this.turnedFrom = now === "none" ? undefined : now;
    // The directive cancels its animation only when it commits styles, never when a new one starts
    // on the same box, so a pointer that turns mid-flight leaves the old animation running and the
    // cover keeps travelling the way it was going. Cancelling here is what makes the reversal start
    // where the box actually is.
    for (const a of this.wrap?.getAnimations() ?? []) a.cancel();
    this.hovered = hovered;
  }

  private coverFrames = () => {
    const rest = "rotateY(0deg) scale(1) translateX(0px)";
    const lifted = "rotateY(var(--hover-rotate)) scale(var(--hover-scale)) translateX(var(--hover-translate-x))";
    // The first frame is where the box WAS when the gesture turned, not where the last one began. A
    // pointer that leaves mid-turn catches the cover part-way, and a hard-coded start jumps it to
    // the full hover first — the snap on a quick in-and-out. The matrix is captured in the pointer
    // handler, before the update, because by the time frames are built the new state already
    // computes.
    const from = this.turnedFrom ?? (this.hovered ? rest : lifted);
    return [{ transform: from }, { transform: this.hovered ? lifted : rest }];
  };

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
    >
      <div
        class="wrap"
        style=${wrapStyle || nothing}
        @pointerenter=${() => this.turn(true)}
        @pointerleave=${() => this.turn(false)}
        ${animate({
          properties: [],
          skipInitial: true,
          guard: () => this.hovered,
          // No `fill`: the CSS rule under it already holds the hover state, so a finished animation
          // that stays applied would only stack a second one on the next hover.
          keyframeOptions: { duration: 250, easing: "ease-out" },
          onFrames: this.coverFrames,
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
