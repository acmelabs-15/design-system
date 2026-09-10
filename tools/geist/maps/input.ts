// Maps acme-input (src/components/input) to Geist Input: the generator derives input.styles.ts from this.
// The wrapper root encodes its variants in class groups the JSX does not name (a prefix cell, a suffix
// cell, their plain styling, the clearable pad), so those props are read off the rendered root.
// The page's Search and ⌘K examples are SearchInput roots (an Input with a plain prefix and the clearable pad).
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
    prefix: { true: ".with-prefix" },
    suffix: { true: ".with-suffix" },
    prefixStyling: { false: ".plain-prefix" },
    suffixStyling: { false: ".plain-suffix" },
    clearable: { true: ".clearable" },
  },
  // The root's states are attributes the census sets; focus within the field is the focus state. The suffix cell keeps its own class.
  states: { ":hover": "[data-hover]", ":has(:focus)": "[data-focus]", "[data-geist-input-suffix]": ".suffix" },
  children: [
    // The field itself keeps its native states (:focus, :disabled).
    { ours: "input", pick: (c: SpecNode) => c.tag === "input", states: {} },
    { ours: ".prefix", pick: (c: SpecNode) => "data-geist-input-prefix" in c.attrs, leaf: true },
    { ours: ".suffix", pick: (c: SpecNode) => "data-geist-input-suffix" in c.attrs, leaf: true },
    // A suffix without its cell is slotted straight into the wrapper and carries no class.
    { ours: "", pick: (c: SpecNode) => c.tag === "svg", leaf: true },
  ],
  ignore: ["geist-themed", "geist-error"],
  // An icon is slotted into a cell; a prefix or suffix without its cell is slotted straight into the wrapper,
  // where the wrapper's positional rules reach it through the slot in that position.
  slotted: { svg: "svg", ":nth-child(2)": "*", ":last-child": "*" },
};
