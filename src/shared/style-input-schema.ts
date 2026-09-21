import { numericTokenKeys } from "./numeric-tokens";

export type StyleNumericCategory =
  | "signed-spacing"
  | "nonnegative-spacing"
  | "size"
  | "positive-ratio"
  | "integer"
  | "positive-integer"
  | "native-number"
  | "opacity"
  | "nonnegative"
  | "zero-only"
  | "none";
type StyleTarget = "host" | "host-and-root" | "root";
type StyleMetadata<Property extends string, Numeric extends StyleNumericCategory, Target extends StyleTarget> = Readonly<{
  property: Property;
  attribute: string;
  cssProperty: string;
  numeric: Numeric;
  target: Target;
}>;

function properties<const Names extends readonly string[], const Numeric extends StyleNumericCategory, const Target extends StyleTarget>(names: Names, numeric: Numeric, target: Target) {
  return Object.freeze(
    Object.fromEntries(
      names.map((property) => {
        const cssProperty = property.replace(/[A-Z]/g, (character) => "-" + character.toLowerCase());
        return [property, Object.freeze({ property, attribute: cssProperty, cssProperty, numeric, target })];
      }),
    ),
  ) as { readonly [Property in Names[number]]: StyleMetadata<Property, Numeric, Target> };
}

/** The shared layout surface; visual defaults belong to generated CSS. */
export const commonStyleInputSchema = Object.freeze({
  ...properties(
    [
      "margin",
      "marginInline",
      "marginBlock",
      "marginInlineStart",
      "marginInlineEnd",
      "marginBlockStart",
      "marginBlockEnd",
      "inset",
      "insetInline",
      "insetBlock",
      "insetInlineStart",
      "insetInlineEnd",
      "insetBlockStart",
      "insetBlockEnd",
    ],
    "signed-spacing",
    "host",
  ),
  ...properties(["padding", "paddingInline", "paddingBlock", "paddingInlineStart", "paddingInlineEnd", "paddingBlockStart", "paddingBlockEnd"], "nonnegative-spacing", "host"),
  ...properties(["width", "minWidth", "maxWidth", "height", "minHeight", "maxHeight", "flexBasis"], "size", "host"),
  ...properties(["aspectRatio"], "positive-ratio", "host"),
  ...properties(["zIndex", "gridColumnStart", "gridColumnEnd", "gridRowStart", "gridRowEnd"], "integer", "host"),
  ...properties(["opacity"], "opacity", "host"),
  ...properties(["flexGrow", "flexShrink"], "nonnegative", "host"),
  ...properties(
    [
      "borderWidth",
      "borderInlineWidth",
      "borderBlockWidth",
      "borderInlineStartWidth",
      "borderInlineEndWidth",
      "borderBlockStartWidth",
      "borderBlockEndWidth",
      "borderRadius",
      "borderStartStartRadius",
      "borderStartEndRadius",
      "borderEndStartRadius",
      "borderEndEndRadius",
    ],
    "zero-only",
    "host",
  ),
  ...properties(
    [
      "position",
      "visibility",
      "overflow",
      "overflowX",
      "overflowY",
      "color",
      "backgroundColor",
      "boxShadow",
      "borderStyle",
      "borderInlineStyle",
      "borderBlockStyle",
      "borderInlineStartStyle",
      "borderInlineEndStyle",
      "borderBlockStartStyle",
      "borderBlockEndStyle",
      "borderColor",
      "borderInlineColor",
      "borderBlockColor",
      "borderInlineStartColor",
      "borderInlineEndColor",
      "borderBlockStartColor",
      "borderBlockEndColor",
      "alignSelf",
      "justifySelf",
      "gridArea",
      "gridColumn",
      "gridRow",
    ],
    "none",
    "host",
  ),
  ...properties(["display"], "none", "host-and-root"),
});

