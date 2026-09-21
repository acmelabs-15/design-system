import { numericTokenValue, numericTokenKeys } from "./numeric-tokens";
import type { ResponsiveInput, ResponsiveScalar } from "./responsive";

export const isColumnCount = (value: unknown): value is number => typeof value === "number" && Number.isInteger(value) && value > 0;
export const isMinimumWidth = (value: unknown): value is string | number => typeof value === "string" || (typeof value === "number" && (numericTokenKeys as readonly number[]).includes(value));

/** Maps validated authored positions without filling skipped bands or changing their order. */
function map<Value extends ResponsiveScalar>(input: ResponsiveInput<Value>, convert: (value: Value) => string): ResponsiveInput<string> {
  if (input === undefined) return undefined;
  if (Array.isArray(input)) return Object.freeze(input.map((value) => (value === null || value === undefined ? value : convert(value))));
  if (typeof input === "object") return Object.freeze(Object.fromEntries(Object.entries(input).map(([condition, value]) => [condition, convert(value as Value)])));
  return convert(input as Value);
}
export function minimumTrack(value: string | number): string {
  const width = typeof value === "number" ? numericTokenValue("sizes", value) : value;
  return `repeat(auto-fit, minmax(${width}, 1fr))`;
}
/** The component chooses one mode before native responsive conditions select a value. */
export function simpleGridTracks(columns: ResponsiveInput<number>, minimum: ResponsiveInput<string | number>): ResponsiveInput<string> {
  return minimum !== undefined ? map(minimum, minimumTrack) : map(columns, (count) => `repeat(${count}, minmax(0, 1fr))`);
}
