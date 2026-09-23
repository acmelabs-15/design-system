import * as date from "@internationalized/date";
/** One upstream date implementation; build embeds this corrected runtime in every distribution. */
export const {
  CalendarDate,
  CalendarDateTime,
  DateFormatter,
  parseAbsolute,
  parseDate,
  parseDateTime,
  parseTime,
  parseZonedDateTime,
  toCalendarDate,
  toCalendarDateTime,
  toZoned,
  startOfMonth,
  startOfWeek,
  getDayOfWeek,
  today,
  getLocalTimeZone,
} = date;
export type CalendarDate = date.CalendarDate;
export type CalendarDateTime = date.CalendarDateTime;
export type DateValue = date.DateValue;
export type ZonedDateTime = date.ZonedDateTime;
