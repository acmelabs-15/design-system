// Maps acme-collapse-group (src/components/collapse-group) to Geist CollapseGroup: the block
// that gives a stack of collapses their shared top border. The collapses inside are slotted
// acme-collapse elements, styled by their own map.
import { type GeistMap, has } from "../gen";

export const geist: GeistMap = {
  page: "collapse",
  component: "CollapseGroup",
  root: (n) => n.tag === "div" && has("border-t")(n) && n.children.some((c) => c.tag === "div" && c.children.some((k) => k.tag === "h3")),
  ours: ".collapse-group",
  skip: ["Small"],
  children: [{ ours: "", pick: (c) => c.tag === "div", all: true, leaf: true }],
};
