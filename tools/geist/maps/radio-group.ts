// Maps acme-radio-group (src/components/radio-group) to Geist RadioGroup: the generator derives radio-group.styles.ts from this.
// The root carries no class of its own; its visually hidden label does. The items are acme-radio elements, mapped by maps/radio.ts.
import { type GeistMap, has, type SpecNode } from "../gen";

export const geist: GeistMap = {
  page: "radio",
  component: "RadioGroup",
  root: "data-geist-radio-group",
  ours: ".radio-group",
  children: [
    { ours: ".sr", pick: has("sr-only") },
    // The example's own layout wrapper around the items.
    { ours: "", pick: (c: SpecNode) => c.tag === "div", all: true, leaf: true },
  ],
};
