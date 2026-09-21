import { parseAbsolute, parseDate } from "@internationalized/date";

export type RelativeDate = string | number | Date;
/** ISO date-only values mean UTC midnight; timestamp strings require an explicit offset. */
export function relativeInstant(value: RelativeDate | undefined): number | undefined {
  if (value === undefined) return undefined;
  try {
    if (typeof value === "number") return new Date(value).getTime();
    if (typeof value === "string") {
      const text = value.trim();
      return /^(?:\d{4}|[+-]\d{6})-\d{2}-\d{2}$/.test(text) ? parseDate(text).toDate("UTC").getTime() : parseAbsolute(text, "UTC").toDate().getTime();
    }
    return Date.prototype.getTime.call(value);
  } catch {
    return NaN;
  }
}
export const relativeDateAttribute = {
  fromAttribute: (value: string | null): RelativeDate | undefined => (value === null || value.trim() === "" ? undefined : /^[+-]?\d+(?:\.\d+)?$/.test(value.trim()) ? Number(value) : value),
};

const units: readonly { max: number; duration: number; unit: Intl.RelativeTimeFormatUnit }[] = [
  { max: 45000, duration: 1000, unit: "second" },
  { max: 2760000, duration: 60000, unit: "minute" },
  { max: 72000000, duration: 3600000, unit: "hour" },
  { max: 518400000, duration: 86400000, unit: "day" },
  { max: 2419200000, duration: 604800000, unit: "week" },
  { max: 28512000000, duration: 2592000000, unit: "month" },
  { max: Infinity, duration: 31536000000, unit: "year" },
];
export type RelativeState = Readonly<{ value: number; unit: Intl.RelativeTimeFormatUnit; nextChange: number }>;
/** Uses elapsed-time units and schedules their exact rounded-value or unit transition. */
export function relativeState(instant: number, now: number, numeric: Intl.RelativeTimeFormatNumeric = "auto"): RelativeState {
  if (!Number.isFinite(instant) || !Number.isFinite(now)) throw new RangeError("Relative time requires finite instants");
  const difference = instant - now,
    index = units.findIndex((unit) => Math.abs(difference) < unit.max),
    selected = units[index];
  const value = Math.round(difference / selected.duration);
  let nextChange = instant - (value - 0.5) * selected.duration + 1;
  if (difference > 0 && index > 0) nextChange = Math.min(nextChange, instant - units[index - 1].max + 1);
  if (difference <= 0 && Number.isFinite(selected.max)) nextChange = Math.min(nextChange, instant + selected.max);
  if (numeric === "always" && value === 0 && !Object.is(value, -0) && difference >= 0) nextChange = Math.min(nextChange, instant + 1);
  return Object.freeze({ value, unit: selected.unit, nextChange: Math.max(now + 1, nextChange) });
}
