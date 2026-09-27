import { expect, test } from "bun:test";
import "../../../define/empty-state";

test("Empty State owns only size and surface treatment, with authored content", () => {
  const state = document.createElement("acme-empty-state");
  expect(state.size).toBe("medium");
  expect(state.variant).toBe("default");
  expect(state.role).toBeNull();
  expect(() => {
    state.variant = "quiet" as never;
  }).toThrow();
  state.innerHTML = '<h2 slot="heading">No records</h2>';
  const heading = state.firstElementChild;
  state.variant = "outline";
  state.size = "large";
  expect(state.firstElementChild).toBe(heading);
});
