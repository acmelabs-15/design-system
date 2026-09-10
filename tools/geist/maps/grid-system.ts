// Maps acme-grid-system (src/components/grid-system) to Geist GridSystem: the wrapper (a container
// with `unstable_useContainer`, a centered column without) around the system box that draws the
// outer guide border, carries the guide width, colors and size limits as variables, and holds the
// slotted grids, the lazy-content box and the debug overlay. The rules the system's debug and
// dashed modifiers put on the grid's section, cells and guides are emitted by the grid's mapping
// (they live in the grid's shadow tree, keyed to attributes the grid keeps in step with its system).
import { type GeistMap, has, type SpecNode } from "../gen";

const wrapper = (n: SpecNode) => has("AMTIxG_unstable_gridSystemWrapper")(n) || has("AMTIxG_gridSystemContentWrapper")(n);

export const geist: GeistMap = {
  page: "grid",
  component: "GridSystem",
  root: wrapper,
  ours: ".wrap",
  defaults: { unstable_useContainer: "false", debug: "false", dashedGuides: "false" },
  props: {
    unstable_useContainer: { true: ".contained" },
    debug: { true: ".debug" },
    dashedGuides: { true: ".dashed" },
  },
  context: {
    ".AMTIxG_unstable_gridSystemWrapper": ":where(.contained)",
    ".AMTIxG_gridSystem": null,
    ".AMTIxG_systemDebug": null,
    ".AMTIxG_systemDashed": null,
  },
  children: [
    {
      ours: ".sys",
      pick: has("AMTIxG_gridSystem"),
      children: [
        // The grids are slotted acme-grid elements, styled by their own mapping.
        { ours: "", pick: (c) => "data-grid" in c.attrs, all: true, leaf: true },
        { ours: ".lazy", pick: has("AMTIxG_gridSystemLazyContent") },
        { ours: ".overlay", pick: has("AMTIxG_systemDebugOverlay") },
      ],
    },
  ],
  // The overlay's fade-out animations, one per breakpoint.
  classes: { AMTIxG_xsDisappear: "overlay-xs", AMTIxG_smDisappear: "overlay-sm", AMTIxG_mdDisappear: "overlay-md", AMTIxG_lgDisappear: "overlay-lg" },
};
