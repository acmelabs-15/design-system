// Maps acme-scroller (src/components/scroller) to Geist Scroller: the generator derives
// scroller.styles.ts from this. The root is the overlay container (a flex column, relative,
// clipped) with its horizontal marker class for `x` and `both`; inside it the overlay (absolute,
// scaled, the fade gradient on its ::before and ::after, an edge class per side the content lies
// past) and the scroll container (`data-overflow` picks the axes) around the children container.
// The edge classes and the mobile grid are client-only: sketches under tools/geist/sketch/
// scroller.*.json carry them, and the map reads each off the rendered DOM as a root prop, so a
// state lands on the root as one class of ours. The buttons render beside the root, so
// scroller-buttons.ts maps them; the sibling rule the horizontal root puts on them is emitted
// here. The children container's own class is the consumer's (`childrenContainerClassName`), a
// part in ours, and is left out.
import { type GeistMap, has, type SpecNode } from "../gen";

const overlay = (n: SpecNode) => n.children[0];
const content = (n: SpecNode) => n.children[1]?.children[0];
const edge = (e: string) => (n: SpecNode) => String(!!overlay(n) && has(`aGa9CG_${e}`)(overlay(n)));

export const geist: GeistMap = {
  page: "scroller",
  component: "Scroller",
  root: "data-geist-scroller",
  ours: ".scroller",
  defaults: { overflow: "both" },
  derive: {
    top: edge("top"),
    right: edge("right"),
    bottom: edge("bottom"),
    left: edge("left"),
    mobileGrid: (n) => String(!!content(n) && has("aGa9CG_mobileGrid")(content(n))),
  },
  props: {
    overflow: { x: ".x", y: ".y", both: ".both" },
    top: { true: ".top" },
    right: { true: ".right" },
    bottom: { true: ".bottom" },
    left: { true: ".left" },
    mobileGrid: { true: ".grid" },
  },
  // The horizontal marker qualifies the children container's direction: the root's own modifier in ours.
  context: { ".aGa9CG_overlayContainer.aGa9CG_isHorizontal": ":where(:not(.y))" },
  classes: { aGa9CG_buttons: "buttons" },
  ignore: ["gap-4"],
  children: [
    { ours: ".overlay", pick: has("aGa9CG_overlay") },
    { ours: ".container", pick: has("aGa9CG_scroller"), children: [{ ours: ".content", pick: 0, leaf: true }] },
  ],
};
