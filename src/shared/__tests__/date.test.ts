import { describe, expect, test } from "bun:test";
import { parseAbsolute, parseDate, parseDateTime, parseZonedDateTime } from "../date";
import { relativeInstant } from "../relative-time";

describe("corrected date runtime", () => {
  test.each([
    ["-03:30", "2026-09-22T04:00:00.000Z"],
    ["-00:30", "2026-09-22T01:00:00.000Z"],
    ["+05:30", "2026-09-21T19:00:00.000Z"],
    ["+00:30", "2026-09-22T00:00:00.000Z"],
    ["-07:00", "2026-09-22T07:30:00.000Z"],
    ["Z", "2026-09-22T00:30:00.000Z"],
  ])("preserves the instant with offset %s", (offset, expected) => {
    const input = `2026-09-22T00:30:00${offset}`;
    expect(parseAbsolute(input, "UTC").toDate().toISOString()).toBe(expected);
    expect(relativeInstant(input)).toBe(Date.parse(expected));
  });
  test("rejects day zero in every date representation", () => {
    expect(() => parseDate("2026-09-00")).toThrow();
    expect(() => parseDateTime("2026-09-00T12:00")).toThrow();
    expect(() => parseAbsolute("2026-09-00T12:00Z", "UTC")).toThrow();
    expect(() => parseZonedDateTime("2026-09-00T12:00[America/Los_Angeles]")).toThrow();
  });
  test("keeps leap day and month validation", () => {
    expect(parseDate("2024-02-29").toString()).toBe("2024-02-29");
    expect(() => parseDateTime("2026-02-29T12:00")).toThrow();
    expect(() => parseAbsolute("2026-13-01T00:00Z", "UTC")).toThrow();
  });
});
