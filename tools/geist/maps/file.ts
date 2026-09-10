// Maps acme-file (src/components/file) to Geist File: a 28px-line list item (a centered flex row)
// holding one indent guide per level and the full-width link with the file-kind icon (14px) and
// the mono name; `active` sets the name semibold and the icon gray-1000. The tree's indent-guide
// rules reach the guides here, through `outer`; a link slotted into the label takes the name's
// link rules through the slot. The files of a closed folder are never mounted: the Default
// example renders its first two File instances only.
import { type GeistMap, has } from "../gen";

export const geist: GeistMap = {
  page: "file-tree",
  component: "File",
  root: (n) => n.tag === "li" && has("items-center")(n),
  ours: ".file",
  outer: (n) => n.tag === "div" && has("gap-[1px]")(n),
  instances: { Default: [0, 1] },
  defaults: { active: "false" },
  props: { active: { true: ".active" } },
  // The link's hover is the Interaction controller's attribute.
  states: { ":hover": "[data-hover]" },
  children: [
    { ours: ".indent", pick: (c) => "data-tree-indent" in c.attrs, all: true },
    {
      ours: ".link",
      pick: (c) => c.tag === "a",
      children: [
        { ours: ".icon", pick: has("mr-2") },
        { ours: ".name", pick: has("font-mono") },
      ],
    },
  ],
  classes: { "[data-tree-indent]": "indent" },
  slotted: ["a"],
};
