import type { ChartRendererRenderContext, ChartTooltipBodyTarget, ChartValue } from "@tanstack/charts";
import { createAtom } from "@tanstack/lit-store";
import { html, nothing, render } from "lit";
import { property } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { AcmeElement, boolish, sharedCss } from "../../base";
import { chartSurfaceCss } from "../../generated/components/chart/chart-surface.styles";
import { atomState } from "../../shared/atom-state";
import { type ChartDatum, type ChartRow, type ChartSeries, snapshotChartData, snapshotChartSeries } from "../../shared/chart-data";
import { type ChartPointInfo, type ChartType, chartDefinition, formatChartX, formatChartY } from "../../shared/chart-definition";
import { ChartSurface } from "../../shared/chart-surface";
import { message, messageCatalogs } from "../../shared/messages";
import { StoreSelector } from "../../shared/store-connection";

export type { ChartRow, ChartSeries } from "../../shared/chart-data";
/** A named data chart with keyboard inspection and an exact-value table.
 * @slot header - Visible heading and explanatory content.
 * @slot legend - Application-owned Legend or visibility controls.
 * @slot tooltip - Supplementary noninteractive point information.
 * @slot empty - Empty-data presentation.
 * @csspart root - Figure container.
 * @csspart plot - Chart renderer container.
 * @csspart axes - Rendered axis group.
 * @csspart grid - Rendered grid group.
 * @csspart tooltip - Point information body.
 * @csspart data - Exact-value disclosure.
 * @fires {CustomEvent<{action:"point",seriesKey:string,index:number}>} acme-request - Opt-in point activation request.
 */
