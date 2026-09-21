import { isPlainRecord } from "./plain-record";

export const responsiveBands = Object.freeze(["compact", "medium", "expanded", "large", "extraLarge"] as const);
export type ResponsiveBand = (typeof responsiveBands)[number];
type Between<Bands extends readonly string[]> = Bands extends readonly [infer Lower extends string, ...infer Upper extends string[]]
  ? `${Lower}To${Capitalize<Upper[number]>}` | Between<Upper>
  : never;
export type ResponsiveCondition = ResponsiveBand | `${ResponsiveBand}Only` | `${Exclude<ResponsiveBand, "compact">}Down` | Between<typeof responsiveBands>;
export type ResponsiveScalar = string | number | boolean;
export type ResponsiveInput<T extends ResponsiveScalar> = T | readonly (T | null | undefined)[] | Readonly<Partial<Record<ResponsiveCondition, T>>> | undefined;
export type ResponsiveBreakpoints = Readonly<Record<Exclude<ResponsiveBand, "compact">, number>>;

/** Bounds are rem values. Minimum is inclusive; maximum is exclusive; an absent maximum is unbounded. */
export type ResponsiveRange = Readonly<{ min: number; max?: number }>;
export type ResponsiveEntry<T extends ResponsiveScalar> = ResponsiveRange & Readonly<{ value: T }>;

export const defaultBreakpoints: ResponsiveBreakpoints = Object.freeze({ medium: 37.5, expanded: 52.5, large: 75, extraLarge: 100 });

function ownValues(value: object): [string, unknown][] {
  return Reflect.ownKeys(value).map((key) => {
    const descriptor = Object.getOwnPropertyDescriptor(value, key)!;
    if (typeof key !== "string" || !("value" in descriptor) || !descriptor.enumerable) throw new TypeError("Responsive inputs require enumerable data properties");
    return [key, descriptor.value];
  });
}

/** Fill omitted transitions from the defaults and validate a complete immutable rem table. */
export function resolveBreakpoints(overrides?: Partial<ResponsiveBreakpoints>): ResponsiveBreakpoints {
  const widths = { ...defaultBreakpoints };
  if (overrides !== undefined) {
    if (!isPlainRecord(overrides)) throw new TypeError("Breakpoints must be a plain object");
    for (const [key, value] of ownValues(overrides)) {
      if (!Object.hasOwn(defaultBreakpoints, key) || typeof value !== "number") throw new TypeError(`Invalid breakpoint: ${key}`);
      widths[key as keyof typeof widths] = value;
    }
  }
  const starts = [0, ...responsiveBands.slice(1).map((name) => widths[name as keyof typeof widths])];
  for (let index = 1; index < starts.length; index++) {
    if (!Number.isFinite(starts[index]) || starts[index] <= starts[index - 1]) throw new RangeError("Breakpoints must be finite, positive and strictly increasing");
  }
  return Object.freeze(widths);
}

function conditions(overrides?: Partial<ResponsiveBreakpoints>): Map<string, ResponsiveRange> {
  const widths = resolveBreakpoints(overrides);
  const starts = [0, ...responsiveBands.slice(1).map((name) => widths[name as keyof typeof widths])];
  const result = new Map<string, ResponsiveRange>();
  for (const [index, name] of responsiveBands.entries()) {
    result.set(name, { min: starts[index] });
    result.set(`${name}Only`, index + 1 < starts.length ? { min: starts[index], max: starts[index + 1] } : { min: starts[index] });
    if (index) result.set(`${name}Down`, { min: 0, max: starts[index] });
    for (let end = index + 1; end < starts.length; end++) {
      const upper = responsiveBands[end];
      result.set(`${name}To${upper[0].toUpperCase()}${upper.slice(1)}`, { min: starts[index], max: starts[end] });
    }
  }
  return result;
}

const defaultConditions = conditions();
const baseline = (interval: ResponsiveRange) => interval.min === 0 && interval.max === undefined;

/** A comparison key only: consumers emit native inclusive-minimum/exclusive-maximum ranges. */
function comparisonKey(interval: ResponsiveRange): string {
  return ["@media screen", ...(interval.min > 0 ? [`(min-width: ${interval.min}rem)`] : []), ...(interval.max !== undefined ? [`(max-width: ${interval.max}rem)`] : [])].join(" and ");
}

// Query categories, numeric ordering and localeCompare ties follow Chakra's pinned comparator:
// chakra-ui/chakra-ui@1ff9873754e9913fc3d849d23c0844a628f5f20d,
// packages/react/src/styled-system/sort-at-params.ts:69-93. Bounds stay numeric here; no query regex or fractional subtraction.
export function compareResponsiveRanges(a: ResponsiveRange, b: ResponsiveRange): number {
  if (baseline(a) || baseline(b)) return baseline(a) ? (baseline(b) ? 0 : -1) : 1;
  const minimumA = a.min > 0;
  const minimumB = b.min > 0;
  if (minimumA !== minimumB) return minimumA ? -1 : 1;
  const distance = minimumA ? a.min - b.min : b.max! - a.max!;
  return distance || comparisonKey(a).localeCompare(comparisonKey(b));
}

/** Validate one current input without retaining prior values or resolving a viewport/container. */
export function normalizeResponsive<T extends ResponsiveScalar>(
  input: unknown,
  leafValidator: (value: unknown) => value is T,
  breakpoints?: Partial<ResponsiveBreakpoints>,
): readonly ResponsiveEntry<T>[] {
  const known = breakpoints === undefined ? defaultConditions : conditions(breakpoints);
  const normalized = new Map<string, ResponsiveEntry<T>>();
  const append = (condition: string, value: unknown) => {
    const interval = known.get(condition);
    if (!interval) throw new TypeError(`Unknown responsive condition: ${condition}`);
    if (!["string", "number", "boolean"].includes(typeof value) || !leafValidator(value)) throw new TypeError(`Invalid responsive value for ${condition}`);
    const key = `${interval.min}:${interval.max ?? "unbounded"}`;
    const existing = normalized.get(key);
    if (existing) {
      if (existing.value !== value) throw new TypeError(`Conflicting responsive values for equivalent interval: ${condition}`);
      return;
    }
    normalized.set(key, Object.freeze({ ...interval, value }));
  };

  if (input === undefined) return Object.freeze([]);
  if (Array.isArray(input)) {
    if (input.length > responsiveBands.length) throw new RangeError("Responsive arrays have at most five positions");
    for (const key of Reflect.ownKeys(input)) {
      if (key === "length") continue;
      if (typeof key !== "string" || !/^[0-4]$/.test(key)) throw new TypeError("Responsive arrays contain only band positions");
      const descriptor = Object.getOwnPropertyDescriptor(input, key)!;
      if (!("value" in descriptor)) throw new TypeError("Responsive arrays require data properties");
      if (descriptor.value !== null && descriptor.value !== undefined) append(responsiveBands[Number(key)], descriptor.value);
    }
  } else if (isPlainRecord(input)) {
    for (const [condition, value] of ownValues(input)) append(condition, value);
  } else {
    append("compact", input);
  }
  return Object.freeze([...normalized.values()].sort(compareResponsiveRanges));
}
