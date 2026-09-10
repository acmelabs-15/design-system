// Maps the plain trigger of acme-relative-time (src/components/relative-time) to the label Geist
// RelativeTimeCard draws when it has no children: the short age (days, hours or minutes ago, or
// "Just now") as a 14px label in gray-900, the default content of the element's slot. Sketched in
// tools/geist/sketch/relative-time-card.plain.json. A second mapping of the element.
import { type GeistMap, has } from "../gen";

export const geist: GeistMap = {
  page: "relative-time-card",
  element: "relative-time",
  component: "RelativeTimeCard",
  root: (n) => n.tag === "span" && has("text-label-14")(n),
  ours: ".time",
  skip: ["Default", "Open"],
};
