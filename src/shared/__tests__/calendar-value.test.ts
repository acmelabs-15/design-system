import { expect, test } from "bun:test";
import { calendarValue, calendarEndpoint, calendarEdit, calendarGrid } from "../calendar-value";
import { parseDate } from "../date";
test("calendar separates civil dates from timestamp instants", () => {
  expect(calendarValue("2026-09-22", "single", false, "Pacific/Honolulu")).toBe("2026-09-22");
  expect(() => calendarValue("2026-09-22", "single", true, "UTC")).toThrow();
  expect(calendarEndpoint("2026-09-22T00:30:00-03:30", true, "UTC").toString()).toContain("T04:00:00+00:00");
});
test("a range may be provisional but may not run backwards", () => {
  expect(calendarValue({ start: "2026-09-22" }, "range", false, "UTC")).toEqual({ start: "2026-09-22" });
  expect(() => calendarValue({ start: "2026-09-22", end: "2026-09-21" }, "range", false, "UTC")).toThrow();
});
test("time edits reject gaps and retain the selected overlap offset", () => {
  expect(() => calendarEdit("2026-03-08", "02:30", true, "America/Los_Angeles")).toThrow();
  expect(calendarEdit("2026-11-01", "01:30", true, "America/Los_Angeles")).toBe("2026-11-01T01:30:00-07:00");
  expect(calendarEdit("2026-11-01", "01:30", true, "America/Los_Angeles", "2026-11-01T01:45:00-08:00")).toBe("2026-11-01T01:30:00-08:00");
});
test("grid is locale aware and month arithmetic clamps", () => {
  expect(calendarGrid(parseDate("2026-02-01"), "en-GB")[0].toString()).toBe("2026-01-26");
  expect(parseDate("2026-01-31").add({ months: 1 }).toString()).toBe("2026-02-28");
});
