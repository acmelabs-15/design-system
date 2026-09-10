import { css, html, nothing } from "lit";
import { customElement, property, query, queryAll } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { Interaction } from "../../shared/interaction";
import { labelCss } from "../label/label.styles";
import { sliderCss } from "./slider.styles";
import "../input/input";
import { atomState } from "../../shared/atom-state";

/** `value` as an attribute: a bare number (`value="40"`) or a JSON list (`value="[50, 75]"`). */
const values = {
  fromAttribute: (v: string | null): number[] => (v == null || v.trim() === "" ? [] : v.trim().startsWith("[") ? (JSON.parse(v) as number[]) : [Number(v)]),
  toAttribute: (v: number[]) => JSON.stringify(v),
};

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
/** The decimals a number is written with, so step arithmetic rounds to the precision of its operands. */
const decimals = (n: number): number => {
  if (n === 0) return 0;
  if (Math.abs(n) < 1) {
    const [mantissa, exp] = n.toExponential().split("e-");
    const frac = mantissa.split(".")[1];
    return (frac ? frac.length : 0) + parseInt(exp, 10);
  }
  const frac = n.toString().split(".")[1];
  return frac ? frac.length : 0;
};
/** Snaps a value to the step grid that starts at min. */
const snap = (v: number, step: number, min: number) => Number((Math.round((v - min) / step) * step + min).toFixed(Math.max(decimals(step), decimals(min))));
/** One step from a value in a direction, kept within the bounds. */
const stepFrom = (v: number, step: number, dir: 1 | -1, min: number, max: number) =>
  clamp(Number((dir === 1 ? v + step : v - step).toFixed(Math.max(decimals(v), decimals(step), decimals(min)))), min, max);
/** Whether neighbouring values keep the minimum gap. */
const spaced = (vals: number[], step: number, minSteps: number) => vals.length < 2 || Math.min(...vals.slice(1).map((v, i) => Math.abs(vals[i] - v))) >= step * minSteps;
const same = (a: number[], b: number[]) => a.length === b.length && a.every((v, i) => v === b[i]);
/**
 * A pointer move of one thumb in a range: the moved thumb pushes its neighbours along, each
 * keeping the minimum gap, and a pushed neighbour returns towards where it stood when the drag
 * started (`initial`) as the moved thumb comes back.
 */
function push(vals: number[], index: number, next: number, min: number, max: number, step: number, minSteps: number, initial: number[]): number[] {
  const out = vals.slice();
  const gap = step * minSteps;
  const last = out.length - 1;
  out[index] = clamp(next, min + index * gap, max - (last - index) * gap);
  for (let i = index + 1; i <= last; i++) {
    const lo = out[i - 1] + gap;
    const hi = max - (last - i) * gap;
    const was = initial[i] ?? out[i];
    let v = Math.max(out[i], lo);
    if (was < v) v = Math.max(was, lo);
    out[i] = clamp(v, lo, hi);
  }
  for (let i = index - 1; i >= 0; i--) {
    const hi = out[i + 1] - gap;
    const lo = min + i * gap;
    const was = initial[i] ?? out[i];
    let v = Math.min(out[i], hi);
    if (was > v) v = Math.min(was, hi);
    out[i] = clamp(v, lo, hi);
  }
  return out.map((v) => Number(v.toFixed(12)));
}
/** A keyboard or field change of one thumb: clamped to the bounds and, in a range, between its neighbours; the range stays sorted. */
function settle(vals: number[], index: number, next: number, min: number, max: number): number[] {
  const v = clamp(next, min, max);
  if (vals.length < 2) return [v];
  const out = vals.slice();
  out[index] = clamp(v, vals[index - 1] ?? Number.NEGATIVE_INFINITY, vals[index + 1] ?? Number.POSITIVE_INFINITY);
  return out.sort((a, b) => a - b);
}
const ARROWS = new Set(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]);
const HIDDEN = "clip-path:inset(50%);overflow:hidden;white-space:nowrap;border:0;padding:0;width:100%;height:100%;margin:-1px;position:fixed;top:0;left:0";

