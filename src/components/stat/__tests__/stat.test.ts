import { expect, test } from "bun:test";
import "../../../define/stat";
import "../../../define/stat-change";
test("Stat is a passive composed measurement and change does not infer direction from meaning", () => {
  const stat = document.createElement("acme-stat");
  expect(stat.size).toBe("medium");
  expect(stat.loading).toBe(false);
  const change = document.createElement("acme-stat-change");
  change.value = -0.2;
  change.sentiment = "positive";
  expect(change.direction).toBeUndefined();
  change.direction = "down";
  expect(change.sentiment).toBe("positive");
  expect(change.value).toBe(-0.2);
});
