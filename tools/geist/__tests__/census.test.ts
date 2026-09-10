// The census rewrites hover, focus and active pseudo-classes into attribute selectors, because a
// script cannot set a pseudo-class. That rewrite is the harness's one piece of real selector logic,
// and a mistake in it reports a difference the element does not have — which is exactly the kind of
// false report the whole parity effort exists to avoid. These pin its two rules.
import { describe, expect, test } from "bun:test";

// census.js is a browser file that assigns to `window`; give it one, then take the export.
(globalThis as unknown as { window: unknown }).window ??= globalThis;
const { attr } = (await import("../census.js")) as unknown as { attr: (s: string) => string };

describe("state rewrite", () => {
  test("a pseudo-class on a compound carries the state down to the parts inside", () => {
    // `.btn:hover .label` has to keep working when the attribute sits on the button: the label is a
    // descendant, so the descendant clause is what reaches it.
    expect(attr(".btn:hover .label")).toBe(".btn:is(:hover,[data-hover],[data-hover] *) .label");
  });

  test("a bare pseudo-class keeps the element clause only", () => {
    // A global ring written as `:focus-visible { box-shadow: ... }` matches every descendant of the
    // focused element once the descendant clause is added, so every icon and span inside it takes a
    // focus ring that the element never draws.
    expect(attr(":focus-visible")).toBe(":is(:focus-visible,[data-focus])");
    expect(attr(":hover")).toBe(":is(:hover,[data-hover])");
  });

  test("a bare pseudo-class is recognised after every combinator", () => {
    for (const [sel, want] of [
      ["a :focus", "a :is(:focus,[data-focus])"],
      ["a > :focus", "a > :is(:focus,[data-focus])"],
      ["a + :focus", "a + :is(:focus,[data-focus])"],
      ["a ~ :focus", "a ~ :is(:focus,[data-focus])"],
      ["a, :focus", "a, :is(:focus,[data-focus])"],
      [":is(:focus)", ":is(:is(:focus,[data-focus]))"],
    ]) {
      expect(attr(sel)).toBe(want);
    }
  });

  test("focus-visible maps to the focus attribute, and focus does too", () => {
    expect(attr(".x:focus-visible")).toContain("[data-focus]");
    expect(attr(".x:focus")).toContain("[data-focus]");
    expect(attr(".x:active")).toContain("[data-active]");
  });

  test("an escaped colon in a utility class name is left alone", () => {
    // `.has-\[\:focus\]\:underline` is one class name, not a pseudo-class. Rewriting inside it breaks
    // the selector, and a broken selector makes the whole rule silently stop applying.
    const sel = ".has-\\[\\:focus\\]\\:underline";
    expect(attr(sel)).toBe(sel);
  });

  test("a pseudo-class that only starts the same way is left alone", () => {
    expect(attr(":focus-within")).toBe(":focus-within");
  });
});
