import { numericTokenValue, numericTokenKeys } from "./numeric-tokens";
import type { ResponsiveInput } from "./responsive";
import { mapResponsiveInput } from "./responsive-input";

export const isColumnCount = (value: unknown): value is number => typeof value === "number" && Number.isInteger(value) && value > 0;
export const isMinimumWidth = (value: unknown): value is string | number => typeof value === "string" || (typeof value === "number" && (numericTokenKeys as readonly number[]).includes(value));

export function minimumTrack(value: string | number): string {
  const width = typeof value === "number" ? numericTokenValue("sizes", value) : value;
  return `repeat(auto-fit, minmax(${width}, 1fr))`;
}
/** The component chooses one mode before native responsive conditions select a value. */
export function simpleGridTracks(columns: ResponsiveInput<number>, minimum: ResponsiveInput<string | number>): ResponsiveInput<string> {
  return minimum !== undefined ? mapResponsiveInput(minimum, minimumTrack) : mapResponsiveInput(columns, (count) => `repeat(${count}, minmax(0, 1fr))`);
}
