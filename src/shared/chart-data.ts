import type { ChartValue } from "@tanstack/charts";
import { isPlainRecord } from "./plain-record";
export type ChartRow = Readonly<Record<string, unknown>>;
export type ChartSeries = Readonly<{ key: string; label: string; color?: string; formatter?: (value: number) => string }>;
export type ChartDatum = Readonly<{ key: string; index: number; seriesKey: string; seriesLabel: string; x: ChartValue | undefined; y: number | undefined; color: string }>;
function properties(value: unknown) {
  if (!isPlainRecord(value)) throw new TypeError("Chart data requires plain records");
  for (const key of Reflect.ownKeys(value)) {
    const descriptor = Object.getOwnPropertyDescriptor(value, key)!;
    if (typeof key !== "string" || !descriptor.enumerable || !("value" in descriptor)) throw new TypeError("Chart records require string data properties");
  }
  return value;
}
export function snapshotChartData(value: unknown): readonly ChartRow[] {
  if (value == null) return Object.freeze([]);
  if (!Array.isArray(value)) throw new TypeError("Chart data requires an array");
  return Object.freeze(value.map((row) => Object.freeze(Object.fromEntries(Object.entries(properties(row)).map(([key, value]) => [key, value instanceof Date ? new Date(value.getTime()) : value])))));
}
export function snapshotChartSeries(value: unknown): readonly ChartSeries[] {
  if (value == null) return Object.freeze([]);
  if (!Array.isArray(value)) throw new TypeError("Chart series requires an array");
  const keys = new Set<string>();
  return Object.freeze(
    value.map((item) => {
      const data = properties(item);
      if (
        Object.keys(data).some((key) => !["key", "label", "color", "formatter"].includes(key)) ||
        typeof data.key !== "string" ||
        !data.key.trim() ||
        keys.has(data.key) ||
        typeof data.label !== "string" ||
        !data.label.trim() ||
        (data.color !== undefined && typeof data.color !== "string") ||
        (data.formatter !== undefined && typeof data.formatter !== "function")
      )
        throw new TypeError("Chart series require unique keys, labels and optional color/formatter");
      keys.add(data.key);
      return Object.freeze({ key: data.key, label: data.label, color: data.color as string | undefined, formatter: data.formatter as ChartSeries["formatter"] });
    }),
  );
}
export function chartPoints(rows: readonly ChartRow[], xKey: string, series: readonly ChartSeries[]) {
  let kind: "category" | "number" | "date" | undefined;
  const xs = rows.map((row) => {
    const value = row[xKey];
    if (value == null) return undefined;
    const next = typeof value === "string" ? "category" : typeof value === "number" ? "number" : value instanceof Date ? "date" : undefined;
    if (!next) throw new TypeError("Chart x values require strings, numbers or Dates");
    if ((typeof value === "number" && !Number.isFinite(value)) || (value instanceof Date && !Number.isFinite(value.getTime()))) return undefined;
    if (kind && kind !== next) throw new TypeError("Chart x values must share one semantic kind");
    kind = next;
    return value as ChartValue;
  });
  const identities = rows.map((row, index) =>
    typeof row.id === "string" || typeof row.id === "number" ? String(row.id) : xs[index] instanceof Date ? String(xs[index].getTime()) : xs[index] === undefined ? String(index) : String(xs[index]),
  );
  const counts = new Map<string, number>();
  for (const id of identities) counts.set(id, (counts.get(id) ?? 0) + 1);
  const values = series.flatMap((item, seriesIndex) =>
    rows.map((row, index) => {
      const value = row[item.key];
      if (value != null && typeof value !== "number") throw new TypeError("Chart series values require numbers or absence");
      return Object.freeze({
        key: JSON.stringify([item.key, counts.get(identities[index]) === 1 ? identities[index] : index]),
        index,
        seriesKey: item.key,
        seriesLabel: item.label,
        x: xs[index],
        y: typeof value === "number" && Number.isFinite(value) ? value : undefined,
        color: item.color ?? `var(--chart-${(seriesIndex % 5) + 1})`,
      });
    }),
  );
  const byRow: ChartDatum[][] = rows.map(() => []);
  for (const point of values) byRow[point.index].push(point);
  return Object.freeze({ kind: kind ?? "category", values: Object.freeze(values), rows: Object.freeze(byRow.map((points) => Object.freeze(points))) });
}
