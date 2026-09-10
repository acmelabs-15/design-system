import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { AcmeElement, sharedCss } from "../../base";
import "../tooltip/tooltip";
import { progressCss } from "./progress.styles";

export type ProgressType = "" | "success" | "error" | "warning" | "secondary";
export type ProgressStop = { value: number; tooltip?: string };

const TYPE_FG: Record<string, string> = {
  "": "var(--ds-gray-1000)",
  success: "var(--ds-blue-700)",
  error: "var(--ds-red-700)",
  warning: "var(--ds-amber-700)",
  secondary: "var(--ds-gray-700)",
};
const len = (v: string | number) => (typeof v === "number" || /^\d+(\.\d+)?$/.test(v) ? `${v}px` : v);

/**
 * Progress: a native progress bar (radius 6, gray-200 track) inside a relative wrapper that
 * carries the width and height; the bar's colour is the `--fg` variable the wrapper sets from
 * `type` or `colors`. `stops` draw 1px ticks at values, each with a hover tooltip; a bar with
 * stops has square value corners.
 */
@customElement("acme-progress")
export class AcmeProgress extends AcmeElement {
  static styles = [sharedCss, progressCss];
  @property({ type: Number }) value = 0;
  /** The real ceiling; the bar shows `value / max`. */
  @property({ type: Number }) max = 100;
  /** Hue by meaning: `success`, `error`, `warning`, `secondary`. */
  @property() type: ProgressType = "";
  /** Bar height in px. */
  @property({ type: Number }) height = 10;
  /** Bar width: a number in px or any CSS length (`50%`); unset is the full width. */
  @property() width = "";
  /** Ticks: `[{ value, tooltip? }]` or plain numbers. */
  @property({ type: Array }) stops: (number | ProgressStop)[] = [];
  /** Bar colour by threshold: `{ "0": "var(--ds-gray-1000)", "50": "var(--ds-amber-700)" }`; the highest key at or under `value` wins. */
  @property({ type: Object }) colors: Record<string, string> = {};
  @property({ attribute: "aria-label" }) label = "";

  private fg() {
    const keys = Object.keys(this.colors)
      .map(Number)
      .filter((k) => !Number.isNaN(k) && k <= this.value)
      .sort((a, b) => b - a);
    return keys.length ? this.colors[String(keys[0])] : (TYPE_FG[this.type] ?? TYPE_FG[""]);
  }

  updated() {
    // The host stands where the wrapper stands in its container: it takes the width, the wrapper fills it.
    this.style.width = this.width ? len(this.width) : "100%";
  }

  render() {
    const stops = this.stops.map((s) => (typeof s === "number" ? { value: s } : s));
    const height = `${this.height}px`;
    return html`<div class=${this.cls("progress", { "with-stops": stops.length > 0 })} style=${styleMap({ width: "100%", height })} part="progress">
      <progress class="bar" max=${this.max} value=${this.value} style=${styleMap({ width: "100%", "--fg": this.fg(), height })} aria-label=${this.label || nothing} part="bar"></progress>
      ${stops.map(
        (s) => html`<div class="stop" style=${`left:calc(${(s.value / this.max) * 100}% - 7px)`}>
            <acme-tooltip class="trigger" text=${s.tooltip ?? ""} style="grid-area:1 / 1"><span class="hit" style="width:14px;height:10px;--x-offset:2px" tabindex="0" role="img" aria-label=${s.tooltip ?? String(s.value)}></span></acme-tooltip>
            <div class="lines" style="grid-area:1 / 1"><div class="line"></div><div class="line-bg"></div></div>
          </div>`,
      )}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-progress": AcmeProgress;
  }
}
