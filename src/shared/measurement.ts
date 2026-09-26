export type MeasurementTone = "neutral" | "success" | "warning" | "error";
export type ProgressReading = { kind: "invalid"; code: string } | { kind: "indeterminate"; max: number } | { kind: "determinate"; max: number; value: number; ratio: number; clamped: boolean };
export function resolveProgress(value: number | undefined, max: number): ProgressReading {
  if (!Number.isFinite(max) || max <= 0) {
    return { kind: "invalid", code: "invalid-progress-maximum" };
  }
  if (value === undefined) {
    return { kind: "indeterminate", max };
  }
  if (!Number.isFinite(value)) {
    return { kind: "invalid", code: "invalid-progress-value" };
  }
  const bounded = Math.max(0, Math.min(max, value));
  return { kind: "determinate", max, value: bounded, ratio: bounded / max, clamped: bounded !== value };
}
export type MeterInput = Readonly<{ value?: number; min: number; max: number; low?: number; high?: number; optimum?: number; loading?: boolean }>;
export type MeterReading =
  | { kind: "invalid"; code: string }
  | { kind: "empty" | "loading" }
  | { kind: "known"; min: number; max: number; value: number; ratio: number; low: number; high: number; optimum: number; tone: MeasurementTone; clamped: boolean };
export function resolveMeter(input: MeterInput): MeterReading {
  const { min, max, value } = input;
  if (!Number.isFinite(min) || !Number.isFinite(max) || max <= min) {
    return { kind: "invalid", code: "invalid-meter-range" };
  }
  const low = input.low ?? min,
    high = input.high ?? max,
    optimum = input.optimum ?? min / 2 + max / 2;
  if (![low, high, optimum].every(Number.isFinite) || low < min || high > max || low > high || optimum < min || optimum > max) {
    return { kind: "invalid", code: "invalid-meter-thresholds" };
  }
  if (input.loading) {
    return { kind: "loading" };
  }
  if (value === undefined) {
    return { kind: "empty" };
  }
  if (!Number.isFinite(value)) {
    return { kind: "invalid", code: "invalid-meter-value" };
  }
  const bounded = Math.max(min, Math.min(max, value)),
    difference = max - min,
    scale = Math.max(Math.abs(min), Math.abs(max));
  const ratio = Number.isFinite(difference) ? (bounded - min) / difference : (bounded / scale - min / scale) / (max / scale - min / scale);
  let tone: MeasurementTone = "neutral";
  if (input.low !== undefined || input.high !== undefined) {
    if (optimum < low) {
      tone = bounded <= low ? "success" : bounded <= high ? "warning" : "error";
    } else if (optimum > high) {
      tone = bounded >= high ? "success" : bounded >= low ? "warning" : "error";
    } else {
      tone = bounded >= low && bounded <= high ? "success" : "warning";
    }
  }
  return { kind: "known", min, max, value: bounded, ratio, low, high, optimum, tone, clamped: bounded !== value };
}
export type MeterSize = "tiny" | "small" | "medium" | "large";
/** Finite circular geometry with separate primary and remaining arcs. */
export function meterArcs(percent: number, size: MeterSize) {
  const stroke = size === "tiny" ? 15 : 10,
    radius = 50 - stroke / 2,
    circumference = 2 * Math.PI * radius;
  const bounded = Math.max(0, Math.min(100, percent));
  const gap = bounded === 0 || bounded === 100 ? 0 : Math.round((100 / circumference) * stroke) + { tiny: 3, small: 2, medium: 1, large: 1 }[size];
  return {
    stroke,
    radius,
    circumference,
    gap,
    primary: Math.max(0, Math.min(100 - gap, bounded)),
    secondary: Math.max(0, 100 - bounded - 2 * gap - Math.max(1 - bounded, 0)),
    secondaryRotation: 270 - gap * 3.6,
  };
}
