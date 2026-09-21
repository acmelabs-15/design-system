import { describe, expect, expectTypeOf, test } from "bun:test";
import { isStyleScalar, sizeTokenKeys, spacingTokenKeys, styleInputSchema, type StyleInputKey } from "../style-input-schema";

const inventoryPairs = `
margin margin
marginInline margin-inline
marginBlock margin-block
marginInlineStart margin-inline-start
marginInlineEnd margin-inline-end
marginBlockStart margin-block-start
marginBlockEnd margin-block-end
padding padding
paddingInline padding-inline
paddingBlock padding-block
paddingInlineStart padding-inline-start
paddingInlineEnd padding-inline-end
paddingBlockStart padding-block-start
paddingBlockEnd padding-block-end
width width
minWidth min-width
maxWidth max-width
height height
minHeight min-height
maxHeight max-height
aspectRatio aspect-ratio
position position
inset inset
insetInline inset-inline
insetBlock inset-block
insetInlineStart inset-inline-start
insetInlineEnd inset-inline-end
insetBlockStart inset-block-start
insetBlockEnd inset-block-end
zIndex z-index
display display
visibility visibility
overflow overflow
overflowX overflow-x
overflowY overflow-y
opacity opacity
color color
backgroundColor background-color
boxShadow box-shadow
borderWidth border-width
borderInlineWidth border-inline-width
borderBlockWidth border-block-width
borderInlineStartWidth border-inline-start-width
borderInlineEndWidth border-inline-end-width
borderBlockStartWidth border-block-start-width
borderBlockEndWidth border-block-end-width
borderStyle border-style
borderInlineStyle border-inline-style
borderBlockStyle border-block-style
borderInlineStartStyle border-inline-start-style
borderInlineEndStyle border-inline-end-style
borderBlockStartStyle border-block-start-style
borderBlockEndStyle border-block-end-style
borderColor border-color
borderInlineColor border-inline-color
borderBlockColor border-block-color
borderInlineStartColor border-inline-start-color
borderInlineEndColor border-inline-end-color
borderBlockStartColor border-block-start-color
borderBlockEndColor border-block-end-color
borderRadius border-radius
borderStartStartRadius border-start-start-radius
borderStartEndRadius border-start-end-radius
borderEndStartRadius border-end-start-radius
borderEndEndRadius border-end-end-radius
flexBasis flex-basis
flexGrow flex-grow
flexShrink flex-shrink
alignSelf align-self
justifySelf justify-self
gridArea grid-area
gridColumn grid-column
gridColumnStart grid-column-start
gridColumnEnd grid-column-end
gridRow grid-row
gridRowStart grid-row-start
gridRowEnd grid-row-end
`
  .trim()
  .split("\n")
  .map((line) => line.split(" "));
const supportsAll = () => true;

