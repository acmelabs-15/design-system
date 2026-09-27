import { expect, test } from "bun:test";
import { simpleGridTracks } from "../simple-grid-sizing";

test("minimum mode is selected before responsive mapping and preserves skipped bands", () => {
  expect(simpleGridTracks(3, { expanded: "100px" })).toEqual({ expanded: "repeat(auto-fit, minmax(100px, 1fr))" });
  expect(simpleGridTracks(3, [undefined, 0])).toEqual([undefined, "repeat(auto-fit, minmax(var(--acme-size-0), 1fr))"]);
});
test("clearing the minimum restores counts while absent counts stay absent", () => {
  expect(simpleGridTracks(3, undefined)).toBe("repeat(3, minmax(0, 1fr))");
  expect(simpleGridTracks(undefined, undefined)).toBeUndefined();
});
