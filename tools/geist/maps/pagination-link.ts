// Maps the links of acme-pagination (src/components/pagination) to Geist Pagination's two anchors:
// a padded hover group holding the 13px direction label over a row of the 16px title and the
// absolutely placed chevron (left of the previous title, right of the next). A second mapping of
// the element; one Pagination renders two of these roots.
import { type GeistMap, has } from "../gen";

export const geist: GeistMap = {
  page: "pagination",
  component: "Pagination",
  element: "pagination",
  perInstance: 2,
  root: (n) => n.tag === "a" && has("group")(n),
  ours: ".link",
  defaults: { dir: "previous" },
  derive: { dir: (n) => (has("ml-auto")(n) ? "next" : "previous") },
  props: { dir: { next: ".next" } },
  // The row's focus ring is the link's keyboard focus: the reference puts it on a div that never focuses.
  states: { ":hover": "[data-hover]", ":focus-visible": "^[data-focus]" },
  children: [
    { ours: ".label", pick: has("text-copy-13") },
    {
      ours: ".row",
      pick: (c) => c.tag === "div",
      children: [
        { ours: ".title", pick: has("font-medium") },
        { ours: ".chev", pick: has("absolute") },
      ],
    },
  ],
  ignore: ["group"],
};