describe("common style input schema", () => {
  test("contains exactly the approved 77 property and attribute names with their targets", () => {
    expect(inventoryPairs).toHaveLength(77);
    expect(Object.keys(styleInputSchema).sort()).toEqual(inventoryPairs.map(([property]) => property).sort());
    for (const [property, attribute] of inventoryPairs) {
      const metadata = styleInputSchema[property as StyleInputKey];
      expect(property).toBe(metadata.property);
      expect(metadata.attribute).toBe(attribute);
      expect(metadata.cssProperty).toBe(attribute);
      expect(metadata.target).toBe(property === "display" ? "host-and-root" : "host");
      expect(Object.isFrozen(metadata)).toBe(true);
      expect("defaultValue" in metadata).toBe(false);
    }
    expect(Object.isFrozen(styleInputSchema)).toBe(true);
  });

  test("keeps the complete spacing and size token keys independent and immutable", () => {
    const approved = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 72, 80, 96] as const;
    expect(spacingTokenKeys).toEqual(approved);
    expect(sizeTokenKeys).toEqual(approved);
    expect(sizeTokenKeys).not.toBe(spacingTokenKeys);
    expect(Object.isFrozen(spacingTokenKeys)).toBe(true);
    expect(Object.isFrozen(sizeTokenKeys)).toBe(true);
  });

  test("accepts only selected numeric spacing/size keys, with signs restricted to margins and insets", () => {
    expect<string[]>(
      Object.values(styleInputSchema)
        .filter((metadata) => metadata.numeric === "signed-spacing")
        .map((metadata) => metadata.property)
        .sort(),
    ).toEqual(
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
      ].sort(),
    );
    for (const [property, metadata] of Object.entries(styleInputSchema)) {
      if (!["signed-spacing", "nonnegative-spacing", "size"].includes(metadata.numeric)) continue;
      const key = property as StyleInputKey;
      for (const value of spacingTokenKeys) expect(isStyleScalar(key, value, supportsAll)).toBe(true);
      expect(isStyleScalar(key, -2, supportsAll)).toBe(metadata.numeric === "signed-spacing");
      for (const value of [0.25, 13, 97, NaN, Infinity, -Infinity]) expect(isStyleScalar(key, value, supportsAll)).toBe(false);
    }
  });

  test("uses the approved unitless and zero-only numeric boundaries", () => {
    const cases: { key: StyleInputKey; accepted: number[]; rejected: number[] }[] = [
      { key: "aspectRatio", accepted: [0.1, 1, 2], rejected: [0, -1, NaN, Infinity] },
      { key: "opacity", accepted: [0, 0.5, 1], rejected: [-0.1, 1.1, NaN, Infinity] },
      { key: "zIndex", accepted: [-2, 0, 7], rejected: [0.1, NaN, Infinity] },
      { key: "flexGrow", accepted: [0, 0.1, 3], rejected: [-0.1, NaN, Infinity] },
      { key: "flexShrink", accepted: [0, 0.1, 3], rejected: [-0.1, NaN, Infinity] },
      { key: "borderWidth", accepted: [0], rejected: [-1, 0.5, 2, NaN, Infinity] },
      { key: "borderRadius", accepted: [0], rejected: [-1, 0.5, 2, NaN, Infinity] },
      { key: "color", accepted: [], rejected: [0, 1] },
      { key: "gridColumn", accepted: [], rejected: [0, 1] },
    ];
    for (const { key, accepted, rejected } of cases) {
      for (const value of accepted) expect(isStyleScalar(key, value, supportsAll)).toBe(true);
      for (const value of rejected) expect(isStyleScalar(key, value, supportsAll)).toBe(false);
    }
    for (const [key, metadata] of Object.entries(styleInputSchema))
      if (metadata.numeric === "zero-only") {
        expect(isStyleScalar(key as StyleInputKey, 0, supportsAll)).toBe(true);
        expect(isStyleScalar(key as StyleInputKey, 1, supportsAll)).toBe(false);
      }
  });

  test("passes integer grid lines through the supplied native-property grammar check", () => {
    const calls: unknown[] = [];
    const supports = (property: string, value: string) => {
      calls.push([property, value]);
      return property === "z-index" || value !== "0";
    };
    for (const key of ["gridColumnStart", "gridColumnEnd", "gridRowStart", "gridRowEnd"] as const) {
      expect(isStyleScalar(key, -1, supports)).toBe(true);
      expect(isStyleScalar(key, 0, supports)).toBe(false);
      expect(isStyleScalar(key, 0.5, supports)).toBe(false);
    }
    expect(isStyleScalar("zIndex", 0, supports)).toBe(true);
    expect(calls).toEqual([
      ["grid-column-start", "-1"],
      ["grid-column-start", "0"],
      ["grid-column-end", "-1"],
      ["grid-column-end", "0"],
      ["grid-row-start", "-1"],
      ["grid-row-start", "0"],
      ["grid-row-end", "-1"],
      ["grid-row-end", "0"],
      ["z-index", "0"],
    ]);
  });

  test("delegates string and shorthand grammar using each exact CSS property", () => {
    const calls: unknown[] = [];
    const supports = (property: string, value: string) => {
      calls.push([property, value]);
      return value !== "invalid";
    };
    for (const [key, value] of [
      ["borderWidth", "1px 2px 3px 4px"],
      ["borderInlineWidth", "1px 2px"],
      ["borderInlineStartWidth", "2px"],
      ["borderBlockStyle", "solid dashed"],
      ["borderColor", "red blue"],
      ["marginInline", "auto"],
      ["padding", "var(--space)"],
      ["gridColumn", "[content-start]"],
    ] as const)
      expect(isStyleScalar(key, value, supports)).toBe(true);
    expect(isStyleScalar("padding", "invalid", supports)).toBe(false);
    expect(calls).toEqual([
      ["border-width", "1px 2px 3px 4px"],
      ["border-inline-width", "1px 2px"],
      ["border-inline-start-width", "2px"],
      ["border-block-style", "solid dashed"],
      ["border-color", "red blue"],
      ["margin-inline", "auto"],
      ["padding", "var(--space)"],
      ["grid-column", "[content-start]"],
      ["padding", "invalid"],
    ]);
  });

  test("requires an explicit layout display subset and always excludes contents", () => {
    expect(isStyleScalar("display", "flex", supportsAll)).toBe(false);
    expect(isStyleScalar("display", "flex", supportsAll, ["flex", "inline-flex", "none"])).toBe(true);
    expect(isStyleScalar("display", "grid", supportsAll, ["flex", "inline-flex", "none"])).toBe(false);
    expect(isStyleScalar("display", "none", supportsAll, ["flex", "none"])).toBe(true);
    expect(isStyleScalar("display", "contents", supportsAll, ["contents"] as unknown as readonly ["block"])).toBe(false);
    expect(isStyleScalar("display", "flex", () => false, ["flex"])).toBe(false);
  });

  test("rejects non-scalars without consulting browser grammar and narrows unknown values", () => {
    const supports = () => {
      throw new Error("Unexpected grammar check");
    };
    for (const value of [undefined, null, false, {}, [], "", "   "]) expect(isStyleScalar("padding", value, supports)).toBe(false);
    const candidate: unknown = "red";
    if (isStyleScalar("color", candidate, supportsAll)) expectTypeOf(candidate).toEqualTypeOf<string>();
  });
});
