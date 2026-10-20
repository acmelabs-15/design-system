export type PinInputType = "numeric" | "alphabetic" | "alphanumeric";
const patterns: Record<PinInputType, RegExp> = { numeric: /^[0-9]*$/, alphabetic: /^[A-Za-z]*$/, alphanumeric: /^[A-Za-z0-9]*$/ };
export function pinCharacters(value: string, kind: PinInputType): boolean {
  return patterns[kind].test(value);
}
export function pinValue(value: unknown, count: number): readonly string[] {
  if (!Array.isArray(value) || value.some((cell) => typeof cell !== "string" || cell.length > 1)) {
    throw new TypeError("Pin values must be an array of single characters");
  }
  return Object.freeze(count > 0 ? Array.from({ length: count }, (_, index) => value[index] ?? "") : [...value]);
}
export function pinInsertion(value: readonly string[]): number {
  return Math.min(value.filter(Boolean).length, Math.max(0, value.length - 1));
}
export function pinFocus(value: readonly string[], index: number): number {
  return Math.max(0, Math.min(index, pinInsertion(value)));
}
export function pinCharacter(current: string, next: string): string {
  if (next.length === 2 && next[0] === current) {
    return next[1]!;
  }
  if (next.length === 2 && next[1] === current) {
    return next[0]!;
  }
  return next.at(-1) ?? "";
}
export function pinDelete(value: readonly string[], index: number): readonly string[] {
  if (!value[index]) {
    return value;
  }
  const next = [...value];
  next.splice(index, 1);
  next.push("");
  return Object.freeze(next);
}
export function pinPaste(value: readonly string[], index: number, text: string): readonly string[] {
  const start = text.length >= value.length ? 0 : Math.min(index, value.filter(Boolean).length);
  return pinValue([...value.slice(0, start), ...text.slice(0, value.length - start)], value.length);
}