/**
 * A slider picks one value, or a range between two thumbs, from a track. The root is a column:
 * the label (a label element with the text block of the Label element, 13px gray-900,
 * capitalized unless `bypass-casing`) above a row that holds the optional start field, the group (the
 * 8px track, its blue fill and the 6×14 thumbs, each around a visually hidden range input) and
 * the optional end field, both 48px small acme-inputs. A thumb carries the focus states
 * (data-focus for a visible focus, data-focus-within for any focus) and data-dragging while it
 * is dragged; the group and its parts carry data-disabled. The pointer picks the nearest thumb
 * and drags it, pushing its neighbour along; the keyboard moves a thumb by `step` (Shift or
 * Page keys by `large-step`) and to its bounds with Home and End. `acme-change` fires on every
 * change, `acme-commit` when a drag ends and after every keyboard change. Form-associated: a
 * range submits `name` twice.
 */
@customElement("acme-slider")
export class AcmeSlider extends AcmeElement {
  static formAssociated = true;
  static styles = [
    sharedCss,
    labelCss,
    sliderCss,
    css`
      /* A block, as the column's context is (a form): the column is its block child and fills its width. */
      :host {
        display: block;
      }
    `,
  ];
  /** One value (`[50]` or `50`) or a range (`[50, 75]`). Defaults to `min`. */
  @property({ converter: values }) value: number[] = [];
  @property({ type: Number }) min = 0;
  @property({ type: Number }) max = 100;
  @property({ type: Number }) step = 1;
  /** The step of Page Up/Down and of a Shift + arrow key. */
  @property({ type: Number, attribute: "large-step" }) largeStep = 10;
  /** The least number of steps two thumbs keep between them. */
  @property({ type: Number, attribute: "min-steps-between-values" }) minStepsBetweenValues = 0;
  /** The form field name; a range submits it once per value. */
  @property() name = "";
  @property({ type: Boolean, reflect: true }) disabled = false;
  /** The text above the track. */
  @property() label = "";
  /** Keeps the label text as written. */
  @property({ type: Boolean, attribute: "bypass-casing" }) bypassCasing = false;
  /** The group fills the row instead of keeping its 216px minimum. */
  @property({ type: Boolean, attribute: "full-width" }) fullWidth = false;
  /** A small numeric field before the track, bound to the first value. */
  @property({ type: Boolean, attribute: "show-start-input" }) showStartInput = false;
  /** A small numeric field after the track, bound to the second value. */
  @property({ type: Boolean, attribute: "show-end-input" }) showEndInput = false;
  /** The accessible name of a thumb, by index. */
  @property({ attribute: false }) getAriaLabel?: (index: number) => string;
  /** The spoken value of a thumb: `(formatted, value, index)`. A range says "50 start range" / "75 end range" by default. */
  @property({ attribute: false }) getAriaValueText?: (formatted: string, value: number, index: number) => string;
  /** The thumb whose input has focus. */
  @atomState() private active = -1;
  /** The thumb used last, kept above the other. */
  @atomState() private lastUsed = -1;
  @atomState() private dragging = false;
  @query(".control") private control!: HTMLElement;
  @queryAll(".thumb") private thumbs!: NodeListOf<HTMLElement>;
  private internals?: ElementInternals;
  private initial: number[] = [];
  private uid = `slider-${Math.random().toString(36).slice(2, 8)}`;
  private interactions = [new Interaction(this, { disabled: () => this.disabled }), new Interaction(this, { disabled: () => this.disabled })];
  /** The thumb under the pointer, its offset from the thumb's centre, the values when the drag began, and the last value the drag set. */
  private pressed = -1;
  private offset = 0;
  private startValues: number[] = [];
  private lastDrag: number[] | null = null;
  constructor() {
    super();
    try {
      this.internals = this.attachInternals();
    } catch {}
  }
  connectedCallback() {
    super.connectedCallback();
    this.initial = this.value;
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.endDrag();
  }
  formResetCallback() {
    this.value = this.initial;
  }
  /** The values as drawn: a range sorted, a single value kept within the bounds. */
  private get shown(): number[] {
    const v = this.value;
    return v.length > 1 ? [...v].sort((a, b) => a - b) : [clamp(v[0] ?? this.min, this.min, this.max)];
  }
  willUpdate() {
    if (typeof this.value === "number") this.value = [this.value];
  }
  updated(ch: Map<string, unknown>) {
    const thumbs = this.thumbs;
    this.interactions[0].attach(thumbs[0]);
    this.interactions[1].attach(thumbs[1] ?? null);
    if (ch.has("value") || ch.has("name")) {
      if (!this.name) this.internals?.setFormValue?.(null);
      else {
        const data = new FormData();
        for (const v of this.shown) data.append(this.name, String(v));
        this.internals?.setFormValue?.(data);
      }
    }
  }
  private emit(type: "acme-change" | "acme-commit", value: number[]) {
    this.dispatchEvent(new CustomEvent(type, { detail: { value }, bubbles: true, composed: true }));
  }
  /** Sets the value when it differs; true when it did. */
  private setValue(next: number[]): boolean {
    if (next.some((v) => Number.isNaN(v)) || same(next, this.value)) return false;
    this.value = next;
    this.emit("acme-change", next);
    return true;
  }
  private input(index: number) {
    return this.thumbs[index]?.querySelector("input") as HTMLInputElement | null;
  }
  private focusThumb(index: number, visible: boolean) {
    this.input(index)?.focus({ preventScroll: true, focusVisible: visible } as FocusOptions);
  }
  /** The value under a pointer position, with the thumbs it pushes; null when no thumb is pressed. */
  private fromPointer(x: number): { value: number[]; index: number } | null {
    const index = this.pressed;
    const vals = this.shown;
    const range = vals.length > 1;
    if (index < 0 || index >= vals.length) return null;
    const rect = this.control.getBoundingClientRect();
    const cs = getComputedStyle(this.control);
    const px = (s: string) => (Number.isNaN(parseFloat(s)) ? 0 : parseFloat(s));
    const start = px(cs.borderInlineStartWidth) + px(cs.paddingInlineStart);
    const end = px(cs.borderInlineEndWidth) + px(cs.paddingInlineEnd);
    const span = rect.width - start - end;
    const rtl = getComputedStyle(this).direction === "rtl";
    const at = x - this.offset;
    const along = (rtl ? rect.right - at : at - rect.left) - start;
    let v = (this.max - this.min) * clamp(along / span, 0, 1) + this.min;
    v = clamp(snap(v, this.step, this.min), this.min, this.max);
    if (!range) return { value: [v], index };
    return { value: push(vals, index, v, this.min, this.max, this.step, this.minStepsBetweenValues, this.startValues), index };
  }
  private onPointerDown = (e: PointerEvent) => {
    if (this.disabled || e.button !== 0 || e.defaultPrevented) return;
    const thumbs = Array.from(this.thumbs);
    const target = e.composedPath()[0] as Node;
    const vals = this.shown;
    this.startValues = vals.slice();
    let index = thumbs.findIndex((t) => t.contains(target));
    if (index >= 0) {
      const r = thumbs[index].getBoundingClientRect();
      this.offset = e.clientX - (r.left + r.right) / 2;
      // Thumbs stacked at the maximum: the first of them moves.
      if (vals[index] === this.max) while (index > 0 && vals[index - 1] === this.max) index--;
    } else {
      this.offset = 0;
      let best = Number.POSITIVE_INFINITY;
      index = 0;
      thumbs.forEach((t, i) => {
        const r = t.getBoundingClientRect();
        const d = Math.abs(e.clientX - (r.left + r.right) / 2);
        if (d <= best) {
          best = d;
          index = i;
        }
      });
    }
    this.pressed = index;
    this.lastDrag = null;
    // The focus goes to the pressed thumb's input, and stays there.
    e.preventDefault();
    if (thumbs[index]?.contains(target) === false) {
      const next = this.fromPointer(e.clientX);
      if (next && this.setValue(next.value)) this.lastDrag = next.value;
    }
    this.focusThumb(index, false);
    this.dragging = true;
    try {
      this.control.setPointerCapture(e.pointerId);
    } catch {}
    window.addEventListener("pointermove", this.onPointerMove);
    window.addEventListener("pointerup", this.onPointerUp);
    window.addEventListener("pointercancel", this.onPointerUp);
  };
  private onPointerMove = (e: PointerEvent) => {
    if (e.buttons === 0) {
      this.onPointerUp(e);
      return;
    }
    const next = this.fromPointer(e.clientX);
    if (!next || !spaced(next.value, this.step, this.minStepsBetweenValues)) return;
    if (this.setValue(next.value)) this.lastDrag = next.value;
  };
  private onPointerUp = (e: PointerEvent) => {
    this.active = -1;
    this.dragging = false;
    if (this.lastDrag) this.emit("acme-commit", this.lastDrag);
    try {
      if (this.control?.hasPointerCapture(e.pointerId)) this.control.releasePointerCapture(e.pointerId);
    } catch {}
    this.endDrag();
  };
  private endDrag() {
    this.pressed = -1;
    this.offset = 0;
    this.startValues = [];
    this.lastDrag = null;
    window.removeEventListener("pointermove", this.onPointerMove);
    window.removeEventListener("pointerup", this.onPointerUp);
    window.removeEventListener("pointercancel", this.onPointerUp);
  }
  /** A keyboard or native change of one thumb's input: the value settles between its neighbours and is committed at once. */
  private fromInput(index: number, next: number) {
    const settled = settle(this.shown, index, next, this.min, this.max);
    if (!spaced(settled, this.step, this.minStepsBetweenValues)) return;
    if (this.setValue(settled)) this.emit("acme-commit", settled);
  }
  private onKeyDown = (index: number) => (e: KeyboardEvent) => {
    if (e.defaultPrevented) return;
    const vals = this.shown;
    const range = vals.length > 1;
    const { min, max, step, largeStep: large } = this;
    const gap = step * this.minStepsBetweenValues;
    const rtl = getComputedStyle(this).direction === "rtl";
    const n = snap(vals[index], step, min);
    const by = e.shiftKey ? large : step;
    let t: number | null = null;
    switch (e.key) {
      case "ArrowUp":
        t = stepFrom(n, by, 1, min, max);
        break;
      case "ArrowRight":
        t = stepFrom(n, by, rtl ? -1 : 1, min, max);
        break;
      case "ArrowDown":
        t = stepFrom(n, by, -1, min, max);
        break;
      case "ArrowLeft":
        t = stepFrom(n, by, rtl ? 1 : -1, min, max);
        break;
      case "PageUp":
        t = stepFrom(n, large, 1, min, max);
        break;
      case "PageDown":
        t = stepFrom(n, large, -1, min, max);
        break;
      case "End":
        t = range && Number.isFinite(vals[index + 1]) ? vals[index + 1] - gap : max;
        break;
      case "Home":
        t = range && Number.isFinite(vals[index - 1]) ? vals[index - 1] + gap : min;
        break;
      default:
        return;
    }
    if (ARROWS.has(e.key)) e.stopPropagation();
    // A key press makes the focus visible, on a thumb the pointer focused too.
    const input = e.currentTarget as HTMLInputElement;
    let visible = false;
    try {
      visible = input.matches(":focus-visible");
    } catch {}
    if (!visible) {
      input.blur();
      this.focusThumb(index, true);
    }
    this.fromInput(index, t);
    e.preventDefault();
  };
  /** A field change: the typed number replaces the value at that index, as typed. */
  private fromField = (index: number) => (e: Event) => {
    const n = Number((e as CustomEvent).detail?.value ?? "");
    if (Number.isNaN(n)) return;
    const next = this.value.slice();
    next[index] = n;
    this.setValue(next);
  };
  /** A click on the label focuses the control it names: the start field, or the first thumb. */
  private focusLabelled = (e: Event) => {
    const id = (e.currentTarget as HTMLLabelElement).htmlFor;
    (this.shadowRoot?.getElementById(id) as HTMLElement | null)?.focus();
  };
  private field(kind: "start" | "end", index: number) {
    const v = this.value[index];
    return html`<acme-input
      class=${`${kind}-input`}
      id=${kind === "start" ? `${this.uid}-start` : `${this.uid}-end`}
      size="small"
      type=${kind === "start" ? "text" : "number"}
      aria-label=${kind === "start" ? "Starting range value" : "Ending range value"}
      ?disabled=${this.disabled}
      .value=${v === undefined ? "" : String(v)}
      @acme-input=${this.fromField(index)}
    ></acme-input>`;
  }
  private thumb(v: number, i: number, range: boolean) {
    const pct = ((v - this.min) * 100) / (this.max - this.min);
    const z = range ? (this.active === i ? 2 : this.lastUsed === i ? 1 : 0) : this.active === i ? 1 : 0;
    const style = `position:absolute;inset-inline-start:${pct}%;top:50%;translate:-50% -50%${z ? `;z-index:${z}` : ""}`;
    const text = this.getAriaValueText ? this.getAriaValueText(String(v), v, i) : range ? `${v} ${i === 0 ? "start" : "end"} range` : nothing;
    const label = this.getAriaLabel ? this.getAriaLabel(i) : this.label || nothing;
    const on = (off = false) => (off ? nothing : "");
    return html`<div class="thumb" data-index=${i} data-orientation="horizontal" data-disabled=${on(!this.disabled)} data-dragging=${on(!this.dragging)} style=${style} part="thumb">
      <input
        type="range"
        id=${`${this.uid}-${i}`}
        min=${this.min}
        max=${this.max}
        step=${this.step}
        name=${this.name || nothing}
        ?disabled=${this.disabled}
        aria-orientation="horizontal"
        aria-valuenow=${v}
        aria-valuetext=${text}
        aria-label=${label}
        style=${HIDDEN}
        .value=${String(v)}
        @keydown=${this.onKeyDown(i)}
        @change=${(e: Event) => this.fromInput(i, (e.target as HTMLInputElement).valueAsNumber)}
        @focus=${() => {
          this.active = i;
          this.lastUsed = i;
        }}
        @blur=${() => {
          this.active = -1;
        }}
      />
    </div>`;
  }
  render() {
    const vals = this.shown;
    const range = vals.length > 1;
    const pct = (v: number) => ((v - this.min) * 100) / (this.max - this.min);
    const a = pct(vals[0]);
    const b = pct(vals[vals.length - 1]);
    const fill = range ? `position:relative;height:inherit;inset-inline-start:${a}%;width:${b - a}%` : `position:relative;height:inherit;inset-inline-start:0;width:${b}%`;
    const off = this.disabled ? "" : nothing;
    const drag = this.dragging ? "" : nothing;
    return html`<div class=${this.cls("slider", { full: this.fullWidth })} part="slider">
      ${this.label ? html`<label class=${this.cls("label", { plain: this.bypassCasing })} for=${this.showStartInput ? `${this.uid}-start` : `${this.uid}-0`} @click=${this.focusLabelled} part="label"><div class="text">${this.label}</div></label>` : nothing}
      <div class="row">
        ${this.showStartInput ? this.field("start", 0) : nothing}
        <div class="group" role="group" id=${this.uid} data-orientation="horizontal" data-disabled=${off} data-dragging=${drag} part="group">
          <div class="control" data-orientation="horizontal" data-disabled=${off} data-dragging=${drag} @pointerdown=${this.onPointerDown}>
            <div class="track" data-orientation="horizontal" data-disabled=${off} data-dragging=${drag} style="position:relative" part="track">
              <div class="fill" data-orientation="horizontal" data-disabled=${off} data-dragging=${drag} style=${fill} part="fill"></div>
              ${vals.map((v, i) => this.thumb(v, i, range))}
            </div>
          </div>
        </div>
        ${this.showEndInput ? this.field("end", 1) : nothing}
      </div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-slider": AcmeSlider;
  }
}
