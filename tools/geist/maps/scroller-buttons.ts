// Maps the buttons of acme-scroller (src/components/scroller): the flex row of two composed
// small circular secondary buttons (acme-button, styled by its own mapping) the scroller renders
// above a vertical viewport or below a horizontal one. The rule the horizontal root puts on the
// row beside it (`.overlayContainer.isHorizontal + .buttons`) is the root's sibling rule, emitted
// by scroller.ts, so the root compound is unreachable here.
import { type GeistMap, has } from "../gen";

export const geist: GeistMap = {
  page: "scroller",
  component: "Scroller",
  element: "scroller",
  root: has("aGa9CG_buttons"),
  ours: ".buttons",
  skip: ["Vertical", "Horizontal", "Free", "Vertical at rest", "Horizontal at rest", "Free at rest", "Vertical scrolled to the end", "Horizontal scrolled to the end", "Free scrolled", "Mobile grid"],
  // The row after a horizontal root starts at the left: the root compound stands for the row's own axis class.
  context: { ".aGa9CG_overlayContainer.aGa9CG_isHorizontal": ":where(.x)" },
  children: [{ ours: "acme-button", pick: (c) => c.tag === "button", all: true, extends: "button", part: "button", leaf: true }],
};
