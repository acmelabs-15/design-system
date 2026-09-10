import { css, html, nothing } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { middleTruncateCss } from "./middle-truncate.styles";

/** Graphemes, so a cut never splits a surrogate pair or a combining sequence. */
const segmenter = typeof Intl !== "undefined" && "Segmenter" in Intl ? new Intl.Segmenter(undefined, { granularity: "grapheme" }) : null;
const graphemes = (s: string): string[] => (segmenter ? [...segmenter.segment(s)].map((x) => x.segment) : Array.from(s));

/** One cut: the head and the tail kept, and the text shown. */
export type Cut = { prefix: string; prefixCount: number; suffix: string; suffixCount: number; text: string; truncated: boolean };
const whole = (g: string[]): Cut => {
  const text = g.join("");
  return { prefix: text, prefixCount: g.length, suffix: "", suffixCount: 0, text, truncated: false };
};
/** Keeps `keep` graphemes: from six up, at least three go to the tail and the head takes the rest; below that the two halves split evenly, the head one longer. */
export const cut = (g: string[], keep: number): Cut => {
  if (keep <= 0) return { prefix: "", prefixCount: 0, suffix: "", suffixCount: 0, text: "…", truncated: true };
  const tail = keep >= 6 ? Math.max(3, Math.floor(keep / 2)) : Math.floor(keep / 2);
  const head = keep - tail;
  const prefix = g.slice(0, head).join("");
  const suffix = tail > 0 ? g.slice(-tail).join("") : "";
  return { prefix, prefixCount: head, suffix, suffixCount: tail, text: `${prefix}…${suffix}`, truncated: true };
};
/** The widest cut that fits: a binary search over the number of graphemes kept. */
export const fitCut = (g: string[], avail: number, width: (s: string) => number, fullWidth?: number): Cut => {
  const full = g.join("");
  const w = fullWidth ?? width(full);
  if (avail <= 0 || g.length === 0 || w <= avail) return whole(g);
  let lo = 0;
  let hi = g.length - 1;
  let best = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;
    if (width(cut(g, mid).text) <= avail) {
      best = mid;
      lo = mid + 1;
    } else hi = mid - 1;
  }
  return best === -1 ? { prefix: "", prefixCount: 0, suffix: "", suffixCount: 0, text: "", truncated: true } : cut(g, best);
};
/** The part of the full value a selection over the cut text stands for; null when the selection does not span the ellipsis. */
export const expandSelection = (prefix: string, suffix: string, value: string, start: number, end: number): string | null => {
  const shown = `${prefix}…${suffix}`;
  if (start < 0 || end > shown.length || start >= end) return null;
  if (start === 0 && end === shown.length) return value;
  const gap = prefix.length;
  if (start > gap || end < gap + 1) return null;
  const all = graphemes(value);
  const before = graphemes(shown.slice(0, start)).length;
  const after = graphemes(shown.slice(gap + 1, end)).length;
  const tailAt = all.length - graphemes(suffix).length;
  return all.slice(before, tailAt + after).join("");
};
/** The same from the selection's text alone, keeping the whitespace around it. */
const expandText = (prefix: string, suffix: string, value: string, text: string): string | null => {
  const shown = `${prefix}…${suffix}`;
  const inner = text.trim();
  if (!inner) return null;
  const lead = text.slice(0, text.length - text.trimStart().length);
  const trail = text.slice(text.trimEnd().length);
  if (inner === shown) return lead + value + trail;
  if (!inner.includes("…")) return null;
  const at = shown.indexOf(inner);
  if (at === -1) return null;
  const expanded = expandSelection(prefix, suffix, value, at, at + inner.length);
  return expanded === null ? null : lead + expanded + trail;
};
/** Text offsets of a range inside an element. */
const offsetsIn = (el: Node, range: Range): { start: number; end: number } | null => {
  if (!el.contains(range.startContainer) || !el.contains(range.endContainer)) return null;
  try {
    const head = document.createRange();
    head.selectNodeContents(el);
    head.setEnd(range.startContainer, range.startOffset);
    const upTo = document.createRange();
    upTo.selectNodeContents(el);
    upTo.setEnd(range.endContainer, range.endOffset);
    return { start: head.toString().length, end: upTo.toString().length };
  } catch {
    return null;
  }
};

/** Resize work is batched per frame: every instance reads its width first, then every instance measures, so no read follows a write. */
const pending = new Map<object, () => (() => void) | null>();
let frame = 0;
const flush = () => {
  frame = 0;
  const reads = [...pending.values()];
  pending.clear();
  for (const measure of reads.map((read) => read())) measure?.();
};
const schedule = (key: object, read: () => (() => void) | null) => {
  pending.set(key, read);
  if (frame === 0 && typeof requestAnimationFrame !== "undefined") frame = requestAnimationFrame(flush);
};
const unschedule = (key: object) => {
  pending.delete(key);
  if (pending.size === 0 && frame !== 0) {
    cancelAnimationFrame(frame);
    frame = 0;
  }
};

