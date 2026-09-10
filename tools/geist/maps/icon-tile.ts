// Maps acme-icon-tile (src/components/icon-tile) to Geist EmptyStateIcon: the generator derives
// icon-tile.styles.ts from this. The root is the bordered 8px-radius tile around the empty state's
// icon: a flex box with 10px padding, gray-alpha-400 border, background-100 and gray-900 text; the
// icon is slotted in ours. Its `size` prop is an inline width and height, no class.
import { type GeistMap, has, type SpecNode } from "../gen";

export const geist: GeistMap = {
  page: "empty-state",
  element: "icon-tile",
  component: "EmptyStateIcon",
  root: (n: SpecNode) => n.attrs["aria-hidden"] === "true" && has("p-[10px]")(n),
  ours: ".tile",
  // The tile does not shrink as an item of its parent's layout: the host is that item in ours.
  host: { mirror: ["flex"] },
  slotted: ["svg"],
};
