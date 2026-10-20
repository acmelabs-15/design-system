import { numericTokenValue } from "./numeric-tokens";
import { compareResponsiveRanges, normalizeResponsive, type ResponsiveBreakpoints, type ResponsiveRange } from "./responsive";
import { isAuthoredStyleScalar, isStyleScalar, type StyleDisplayMode, type StyleInputKey, type StyleSupports, styleInputSchema } from "./style-input-schema";

export type ResponsiveStyleDeclaration = Readonly<{
  property: string;
  value: string;
  target: "host" | "host-and-root" | "root";
}>;
export type ResponsiveStyleBlock = Readonly<{
  range: ResponsiveRange;
  declarations: readonly ResponsiveStyleDeclaration[];
}>;
type PlanOptions = Readonly<{
  supports: StyleSupports;
  displayModes?: readonly StyleDisplayMode[];
  breakpoints?: Partial<ResponsiveBreakpoints>;
}>;

/** Groups canonical authored inputs by query, preserving property order within each query. */
export function createResponsiveStylePlan(inputs: readonly (readonly [StyleInputKey, unknown])[], options: PlanOptions): readonly ResponsiveStyleBlock[] {
  const blocks = new Map<string, { range: ResponsiveRange; declarations: ResponsiveStyleDeclaration[] }>();
  const supplied = new Set<StyleInputKey>();
  for (const [key, input] of inputs) {
    if (!Object.hasOwn(styleInputSchema, key)) {
      throw new TypeError("Unknown style input: " + key);
    }
    if (supplied.has(key)) {
      throw new TypeError("Duplicate style input: " + key);
    }
    supplied.add(key);
    const metadata = styleInputSchema[key];
    const entries = normalizeResponsive(input, (value): value is string | number => isAuthoredStyleScalar(key, value, options.supports, options.displayModes), options.breakpoints);
    for (const { min, max, value } of entries) {
      if (!isStyleScalar(key, value, options.supports, options.displayModes)) {
        continue;
      }
      const rangeKey = `${min}:${max ?? "unbounded"}`;
      let block = blocks.get(rangeKey);
      if (!block) {
        block = { range: Object.freeze(max === undefined ? { min } : { min, max }), declarations: [] };
        blocks.set(rangeKey, block);
      }
      let cssValue = String(value);
      if (typeof value === "number") {
        if (metadata.numeric === "signed-spacing" || metadata.numeric === "nonnegative-spacing") {
          cssValue = numericTokenValue("spacing", value);
        } else if (metadata.numeric === "size") {
          cssValue = numericTokenValue("sizes", value);
        }
      }
      block.declarations.push(Object.freeze({ property: metadata.cssProperty, value: cssValue, target: metadata.target }));
    }
  }
  return Object.freeze(
    [...blocks.values()].sort((a, b) => compareResponsiveRanges(a.range, b.range)).map(({ range, declarations }) => Object.freeze({ range, declarations: Object.freeze(declarations) })),
  );
}
