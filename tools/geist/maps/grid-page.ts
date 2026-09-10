// Maps acme-grid-page (src/components/grid-page) to Geist GridPage: a background-200 column
// (a Stack) with a vertical padding per breakpoint that a banner replaces at the top on large
// screens. Its content (a banner, then the grid systems) is slotted; the systems are styled by
// their own mapping.
import { type GeistMap, has, type SpecNode } from "../gen";

const wrapper = (c: SpecNode) => has("AMTIxG_unstable_gridSystemWrapper")(c) || has("AMTIxG_gridSystemContentWrapper")(c);

export const geist: GeistMap = {
  page: "grid",
  component: "GridPage",
  root: has("AMTIxG_page"),
  ours: ".page",
  defaults: { banner: "false" },
  values: { banner: { "*": "true" } },
  props: { banner: { true: ".banner" } },
  children: [
    // The banner and the systems are slotted content.
    { ours: "", pick: (c) => wrapper(c) || !c.styles.length, all: true, leaf: true },
  ],
  // The soft reset reaches headings and lists deep inside the slotted content, beyond a shadow tree's reach; `stack` carries no rule.
  ignore: ["geist-soft-reset", "stack"],
};
