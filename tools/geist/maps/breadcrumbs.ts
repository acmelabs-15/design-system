// Maps acme-breadcrumbs (src/components/breadcrumbs) to Geist Breadcrumb's container: the list
// of the text type (an ol inside the labelled nav: a 6px-gap flex row without markers or padding),
// or the 8px-gap flex row of the menu type, which scrolls sideways below the sm breakpoint. The
// crumbs inside are slotted acme-breadcrumb elements, styled by their own map (maps/breadcrumb.ts).
import { type GeistMap, has } from "../gen";

export const geist: GeistMap = {
  page: "breadcrumbs",
  component: "Breadcrumb",
  root: (n) => (n.tag === "ol" && has("list-none")(n)) || (n.tag === "div" && has("gap-2")(n) && has("max-sm:overflow-x-auto")(n)),
  ours: ".list",
  defaults: { type: "text" },
  props: { type: { menu: ".menu" } },
  children: [{ ours: "", pick: (c) => c.tag === "li" || c.tag === "span", all: true, leaf: true }],
};
