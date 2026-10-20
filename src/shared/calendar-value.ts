import { parseAbsolute, parseDate, parseTime, toCalendarDateTime, toZoned, startOfMonth, startOfWeek, type CalendarDate, type DateValue } from "./date";

export type CalendarMode = "single" | "range";
export type CalendarValue = string | Readonly<{ start: string; end?: string }> | undefined;
export type CalendarPreset = Readonly<{ label: string; value: Exclude<CalendarValue, undefined> }>;

/** Parses civil dates separately from exact instants. The dependency owns all date validation. */
export function calendarEndpoint(value: string, time: boolean, zone: string): DateValue {
  if (typeof value !== "string") {
    throw new TypeError("Calendar dates must be ISO strings");
  }
  if (time && (!value.includes("T") || !/(?:Z|[+-]\d{2}:\d{2})$/.test(value))) {
    throw new TypeError("Calendar timestamps require a time and UTC offset");
  }
  return time ? parseAbsolute(value, zone) : parseDate(value);
}
export function calendarValue(value: CalendarValue, mode: CalendarMode, time: boolean, zone: string): CalendarValue {
  if (value === undefined) {
    return undefined;
  }
  if (mode === "single") {
    if (typeof value !== "string") {
      throw new TypeError("Single Calendar value must be an ISO string");
    }
    calendarEndpoint(value, time, zone);
    return value;
  }
  if (!value || typeof value !== "object" || Array.isArray(value) || typeof value.start !== "string" || Object.keys(value).some((key) => key !== "start" && key !== "end")) {
    throw new TypeError("Range Calendar value needs start and optional end");
  }
  const start = calendarEndpoint(value.start, time, zone);
  if (value.end !== undefined && start.compare(calendarEndpoint(value.end, time, zone)) > 0) {
    throw new RangeError("Calendar range end precedes its start");
  }
  return Object.freeze(value.end === undefined ? { start: value.start } : { start: value.start, end: value.end });
}
export function calendarEdit(day: string, clock: string, time: boolean, zone: string, previous?: string): string {
  const date = parseDate(day);
  if (!time) {
    return date.toString();
  }
  const local = toCalendarDateTime(date, parseTime(clock));
  const earlier = toZoned(local, zone, "earlier"),
    later = toZoned(local, zone, "later");
  const matches = [earlier, later].filter((value) => toCalendarDateTime(value).compare(local) === 0);
  if (!matches.length) {
    throw new RangeError("This local time does not exist in the selected time zone");
  }
  const offset = previous === undefined ? undefined : parseAbsolute(previous, zone).offset;
  const result = matches.find((value) => value.offset === offset) ?? matches[0];
  return result.toString().replace(/\[[^\]]+\]$/, "");
}
export function calendarGrid(month: CalendarDate, locale: string): readonly CalendarDate[] {
  const first = startOfWeek(startOfMonth(month), locale);
  return Array.from({ length: 42 }, (_, index) => first.add({ days: index }));
}

/** Retains valid supplied data while independent configuration properties are applied. */
export function calendarSnapshot(value: CalendarValue, zone: string): CalendarValue {
  if (value === undefined) {
    return undefined;
  }
  if (typeof value === "string") {
    return calendarValue(value, "single", value.includes("T"), zone);
  }
  if (!value || typeof value !== "object" || Array.isArray(value) || typeof value.start !== "string") {
    throw new TypeError("Calendar value must be an ISO string or a range");
  }
  const timed = value.start.includes("T");
  if (value.end !== undefined && (typeof value.end !== "string" || value.end.includes("T") !== timed)) {
    throw new TypeError("Calendar range endpoints must use the same date format");
  }
  return calendarValue(value, "range", timed, zone);
}