export const flexStyleInputSchema = Object.freeze({
  ...properties(["flexDirection", "flexWrap", "alignItems", "alignContent", "justifyContent"], "none", "host"),
  ...properties(["gap", "rowGap", "columnGap"], "nonnegative-spacing", "host"),
});
export const gridStyleInputSchema = Object.freeze({
  ...properties(
    ["gridTemplateColumns", "gridTemplateRows", "gridTemplateAreas", "gridAutoColumns", "gridAutoRows", "gridAutoFlow", "alignItems", "justifyItems", "alignContent", "justifyContent"],
    "none",
    "host",
  ),
  ...properties(["gap", "rowGap", "columnGap"], "nonnegative-spacing", "host"),
});
export const layoutStyleInputSchema = Object.freeze({ ...commonStyleInputSchema, ...flexStyleInputSchema, ...gridStyleInputSchema });
export type LayoutStyleInputKey = keyof typeof layoutStyleInputSchema;
export const styleInputSchema = Object.freeze({
  ...layoutStyleInputSchema,
  ...properties(["fontSize", "textAlign"], "none", "host"),
  ...properties(["fontWeight"], "native-number", "host"),
  lineClamp: Object.freeze({ property: "lineClamp", attribute: "line-clamp", cssProperty: "-webkit-line-clamp", numeric: "positive-integer", target: "root" } as const),
});

export type StyleInputKey = keyof typeof styleInputSchema;
export type StyleScalar<Property extends StyleInputKey> = (typeof styleInputSchema)[Property]["numeric"] extends "none" ? string : string | number;
export type StyleDisplayMode = "none" | "inline" | "inline-block" | "block" | "flex" | "inline-flex" | "grid" | "inline-grid";
export type StyleSupports = (property: string, value: string) => boolean;

export const spacingTokenKeys = Object.freeze([...numericTokenKeys] as const);
export const sizeTokenKeys = Object.freeze([...numericTokenKeys] as const);

/** Checks a scalar without committing state or resolving CSS variables/computed values. */
export function isStyleScalar<Property extends StyleInputKey>(property: Property, value: unknown, supports: StyleSupports, displayModes?: readonly StyleDisplayMode[]): value is StyleScalar<Property> {
  if (!Object.hasOwn(styleInputSchema, property)) return false;
  const metadata = styleInputSchema[property];
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return false;
    if (property === "display") {
      const mode = trimmed.toLowerCase();
      if (mode === "contents" || !displayModes?.some((allowed) => allowed === mode)) return false;
    }
    return supports(metadata.cssProperty, value);
  }
  if (typeof value !== "number" || !Number.isFinite(value)) return false;
  switch (metadata.numeric) {
    case "signed-spacing":
      return (spacingTokenKeys as readonly number[]).includes(Math.abs(value));
    case "nonnegative-spacing":
      return (spacingTokenKeys as readonly number[]).includes(value);
    case "size":
      return (sizeTokenKeys as readonly number[]).includes(value);
    case "positive-ratio":
      return value > 0;
    case "integer":
      return Number.isInteger(value) && supports(metadata.cssProperty, String(value));
    case "positive-integer":
      return Number.isInteger(value) && value > 0 && supports(metadata.cssProperty, String(value));
    case "native-number":
      return supports(metadata.cssProperty, String(value));
    case "opacity":
      return value >= 0 && value <= 1;
    case "nonnegative":
      return value >= 0;
    case "zero-only":
      return value === 0;
    case "none":
      return false;
  }
}

/** Authored CSS strings remain current inputs; rendering applies the browser's grammar. */
export function isAuthoredStyleScalar<Property extends StyleInputKey>(
  property: Property,
  value: unknown,
  supports: StyleSupports,
  displayModes?: readonly StyleDisplayMode[],
): value is StyleScalar<Property> {
  if (!Object.hasOwn(styleInputSchema, property)) return false;
  if (typeof value === "string" && property !== "display") return true;
  return isStyleScalar(property, value, supports, displayModes);
}
