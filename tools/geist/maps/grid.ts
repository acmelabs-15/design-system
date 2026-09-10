// Maps acme-grid (src/components/grid) to Geist Grid: the section that lays out `columns` by
// `rows` tracks from the system's width, holds the slotted cells and crosses (their own box rules
// are emitted here, through the slot) and draws the guides behind them: one set, or one per
// breakpoint when the counts or the solid cells differ between breakpoints. The system's debug and
// dashed modifiers reach the section as `data-debug` and `data-dashed` attributes the element
// keeps in step with its system; its own container modifier switches the breakpoint rules from
// the viewport to the container.
import { type GeistMap, has, type SpecNode } from "../gen";

const BREAKPOINTS = ["xs", "sm", "smd", "md", "lg"];
const bpGuide = (bp: string) => has(`AMTIxG_${bp}Guide`);
const plainGuide = (c: SpecNode) => has("AMTIxG_guide")(c) && !BREAKPOINTS.some((bp) => bpGuide(bp)(c));

export const geist: GeistMap = {
  page: "grid",
  component: "Grid",
  root: "data-grid",
  ours: ".grid",
  defaults: { useContainer: "false", dashedGuides: "false" },
  props: {
    useContainer: { true: ".contained" },
    dashedGuides: { true: ".dashed" },
  },
  context: {
    ".AMTIxG_gridSystem": "",
    ".AMTIxG_systemDashed": ":where([data-dashed])",
    ".AMTIxG_systemDebug": ":where([data-debug])",
    ".AMTIxG_useContainer": ":where(.contained)",
  },
  children: [
    { ours: "acme-grid-cell", pick: (c) => "data-grid-cell" in c.attrs, all: true, leaf: true, slotted: true },
    { ours: "acme-grid-cross", pick: (c) => "data-grid-cross" in c.attrs, all: true, leaf: true, slotted: true },
    {
      ours: ".guides",
      pick: has("AMTIxG_guides"),
      all: true,
      children: [
        { ours: ".guide", pick: plainGuide, all: true },
        ...BREAKPOINTS.map((bp) => ({ ours: `.guide.${bp}`, pick: bpGuide(bp), all: true })),
      ],
    },
  ],
  slotted: ["acme-grid-cell", "acme-grid-cross"],
};
