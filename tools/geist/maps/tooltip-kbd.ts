// Maps a key inside the open bubble of acme-tooltip to the rules Geist Tooltip writes on its kbd
// child (`[&>kbd]:`: the gray-400 fill, the small radius, a 20px box, 12px text, no shadow).
// The key is a composed acme-kbd slotted into the bubble, so those rules cross into its shadow
// tree, which the tooltip's module cannot reach: they are emitted here, into the kbd's module,
// re-rooted on the kbd's host under the attribute the tooltip sets on a key it holds. The kbd's own
// classes are the kbd's. A second mapping of the kbd, from the tooltip page.
import type { GeistMap } from "../gen";

export const geist: GeistMap = {
  page: "tooltip",
  element: "kbd",
  component: "Kbd",
  root: (n) => n.tag === "kbd",
  ours: ":host([data-in-tooltip])",
  extends: "kbd",
  outer: (n) => n.attrs.role === "tooltip",
  skip: ["Components"],
};
