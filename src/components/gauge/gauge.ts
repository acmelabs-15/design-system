import { css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { AcmeElement, paths, sharedCss } from "../../base";
import { gaugeCss } from "./gauge.styles";

/** Either value thresholds to colors (`{"0": "...", "34": "...", "68": "..."}`) or `{ primary, secondary }`. */
export type GaugeColors = Record<string, string>;
export type GaugeSize = "tiny" | "small" | "medium" | "large";

/** The default scale: red-800 below 34, amber-700 below 68, green-700 from 68. */
const DEFAULT_COLORS: GaugeColors = { "0": "var(--ds-red-800)", "34": "var(--ds-amber-700)", "68": "var(--ds-green-700)" };
const PX: Record<GaugeSize, number> = { tiny: 20, small: 32, medium: 64, large: 128 };
/** Extra gap between the arcs, in percent, per size. */
const EXTRA_GAP: Record<GaugeSize, number> = { tiny: 3, small: 2, medium: 1, large: 1 };
const ICON_PX: Record<GaugeSize, number> = { tiny: 10, small: 16, medium: 32, large: 64 };
const LABEL: Record<GaugeSize, { size: number; weight: number } | null> = { tiny: null, small: { size: 11, weight: 500 }, medium: { size: 18, weight: 500 }, large: { size: 32, weight: 600 } };

/**
 * Gauge: a ring in a 100-unit box (stroke 15 for tiny, 10 otherwise) with round caps, drawn as
 * two arcs whose lengths and rotations come from CSS variables the root sets. Sizes tiny 20 ·
 * small 32 · medium 64 · large 128. The primary arc colour follows the value on a threshold
 * scale, or `colors`; `arc-priority="equal"` shares the gap between both arcs; `show-value`
 * prints the number in the middle; `indeterminate` grays both arcs and shows an icon instead.
 */
@customElement("acme-gauge")
export class AcmeGauge extends AcmeElement {
  static styles = [
    sharedCss,
    gaugeCss,
    css`
      :host {
        display: grid;
      }
    `,
  ];
  @property({ type: Number }) value = 0;
  @property() size: GaugeSize = "small";
  /** JSON: value thresholds to colors, or `{ "primary": "...", "secondary": "..." }`. */
  @property({ type: Object }) colors: GaugeColors | null = null;
  /** `equal` trims both arcs by the same gap so a ratio reads exactly; `primary` keeps the primary arc whole. */
  @property({ attribute: "arc-priority" }) arcPriority: "primary" | "equal" = "primary";
  @property({ type: Boolean, attribute: "show-value" }) showValue = false;
  /** Both arcs gray with an icon in the middle; the value is not announced. */
  @property({ type: Boolean }) indeterminate = false;

  /** The primary and secondary colours: `colors.primary`/`secondary`, or the largest threshold at or below the value. */
  private palette(v: number): [string | undefined, string | undefined] {
    const c = this.colors ?? DEFAULT_COLORS;
    if ("primary" in c) return [c.primary, c.secondary];
    const keys = Object.keys(c)
      .map(Number)
      .filter((n) => !Number.isNaN(n))
      .sort((a, b) => a - b);
    const hit = keys.filter((k) => v >= k).pop();
    return [hit !== undefined ? c[String(hit)] : undefined, undefined];
  }

  render() {
    const v = Number(this.value) || 0;
    const size = this.size in PX ? this.size : "small";
    const px = PX[size];
    const stroke = px <= PX.tiny ? 15 : 10;
    const circumference = 2 * Math.PI * (50 - stroke / 2);
    let gap = Math.round((100 / circumference) * stroke) + EXTRA_GAP[size];
    if (v === 0 || v >= 100) gap = 0;
    const offset = this.arcPriority === "equal" ? 0.5 : 0;
    const primary = v - 2 * gap * offset;
    const secondary = 100 - v - 2 * gap * (1 - offset) - Math.max(1 - primary, 0);
    const [primaryColor, secondaryColor] = this.palette(v);
    const circle = { cx: 50, cy: 50, r: 50 - stroke / 2 };
    const label = LABEL[size];
    return html`<div
      class=${this.cls("gauge", { indeterminate: this.indeterminate })}
      role="progressbar"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow=${this.indeterminate ? nothing : v}
      style=${styleMap({ "--circle-size": "100px", "--circumference": String(circumference), "--percent-to-px": `${circumference / 100}px`, "--gap-percent": String(gap), "--offset-factor": String(offset) })}
      part="gauge"
    >
      <svg class="ring" aria-hidden="true" fill="none" width=${px} height=${px} stroke-width="2" viewBox="0 0 100 100">
        <circle class="secondary" cx=${circle.cx} cy=${circle.cy} r=${circle.r} stroke-width=${stroke} stroke-dashoffset="0" stroke-linecap="round" stroke-linejoin="round" stroke=${secondaryColor ?? "var(--ds-gray-alpha-400)"} style=${styleMap({ opacity: secondary < 0 || v === 100 ? "0" : "1", "--stroke-percent": String(secondary) })}></circle>
        <circle class="primary" cx=${circle.cx} cy=${circle.cy} r=${circle.r} stroke-width=${stroke} stroke-dashoffset="0" stroke-linecap="round" stroke-linejoin="round" stroke=${primaryColor ?? "var(--acme-foreground)"} style=${styleMap({ opacity: v !== 0 ? "1" : "0", "--stroke-percent": String(Math.min(100 - gap, primary)) })}></circle>
      </svg>
      ${
        this.showValue
          ? html`<div class="label" aria-hidden="true">${label ? html`<p class="value" style=${styleMap({ fontSize: `${label.size}px`, fontWeight: String(label.weight) })}>${v}</p>` : nothing}</div>`
          : nothing
      }
      ${this.indeterminate ? html`<svg class="icon" width=${ICON_PX[size]} height=${ICON_PX[size]} viewBox="0 0 24 24" style="color:var(--ds-gray-900)" aria-hidden="true"><path d=${paths.bolt} fill="currentColor"></path></svg>` : nothing}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-gauge": AcmeGauge;
  }
}
