// Maps acme-grid-cross (src/components/grid-cross) to Geist GridCross: the cross's own box rules
// (its place on a guide intersection, its size per breakpoint) ship with the grid, through its
// slot, since the cross is a slotted child of the grid's section. What is emitted here is its
// inside: the two absolutely placed lines, a vertical and a horizontal one, sized by inline styles.
import { type GeistMap, has } from "../gen";

export const geist: GeistMap = {
  page: "grid",
  component: "GridCross",
  root: "data-grid-cross",
  ours: ":host",
  extends: "grid/acme-grid-cross",
  children: [{ ours: ".line", pick: has("AMTIxG_crossLine"), all: true }],
};
