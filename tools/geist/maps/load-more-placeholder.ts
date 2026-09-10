// Maps the placeholder of acme-load-more (src/components/load-more) to Geist LoadMoreButton's
// `placeholder` root: an empty block of the button's height that keeps the layout, with the
// same top gap as the button. A second mapping of the element, for its alternate root.
import { type GeistMap, has } from "../gen";

export const geist: GeistMap = {
  page: "load-more-button",
  component: "LoadMoreButton",
  element: "load-more",
  root: (n) => n.tag === "div" && has("h-8")(n),
  ours: ".placeholder",
  skip: ["Default", "Loading", "No Gap", "No Border Radius", "Custom Text"],
  defaults: { noGap: "false" },
  props: { noGap: { true: ".no-gap" } },
};
