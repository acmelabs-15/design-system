// Maps the touch backdrop of acme-tooltip (src/components/tooltip): a fixed viewport-filling layer
// under a bubble a touch opened (the touch bit of `shown`), so the next tap lands on it and closes
// the bubble. Sketched with the faster-fade bubbles ("Open lower delay"), where the second
// instance is the one a touch opened. A third mapping of the element.
import { type GeistMap, has } from "../gen";

export const geist: GeistMap = {
  page: "tooltip",
  element: "tooltip",
  component: "Tooltip",
  root: (n) => n.tag === "div" && has("inset-0")(n) && has("fixed")(n),
  ours: ".backdrop",
  skip: ["Default", "No delay", "Box align", "Custom content", "Custom type", "Components", "Other", "Open", "Open aligned", "Open no delay", "Open custom type", "Open custom type unfilled", "Open shortcut", "Open other"],
  instances: { "Open lower delay": 1 },
};
