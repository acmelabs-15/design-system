import { areaY, barY, defineChart, lineY } from "@tanstack/charts";
import { mountChart } from "@tanstack/charts/dom";
import { scaleBand } from "@tanstack/charts/scales/band";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import { scalePoint } from "@tanstack/charts/scales/point";
import { tooltip } from "@tanstack/charts/tooltip";
import { css, html } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { legendCss } from "../legend/legend.styles";
import { chartCss } from "./chart.styles";

type Row = Record<string, unknown>;
type Host = { update(options: Record<string, unknown>): void; destroy(): void };

/**
 * House chart frame on TanStack Charts. Pass `data` (rows), `x` and one or more `y` keys and the
 * element draws a line, bar or area chart in the house series colors, with Geist's grid, mono
 * axes and the tooltip. Without `data`, the default slot takes a hand-drawn SVG as before.
 * Slots: head, default (custom plot), tip, legend.
 */
@customElement("acme-chart")
export class AcmeChart extends AcmeElement {
  static styles = [
    sharedCss,
    chartCss,
    legendCss,
    css`
      :host {
        display: block;
      }
      ::slotted(svg) {
        display: block;
        width: 100%;
        height: 100%;
        overflow: visible;
      }
      .host {
        width: 100%;
        height: 100%;
        font-family: var(--mono);
        font-size: 10px;
        color: var(--text-2);
      }
      .host svg {
        display: block;
        overflow: visible;
      }
      .host text {
        fill: var(--text-2);
      }
    `,
  ];
  @property({ type: Number }) height = 180;
  /** line, bar or area. */
  @property() type: "line" | "bar" | "area" = "line";
  /** Rows as JSON. */
  @property({ type: Array }) data: Row[] = [];
  /** The category or time key. */
  @property() x = "x";
  /** One key, or several separated by commas, each drawn as a series. */
  @property() y = "y";
  /** Show points on a line. */
  @property({ type: Boolean }) points = false;
  /** Hide the horizontal grid. */
  @property({ type: Boolean, attribute: "no-grid" }) noGrid = false;
  /** Hide the tooltip. */
  @property({ type: Boolean, attribute: "no-tooltip" }) noTooltip = false;
  @property({ attribute: "aria-label" }) label = "";
  @query(".host") private hostEl!: HTMLElement;
  private chart?: Host;

  private colors(): string[] {
    const s = getComputedStyle(this);
    return [1, 2, 3, 4, 5].map((i) => s.getPropertyValue(`--chart-${i}`).trim() || "currentColor");
  }

  private definition() {
    const keys = this.y
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);
    const colors = this.colors();
    const x = this.x;
    const marks = keys.map((key, i) => {
      const color = colors[i % colors.length];
      const common = { id: key, x: (d: Row) => String(d[x]), y: (d: Row) => Number(d[key]) };
      if (this.type === "bar") return barY(this.data, { ...common, fill: color, radius: 2 });
      if (this.type === "area") return areaY(this.data, { ...common, fill: color, fillOpacity: 0.16, stroke: color, strokeWidth: 2 });
      return lineY(this.data, { ...common, stroke: color, strokeWidth: 2, points: this.points });
    });
    const spec = {
      marks,
      scales: {
        x: { scale: this.type === "bar" ? () => scaleBand<string>().padding(0.3) : () => scalePoint<string>().padding(0.2), grid: false },
        y: { scale: scaleLinear, nice: true, grid: !this.noGrid },
      },
    };
    return this.noTooltip ? defineChart(spec as never) : defineChart(spec as never, { tooltip });
  }

  private options() {
    return { definition: this.definition(), height: this.height, ariaLabel: this.label || `${this.type} chart of ${this.y} by ${this.x}` };
  }

  updated() {
    if (!this.data.length || typeof ResizeObserver === "undefined" || !this.hostEl) return;
    if (this.chart) this.chart.update(this.options());
    else this.chart = mountChart(this.hostEl, this.options() as never) as unknown as Host;
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener("acme-change", this.onTheme);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("acme-change", this.onTheme);
    this.chart?.destroy();
    this.chart = undefined;
  }
  /** The series colors are read from the tokens, so a theme change redraws. */
  private onTheme = (e: Event) => {
    if ((e as CustomEvent).detail?.theme !== undefined) this.requestUpdate();
  };

  render() {
    return html`<div class="chart" part="chart"><slot name="head"></slot><div class="plot" style=${`min-height:${this.height}px;height:${this.height}px`}>${
      this.data.length ? html`<div class="host"></div>` : html`<slot></slot>`
    }<slot name="tip"></slot></div><slot name="legend"></slot></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-chart": AcmeChart;
  }
}
