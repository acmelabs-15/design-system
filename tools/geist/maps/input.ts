// Maps acme-input (src/components/input) to Geist Input: the generator derives input.styles.ts from this.
//
// The reference gives a field two places on each side, and which one holds the content decides how it
// reads. An **add-on** is attached to the outside of the field: its own ground, and a hairline where
// the two meet. A **start** or **end** is inside the field's own box: the field's ground, no line.
// Measured across the reference's 20 cells, the two signals never disagree, so the place is binary.
//
// The map has two sides, and only one of them is ours to name:
//
//   `defaults`, the `derive` keys and every `pick` read the REFERENCE. `prefix`, `prefixStyling` and
//   `suffixContainer` are the prop names in its own JSX, and `data-geist-input-prefix` is its own
//   attribute; the generator parses both, so they are fixed.
//
//   `props` values, `children[].ours` and the `states` values are OUR class names. `.start` and
//   `.end` are the cells; the wrapper's `start-inside` / `end-inside` say a cell sits in the field's
//   own box rather than attached to it.
//
// The page's Search and ⌘K examples are SearchInput roots (an Input with an end place and the clearable pad).
import { type GeistMap, has, type SpecNode } from "../gen";

const flag = (cls: string, yes = "true", no = "false") => (n: SpecNode) => (has(cls)(n) ? yes : no);

export const geist: GeistMap = {
  page: "input",
  component: ["Input", "SearchInput"],
  root: "data-geist-input-wrapper",
  ours: ".wrap",
  defaults: { size: "medium", error: "false", rounded: "false", prefix: "false", suffix: "false", prefixStyling: "true", suffixStyling: "true", clearable: "false" },
  values: { error: { "*": "true" } },
  derive: {
    prefix: flag("[&>:nth-child(2)]:order-0"),
    suffix: flag("[&>:last-child]:order-2"),
    prefixStyling: flag("[&>:nth-child(2)]:border-r-0", "false", "true"),
    suffixStyling: flag("[&>:last-child]:border-l-0", "false", "true"),
    clearable: flag("[&>:last-child]:pr-0"),
  },
  props: {
    size: { small: ".sm", large: ".lg" },
    error: { true: ".error" },
    rounded: { true: ".rounded" },
    // A side is occupied whichever place holds it; the styling flag says which place that is.
    prefix: { true: ".has-start" },
    suffix: { true: ".has-end" },
    prefixStyling: { false: ".start-inside" },
    suffixStyling: { false: ".end-inside" },
    clearable: { true: ".clearable" },
  },
  // The root's states are attributes the census sets; focus within the field is the focus state. The end add-on keeps its own class.
  states: { ":hover": "[data-hover]", ":has(:focus)": "[data-focus]", "[data-geist-input-suffix]": ".end" },
  children: [
    // The field itself keeps its native states (:focus, :disabled).
    { ours: "input", pick: (c: SpecNode) => c.tag === "input", states: {} },
    // Both places on a side are the same cell, and the reference marks both with the same attribute:
    // only the ground and the hairline differ, and those come from the wrapper's own rules keyed on
    // `start-inside` / `end-inside`. So one class per side carries the cell, and the element adds
    // `addon` or `inside` beside it to say which place it is.
    { ours: ".start", pick: (c: SpecNode) => "data-geist-input-prefix" in c.attrs, leaf: true },
    { ours: ".end", pick: (c: SpecNode) => "data-geist-input-suffix" in c.attrs, leaf: true },
    // A bare icon the reference slots straight into the wrapper, with no cell of its own.
    { ours: "", pick: (c: SpecNode) => c.tag === "svg", leaf: true },
  ],
  ignore: ["geist-themed", "geist-error"],
  // An icon is slotted into an add-on cell; content inside the field is slotted straight into the
  // wrapper, where the wrapper's positional rules reach it through the slot in that position.
  slotted: { svg: "svg", ":nth-child(2)": "*", ":last-child": "*" },
};