/**
 * Middle truncate: keeps the head and the tail of `value` around one ellipsis glyph, cut to the
 * width of the container (a resize or a font load re-measures). The root is an inline grid: a
 * hidden copy of the full value sets its intrinsic width, the visible text sits over it, and an
 * absolute hidden span measures candidate cuts. When cut, the root carries the full value as its
 * title, a visually hidden span keeps it for assistive tech, and a copy of the visible text yields
 * the matching part of the full value.
 */
@customElement("acme-middle-truncate")
export class AcmeMiddleTruncate extends AcmeElement {
  static styles = [
    sharedCss,
    middleTruncateCss,
    css`
      :host {
        display: block;
      }
    `,
  ];
  @property() value = "";
  @state() private shown: Cut = whole([]);
  @query(".truncate") private root!: HTMLElement;
  @query(".measure") private probe!: HTMLElement;
  @query(".text") private textEl!: HTMLElement;
  private ro?: ResizeObserver;
  private widths = new Map<string, number>();
  private cacheKey = "";
  private last: { avail: number; typography: string; value: string } | null = null;
  private readonly key = {};

  connectedCallback() {
    super.connectedCallback();
    if (typeof ResizeObserver !== "undefined") this.ro = new ResizeObserver(this.queue);
    else window.addEventListener("resize", this.queue);
    document.fonts?.addEventListener?.("loadingdone", this.fontsChanged);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.ro?.disconnect();
    window.removeEventListener("resize", this.queue);
    document.fonts?.removeEventListener?.("loadingdone", this.fontsChanged);
    unschedule(this.key);
  }
  firstUpdated() {
    this.ro?.observe(this.root);
    this.refit();
  }
  updated(ch: Map<string, unknown>) {
    if (ch.has("value")) this.refit();
  }

  /** The width available and the typography the measurement depends on. */
  private read = () => {
    if (!this.root || !this.probe) return null;
    const s = getComputedStyle(this.probe);
    const typography = [s.fontFamily, s.fontFeatureSettings, s.fontKerning, s.fontSize, s.fontStretch, s.fontStyle, s.fontVariationSettings, s.fontWeight, s.letterSpacing, s.textTransform].join("\0");
    return { avail: this.root.clientWidth, typography };
  };
  private queue = () =>
    schedule(this.key, () => {
      const r = this.read();
      return r === null ? null : () => this.measure(r);
    });
  private fontsChanged = () => {
    this.widths.clear();
    this.last = null;
    this.queue();
  };
  /** Cuts `value` to the width read; widths of candidate texts are cached per typography and value. */
  private measure({ avail, typography }: { avail: number; typography: string }) {
    const probe = this.probe;
    if (!probe) return;
    const value = this.value;
    if (this.last?.avail === avail && this.last.typography === typography && this.last.value === value) return;
    this.last = { avail, typography, value };
    const g = graphemes(value);
    if (avail <= 0) {
      this.setShown(whole(g));
      return;
    }
    const key = `${typography}\0${value}`;
    if (this.cacheKey !== key) {
      this.cacheKey = key;
      this.widths.clear();
    }
    const width = (s: string) => {
      const hit = this.widths.get(s);
      if (hit !== undefined) return hit;
      probe.textContent = s;
      const w = probe.scrollWidth;
      this.widths.set(s, w);
      return w;
    };
    this.setShown(fitCut(g, avail, width));
  }
  private setShown(c: Cut) {
    const s = this.shown;
    if (s.text === c.text && s.truncated === c.truncated && s.prefix === c.prefix && s.prefixCount === c.prefixCount && s.suffix === c.suffix && s.suffixCount === c.suffixCount) return;
    this.shown = c;
  }
  /** Measures now, outside the frame batch: the first layout, and a new value. */
  refit() {
    const r = this.read();
    if (r) this.measure(r);
  }

  private onCopy = (e: ClipboardEvent) => {
    if (e.defaultPrevented || !this.shown.truncated) return;
    const sel = (this.renderRoot as unknown as { getSelection?: () => Selection | null }).getSelection?.() ?? window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const text = sel.toString();
    if (!text) return;
    const range = sel.getRangeAt(0);
    const root = e.currentTarget as HTMLElement;
    const { prefix, suffix } = this.shown;
    let out: string | null = null;
    if (text.includes("…") && root.contains(range.startContainer) && root.contains(range.endContainer) && this.textEl) {
      const o = offsetsIn(this.textEl, range);
      if (o) out = expandSelection(prefix, suffix, this.value, o.start, o.end);
    }
    out ??= expandText(prefix, suffix, this.value, text);
    if (out !== null) {
      e.preventDefault();
      e.clipboardData?.setData("text/plain", out);
    }
  };

  render() {
    const { truncated, prefix, suffix } = this.shown;
    const value = this.value;
    return html`<span class="truncate" title=${truncated ? value : nothing} part="text" @copy=${this.onCopy}
      >${truncated ? html`<span class="full">${value}</span>` : nothing}<span class="sizer" aria-hidden="true">${value}</span
      ><span class="text" aria-hidden=${truncated ? "true" : nothing}
        >${truncated ? html`<span>${prefix}</span><span>…</span><span>${suffix}</span>` : value}</span
      ><span class="measure" aria-hidden="true"></span
    ></span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-middle-truncate": AcmeMiddleTruncate;
  }
}
