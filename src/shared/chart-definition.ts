import { areaY, barY, type ChartPoint, type ChartValue, type DomChartDefinition, defineChart, group, lineY } from "@tanstack/charts";
import { scaleBand } from "@tanstack/charts/scales/band";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import { scalePoint } from "@tanstack/charts/scales/point";
import { tooltip } from "@tanstack/charts/tooltip";
import { portal } from "@tanstack/charts/tooltip/portal";
import { scaleUtc } from "d3-scale";
import { type ChartDatum, type ChartRow, type ChartSeries, chartPoints } from "./chart-data";
export type ChartType = "line" | "bar" | "area";
export type ChartPointInfo = ChartPoint<ChartDatum, ChartValue, number>;
export function formatChartX(value: ChartValue | undefined, locale?: string) {
  if (value === undefined) return "—";
  if (value instanceof Date) return value.toISOString();
  return typeof value === "number" ? new Intl.NumberFormat(locale, { maximumSignificantDigits: 21 }).format(value) : value;
}
export function formatChartY(value: number | undefined, series: ChartSeries | undefined, locale?: string) {
  if (value === undefined) return "—";
  const result = series?.formatter ? series.formatter(value) : new Intl.NumberFormat(locale, { maximumSignificantDigits: 21 }).format(value);
  if (typeof result !== "string") throw new TypeError("Chart formatters must return text");
  return result;
}
export function chartDefinition(options: {
  data: readonly ChartRow[];
  series: readonly ChartSeries[];
  x: string;
  type: ChartType;
  points: boolean;
  grid: boolean;
  tooltip: boolean;
  locale?: string;
  sparkline?: boolean;
}): {definition:DomChartDefinition<ChartDatum,ChartValue,number>;model:ReturnType<typeof chartPoints>} {
  const model = chartPoints(options.data, options.x, options.series);
  let dateMin = Infinity,
    dateMax = -Infinity;
  for (const point of model.values)
    if (point.x instanceof Date) {
      dateMin = Math.min(dateMin, point.x.getTime());
      dateMax = Math.max(dateMax, point.x.getTime());
    }
  const extent = Number.isFinite(dateMin) ? dateMax - dateMin : 0;
  const dateTicks = new Intl.DateTimeFormat(
    options.locale,
    extent >= 86400000
      ? { timeZone: "UTC", month: "short", day: "numeric", ...(extent > 31536000000 ? { year: "numeric" as const } : {}) }
      : { timeZone: "UTC", hour: "numeric", minute: "2-digit", second: "2-digit", ...(extent < 60000 ? { fractionalSecondDigits: 3 as const } : {}) },
  );
  const xScale =
    model.kind === "number" ? scaleLinear : model.kind === "date" ? scaleUtc : options.type === "bar" ? () => scaleBand<ChartValue>().padding(0.3) : () => scalePoint<ChartValue>().padding(0.2);
  const marks =
    options.type === "bar"
      ? [
          barY(model.values, {
            id: "bars",
            x: (point) => point.x,
            y1: 0,
            y2: (point) => point.y,
            z: (point) => point.seriesKey,
            key: (point) => point.key,
            fill: (point) => point.color,
            layout: group(),
            radius: 2,
          }),
        ]
      : options.series.flatMap((series) => {
          const values = model.values.filter((point) => point.seriesKey === series.key),
            color = values[0]?.color ?? "currentColor";
          if (options.sparkline) {
            let minimum = Infinity;
            for (const point of values) if (point.y !== undefined) minimum = Math.min(minimum, point.y);
            return [
              areaY(values, {
                id: series.key + "-fill",
                x: (point) => point.x,
                y1: Number.isFinite(minimum) ? minimum : 0,
                y2: (point) => point.y,
                key: (point) => point.key,
                fill: color,
                fillOpacity: 0.12,
              }),
              lineY(values, { id: series.key, x: (point) => point.x, y: (point) => point.y, key: (point) => point.key, stroke: color, strokeWidth: 1.5 }),
            ];
          }
          return options.type === "area"
            ? [areaY(values, { id: series.key, x: (point) => point.x, y1: 0, y2: (point) => point.y, key: (point) => point.key, fill: color, fillOpacity: 0.16, stroke: color, strokeWidth: 2 })]
            : [
                lineY(values, {
                  id: series.key,
                  x: (point) => point.x,
                  y: (point) => point.y,
                  key: (point) => point.key,
                  stroke: color,
                  strokeWidth: options.sparkline ? 1.5 : 2,
                  points: options.points,
                }),
              ];
        });
  const definition = defineChart({
    marks,
    scales: {
      x: {
        scale: xScale,
        grid: false,
        axis: options.sparkline ? false : { ticks: { format: (value: ChartValue) => (value instanceof Date ? dateTicks.format(value) : formatChartX(value, options.locale)) } },
      },
      y: {
        scale: scaleLinear,
        nice: !options.sparkline,
        grid: options.grid && !options.sparkline,
        axis: options.sparkline ? false : { ticks: { format: (value: number) => formatChartY(value, options.series.length === 1 ? options.series[0] : undefined, options.locale) } },
      },
    },
    theme: { foreground: "var(--ds-gray-1000)", muted: "var(--ds-gray-900)", grid: "var(--ds-gray-200)", background: "transparent" },
    guides: !options.sparkline,
    margin: options.sparkline ? 2 : undefined,
    svgAnimation: false,
    keyboard: !options.sparkline,
    pointer: !options.sparkline,
    focus: options.sparkline ? false : "group-x",
    tooltip:
      options.tooltip && !options.sparkline
        ? {
            use: tooltip,
            portal,
            sticky: false,
            className: "chart-tooltip",
            content: (points) => ({
              title: formatChartX(points[0]?.xValue, options.locale),
              rows: points.map((point) => ({
                label: point.datum.seriesLabel,
                value: formatChartY(
                  point.datum.y,
                  options.series.find((series) => series.key === point.datum.seriesKey),
                  options.locale,
                ),
                color: point.datum.color,
              })),
            }),
          }
        : false,
  });
  return { definition, model };
}
