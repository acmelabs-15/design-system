import { isPlainRecord } from "./plain-record";

export type FeedbackValue = Readonly<{ rating?: string; message: string; email?: string; topic?: string }>;
export type FeedbackTopic = Readonly<{ value: string; label: string }>;
export function feedbackValue(input: unknown): FeedbackValue {
  if (input === undefined || input === null) {
    return Object.freeze({ message: "" });
  }
  data(input, ["rating", "message", "email", "topic"]);
  if (typeof input.message !== "string") {
    throw new TypeError("Feedback message requires a string");
  }
  for (const key of ["rating", "email", "topic"] as const) {
    if (input[key] !== undefined && typeof input[key] !== "string") {
      throw new TypeError("Feedback fields require strings");
    }
  }
  return Object.freeze({ message: input.message, rating: input.rating as string | undefined, email: input.email as string | undefined, topic: input.topic as string | undefined });
}
function data(input: unknown, fields: readonly string[]): asserts input is Record<string, unknown> {
  if (!isPlainRecord(input)) {
    throw new TypeError("Feedback requires a plain record");
  }
  for (const key of Reflect.ownKeys(input)) {
    const descriptor = Object.getOwnPropertyDescriptor(input, key)!;
    if (typeof key !== "string" || !fields.includes(key) || !descriptor.enumerable || !("value" in descriptor)) {
      throw new TypeError("Feedback requires supported data fields");
    }
  }
}
export function feedbackTopics(input: unknown): readonly FeedbackTopic[] {
  if (input == null) {
    return Object.freeze([]);
  }
  if (!Array.isArray(input)) {
    throw new TypeError("Feedback topics require an array");
  }
  const seen = new Set<string>();
  return Object.freeze(
    input.map((item) => {
      data(item, ["value", "label"]);
      if (typeof item.value !== "string" || !item.value.trim() || typeof item.label !== "string" || !item.label.trim() || seen.has(item.value)) {
        throw new TypeError("Feedback topics require unique values and labels");
      }
      seen.add(item.value);
      return Object.freeze({ value: item.value, label: item.label });
    }),
  );
}
