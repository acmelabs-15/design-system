// Maps acme-folder (src/components/folder) to Geist Folder: a 28px-line list item (a flex column)
// whose full-width toggle button holds one indent guide per level, the folder icon (open or
// closed) and the mono name; open, the item renders the list of its rows (slotted acme-folder and
// acme-file elements, styled by their own maps). The tree's indent-guide rules reach the guides
// here, through `outer`; a link slotted into the label takes the item's link rules through the slot.
import { type GeistMap, has } from "../gen";

export const geist: GeistMap = {
  page: "file-tree",
  component: "Folder",
  root: (n) => n.tag === "li" && has("flex-col")(n),
  ours: ".folder",
  nested: true,
  outer: (n) => n.tag === "div" && has("gap-[1px]")(n),
  defaults: { open: "false" },
  derive: { open: (n) => (n.children.some((c) => c.tag === "ul") ? "true" : "false") },
  props: { open: { true: ".open" } },
  // The toggle's hover is the Interaction controller's attribute.
  states: { ":hover": "[data-hover]" },
  children: [
    {
      ours: ".toggle",
      pick: (c) => c.tag === "button",
      children: [
        { ours: ".indent", pick: (c) => "data-tree-indent" in c.attrs, all: true },
        { ours: ".icon", pick: has("mr-2") },
        { ours: ".name", pick: has("font-mono") },
      ],
    },
    { ours: ".group", pick: (c) => c.tag === "ul", children: [{ ours: "", pick: (c) => c.tag === "li", all: true, leaf: true }] },
  ],
  classes: { "[data-tree-indent]": "indent" },
  slotted: ["a"],
};