export class AcmeChart extends AcmeElement {
  static styles = [sharedCss, chartSurfaceCss];
  @atomState() private records: readonly ChartRow[] = Object.freeze([]);
  /** @default [] */
  @property({ noAccessor: true, type: Array, useDefault: true }) get data() {
    return this.records;
  }
  set data(value: readonly ChartRow[]) {
    const previous = this.records;
    this.records = snapshotChartData(value);
    this.requestUpdate("data", previous);
  }
  @atomState() private seriesRecords: readonly ChartSeries[] = Object.freeze([]);
  /** @default [] */
  @property({ noAccessor: true, type: Array, useDefault: true }) get series() {
    return this.seriesRecords;
  }
  set series(value: readonly ChartSeries[]) {
    const next = snapshotChartSeries(value);
    for (const series of next)
      if (series.color && this.ownerDocument.defaultView?.CSS && !this.ownerDocument.defaultView.CSS.supports("color", series.color)) throw new TypeError("Chart series color requires a CSS color");
    const previous = this.seriesRecords;
    this.seriesRecords = next;
    this.requestUpdate("series", previous);
  }
  @atomState() @property({ noAccessor: true, useDefault: true }) x = "x";
  @atomState() private kind: ChartType = "line";
  /** @default "line" */
  @property({ noAccessor: true, useDefault: true }) get type() {
    return this.kind;
  }
  set type(value: ChartType) {
    if (!["line", "bar", "area"].includes(value)) throw new TypeError("Invalid Chart type");
    const previous = this.kind;
    this.kind = value;
    this.requestUpdate("type", previous);
  }
  @atomState() private blockSize = "180px";
  /** @default "180px" */
  @property({ noAccessor: true, useDefault: true }) get height() {
    return this.blockSize;
  }
  set height(value: string) {
    if (
      typeof value !== "string" ||
      !value.trim() ||
      /^(initial|inherit|unset|revert)/i.test(value) ||
      (this.ownerDocument.defaultView?.CSS && !this.ownerDocument.defaultView.CSS.supports("height", value))
    )
      throw new TypeError("Chart height requires a CSS dimension");
    const previous = this.blockSize;
    this.blockSize = value;
    this.requestUpdate("height", previous);
  }
  @atomState() @property({ noAccessor: true, type: Boolean }) points = false;
  @atomState() @property({ noAccessor: true, converter: boolish, useDefault: true }) grid = true;
  @atomState() @property({ noAccessor: true, converter: boolish, useDefault: true }) tooltip = true;
  @atomState() @property({ noAccessor: true, useDefault: true }) label = "";
  @atomState() @property({ noAccessor: true, type: Boolean }) interactive = false;
  @atomState() private measuredHeight = 180;
  private readonly prepared = createAtom(() =>
    chartDefinition({
      data: this.data,
      series: this.series,
      x: this.x,
      type: this.type,
      points: this.points,
      grid: this.grid,
      tooltip: this.tooltip,
      locale: this.themeContext.scope.effective.get().locale,
    }),
  );
  private readonly updates = new StoreSelector(this, () => this.prepared);
  private readonly messages = new StoreSelector(this, () => messageCatalogs);
  private readonly plot = new ChartSurface(
    this,
    () => this.plotElement,
    () =>
      this.hasValues && this.label.trim() && this.measuredHeight > 0
        ? {
            definition: this.prepared.get().definition,
            height: this.measuredHeight,
            ariaLabel: this.label,
            ariaDescription: this.text("description", "Use arrow keys to inspect points. Open View data for exact values."),
            idPrefix: this.chartId,
            onSelect: this.selectPoint,
            onRender: this.rendered,
            onTooltipBodyChange: this.tooltipBody,
          }
        : undefined,
  );
  private static sequence = 0;
  private readonly chartId = "acme-chart-" + ++AcmeChart.sequence;
  private tooltipTarget?: HTMLElement;
  private resize?: ResizeObserver;
  private warned = false;
  private get plotElement() {
    return this.renderRoot?.querySelector<HTMLElement>("[part=plot]") ?? undefined;
  }
  private get hasValues() {
    return this.prepared.get().model.values.some((point) => point.x !== undefined && point.y !== undefined);
  }
  private text(key: string, fallback: string) {
    return message(this.themeContext.scope.effective.get().locale, "chart." + key, fallback);
  }
  private selectPoint = (point: ChartPointInfo | null) => {
    if (!this.interactive || !point) return;
    const current = this.prepared.get().model.values.find((value) => value.key === point.datum.key);
    if (current)
      this.dispatchEvent(
        new CustomEvent("acme-request", { detail: Object.freeze({ action: "point", seriesKey: current.seriesKey, index: current.index }), bubbles: true, composed: true, cancelable: true }),
      );
  };
  private rendered = ({ surface }: ChartRendererRenderContext<ChartDatum, ChartValue, number>) => {
    const root = surface.element;
    root.querySelector(".ts-chart__axes")?.setAttribute("part", "axes");
    root.querySelector(".ts-chart__grid")?.setAttribute("part", "grid");
  };
  private tooltipBody = (target: ChartTooltipBodyTarget<ChartDatum, ChartValue, number> | null) => {
    if (this.tooltipTarget && this.tooltipTarget !== target?.element) render(nothing, this.tooltipTarget);
    this.tooltipTarget = target?.element;
    if (!target) return;
    const content = target.content;
    render(
      html`<div part="tooltip">${typeof content === "string" ? content : html`<div class="tooltip-title">${content.title}</div>${content.rows.map((row) => html`<div class="tooltip-row"><span class="swatch" aria-hidden="true" style=${styleMap({ background: row.color ?? "currentColor" })}></span><span>${row.label}</span><b>${row.value}</b></div>`)}`}<slot name="tooltip"></slot></div>`,
      target.element,
    );
  };
  private measure = () => {
    const height = this.plotElement?.getBoundingClientRect().height ?? 0;
    if (Math.abs(height - this.measuredHeight) > 0.1) this.measuredHeight = height;
  };
  protected firstUpdated() {
    this.resize = new ResizeObserver(this.measure);
    if (this.plotElement) this.resize.observe(this.plotElement);
    this.measure();
  }
  protected updated() {
    if (this.hasValues && !this.label.trim() && !this.warned) {
      console.warn(this.localName, { code: "missing-label", message: "Chart requires a meaningful label" });
      this.warned = true;
    } else if (this.label.trim()) this.warned = false;
    this.measure();
  }
  connectedCallback() {
    super.connectedCallback();
    if (this.hasUpdated) {
      this.resize = new ResizeObserver(this.measure);
      if (this.plotElement) this.resize.observe(this.plotElement);
      this.measure();
      this.requestUpdate();
    }
  }
  disconnectedCallback() {
    this.resize?.disconnect();
    this.resize = undefined;
    if (this.tooltipTarget) render(nothing, this.tooltipTarget);
    this.tooltipTarget = undefined;
    super.disconnectedCallback();
  }
  focus(options?: FocusOptions) {
    this.plotElement?.querySelector<SVGSVGElement>("svg")?.focus(options);
  }
  render() {
    const locale = this.themeContext.scope.effective.get().locale,
      model = this.prepared.get().model;
    return html`<figure part="root"><slot name="header"></slot><div class="plot-frame" style=${styleMap({ "--_chart-height": this.height })}><div part="plot" ?hidden=${!this.hasValues}></div>${this.hasValues ? nothing : html`<div class="empty"><slot name="empty">${this.text("empty", "No data")}</slot></div>`}</div><slot name="legend"></slot>${this.data.length && this.series.length ? html`<acme-collapsible part="data"><acme-collapsible-trigger>${this.text("viewData", "View data")}</acme-collapsible-trigger><acme-collapsible-content><acme-table><table><caption>${this.label}</caption><thead><tr><th scope="col">${this.x}</th>${this.series.map((series) => html`<th scope="col">${series.label}</th>`)}</tr></thead><tbody>${this.data.map((_, index) => html`<tr><th scope="row">${formatChartX(model.rows[index]?.[0]?.x, locale)}</th>${this.series.map((series, seriesIndex) => html`<td>${formatChartY(model.rows[index]?.[seriesIndex]?.y, series, locale)}</td>`)}</tr>`)}</tbody></table></acme-table></acme-collapsible-content></acme-collapsible>` : nothing}</figure>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-chart": AcmeChart;
  }
}
