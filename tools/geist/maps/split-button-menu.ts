// Maps the open menu of acme-split-button (src/components/split-button): the positioned wrapper
// (`data-phase` for the exit fade, the start offset that lines it up under the main button) and the
// list inside it. The items are acme-split-button-item, mapped on their own.
import { type GeistMap, has } from "../gen";

export const geist: GeistMap = {
  page: "split-button",
  component: "SplitButton",
  element: "split-button",
  root: (n) => n.tag === "div" && has("z-[10]")(n),
  ours: ".menu",
  skip: ["Default", "Menu Alignment", "Icon", "Title with Icon"],
  defaults: { menuAlignment: "bottom-start" },
  props: { menuAlignment: { "bottom-end": ".end" } },
  children: [{ ours: ".list", pick: 0, children: [{ ours: "", pick: (c) => c.tag === "li", all: true, leaf: true }] }],
};
