// Maps the headed form of acme-entity-list (the column that stacks the header over the list,
// 12px apart) to the reference EntityList with a `header`: the second mapping of the element,
// for the wrapper root the header adds. The header and the list inside are slotted content and
// the list's own root.
import { type GeistMap, has } from "../gen";

export const geist: GeistMap = {
  page: "entity",
  element: "entity-list",
  component: "EntityList",
  root: (n) => n.tag === "div" && has("gap-3")(n) && n.children.some((c) => c.tag === "ul"),
  ours: ".wrap",
  skip: ["Entity with List", "Entity with List and Checkbox", "Entity with Fill", "Entity with Column ClassNames"],
  children: [{ ours: "", pick: () => true, all: true, leaf: true }],
};
