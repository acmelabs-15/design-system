import { normalizeResponsive, type ResponsiveInput, type ResponsiveScalar } from "./responsive";

export type ResponsiveAttributeDiagnostic = Readonly<{ code: "invalid-responsive-attribute"; reason: "syntax" | "value" }>;
export type ResponsiveAttributeResult<Value extends ResponsiveScalar> = Readonly<{
  value: ResponsiveInput<Value>;
  diagnostic?: ResponsiveAttributeDiagnostic;
}>;

/** Validates a current input and owns its shape without replacing authored conditions with ranges. */
export function copyResponsiveInput<Value extends ResponsiveScalar>(input: unknown, scalar: (value: unknown) => value is Value): ResponsiveInput<Value> {
  normalizeResponsive(input, scalar);
  if (input === undefined || typeof input !== "object") {
    return input as Value | undefined;
  }
  if (Array.isArray(input)) {
    const copy = new Array<Value | null | undefined>(input.length);
    for (let index = 0; index < input.length; index++) {
      const descriptor = Object.getOwnPropertyDescriptor(input, index);
      if (descriptor) {
        copy[index] = descriptor.value;
      }
    }
    return Object.freeze(copy);
  }
  return Object.freeze(Object.fromEntries(Object.entries(input!))) as ResponsiveInput<Value>;
}

/** Maps a validated current input without filling skipped positions or changing conditions. */
export function mapResponsiveInput<Value extends ResponsiveScalar, Output extends ResponsiveScalar>(input: ResponsiveInput<Value>, convert: (value: Value) => Output): ResponsiveInput<Output> {
  if (input === undefined) {
    return undefined;
  }
  if (Array.isArray(input)) {
    return Object.freeze(input.map((value) => (value === null || value === undefined ? value : convert(value))));
  }
  if (typeof input === "object") {
    return Object.freeze(Object.fromEntries(Object.entries(input).map(([condition, value]) => [condition, convert(value as Value)])));
  }
  return convert(input as Value);
}

const numericText = /^[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?$/;
const invalid = (reason: ResponsiveAttributeDiagnostic["reason"]) => Object.freeze({ value: undefined, diagnostic: Object.freeze({ code: "invalid-responsive-attribute" as const, reason }) });

/** Recognizes valid scalars before JSON. An invalid HTML input has no current override. */
export function parseResponsiveAttribute<Value extends ResponsiveScalar>(
  text: string | null,
  scalar: (value: unknown) => value is Value,
  options: { numbers?: boolean } = {},
): ResponsiveAttributeResult<Value> {
  if (text === null || text.trim() === "") {
    return Object.freeze({ value: undefined });
  }
  const input = text.trim();
  if (options.numbers && numericText.test(input)) {
    const value = Number(input);
    if (Number.isFinite(value) && scalar(value)) {
      return Object.freeze({ value });
    }
    return invalid("value");
  }
  if (input === "true" || input === "false") {
    const value = input === "true";
    if (scalar(value)) {
      return Object.freeze({ value });
    }
  }
  if (scalar(input)) {
    return Object.freeze({ value: input });
  }
  if (!input.startsWith("[") && !input.startsWith("{")) {
    return invalid("value");
  }
  let decoded: unknown;
  try {
    decoded = JSON.parse(input);
  } catch {
    return invalid("syntax");
  }
  if (decoded === null || typeof decoded !== "object") {
    return invalid("value");
  }
  try {
    return Object.freeze({ value: copyResponsiveInput(decoded, scalar) });
  } catch {
    return invalid("value");
  }
}
