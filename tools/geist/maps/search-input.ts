// Maps acme-search (src/components/search) to Geist SearchInput: the generator derives search-input.styles.ts from
// this. The root is an acme-input (its wrapper classes are the input's own) and the suffix is the clearable input's;
// this element adds the prefix content: the magnifying glass, a slotted custom prefix, or the loading spinner,
// each sized as a control decoration. The prefix cell's content is the slot this element forwards into the
// input (`slot[name=prefix]`): the glass and the spinner are its fallback, a custom prefix its slotted node.
import { type GeistMap, type SpecNode } from "../gen";

export const geist: GeistMap = {
  page: "search-input",
  element: "search",
  component: "SearchInput",
  root: "data-geist-input-wrapper",
  extends: "input",
  ours: ".input",
  children: [
    { ours: "", pick: (c: SpecNode) => c.tag === "input", leaf: true },
    {
      ours: "slot[name=prefix]",
      pick: (c: SpecNode) => "data-geist-input-prefix" in c.attrs,
      children: [{ ours: "acme-spinner", pick: (c: SpecNode) => c.attrs["data-testid"] === "geistcn/spinner", extends: "spinner", part: "spinner", leaf: true }],
    },
    { ours: "", pick: (c: SpecNode) => "data-geist-input-suffix" in c.attrs, leaf: true },
  ],
  slotted: ["svg"],
};
