// Maps acme-split-button-item (src/components/split-button-item) to Geist SplitButtonMenuItem: a
// menu row (fit-content height, 8px padding) holding a column of the title row and the description.
import { type GeistMap, has } from "../gen";

export const geist: GeistMap = {
  page: "split-button",
  component: "SplitButtonMenuItem",
  root: (n) => n.tag === "li" && "data-geist-menu-item" in n.attrs,
  ours: ".item",
  skip: ["Default", "Menu Alignment", "Icon", "Title with Icon"],
  children: [
    {
      ours: ".body",
      pick: 0,
      children: [
        { ours: ".row", pick: 0, children: [{ ours: ".title", pick: (c) => c.tag === "span" && has("font-medium")(c) }] },
        { ours: ".desc", pick: 1 },
      ],
    },
  ],
};
