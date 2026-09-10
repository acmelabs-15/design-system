// Maps acme-grid-cell (src/components/grid-cell) to Geist GridCell's block: the cell's own box
// rules (placement, padding, margins, the debug fill) ship with the grid, through its slot, since
// the cell is a slotted child of the grid's section. What is emitted here is the rule into the
// cell's own tree: a div child fills the cell's height.
import type { GeistMap } from "../gen";

export const geist: GeistMap = {
  page: "grid",
  component: "GridCell",
  root: "data-grid-cell",
  ours: ":host",
  extends: "grid/acme-grid-cell",
  slotted: ["div"],
};
