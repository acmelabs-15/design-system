// Maps acme-file-tree (src/components/file-tree) to Geist Tree: the 13px flex column, 1px apart,
// that holds the rows (slotted acme-folder and acme-file elements, styled by their own maps); with
// `card` it takes the page background, the smallest shadow, radius 8, padding 24 and 16px text.
// The indent-guide rules it puts on every indent span below cross into the rows' shadow trees:
// the folder and file maps emit them, through `outer`.
import { type GeistMap, has } from "../gen";

export const geist: GeistMap = {
  page: "file-tree",
  component: "Tree",
  root: (n) => n.tag === "div" && has("gap-[1px]")(n),
  ours: ".tree",
  defaults: { card: "false" },
  props: { card: { true: ".card" } },
  crossing: ["[data-tree-indent]"],
  children: [{ ours: "", pick: (c) => c.tag === "li", all: true, leaf: true }],
};
