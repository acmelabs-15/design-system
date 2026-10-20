import { expect, test } from "bun:test";
import { feedbackTopics, feedbackValue } from "../feedback-data";

test("feedback snapshots own only serializable application fields", () => {
  const value = { message: "Hello", rating: "satisfied" };
  const snapshot = feedbackValue(value);
  value.message = "Changed";
  expect(snapshot.message).toBe("Hello");
  expect(Object.isFrozen(snapshot)).toBe(true);
  expect(() => feedbackValue({ message: "x", endpoint: "/collect" })).toThrow();
  expect(() =>
    feedbackValue({
      get message() {
        throw new Error("getter");
      },
    }),
  ).toThrow();
  expect(feedbackValue(null)).toEqual({ message: "" });
});
test("topics have immutable distinct values and readable labels", () => {
  const values = [{ value: "docs", label: "Documentation" }];
  const snapshot = feedbackTopics(values);
  values[0].label = "Changed";
  expect(snapshot[0].label).toBe("Documentation");
  expect(() =>
    feedbackTopics([
      { value: "x", label: "One" },
      { value: "x", label: "Two" },
    ]),
  ).toThrow();
  expect(() => feedbackTopics([{ value: "", label: "Missing" }])).toThrow();
});
