// Maps acme-skeleton (src/components/skeleton) to Geist Skeleton: the generator derives skeleton.styles.ts from this.
// The root's width, min-height and margin-bottom are inline styles the element writes from width, height and boxHeight.
// `state` is derived from the rendered root: on (a bare block), wrap (children under the sweep),
// off (show={false}: children visible, no sweep), auto (a fixed size with children: the block only).
import type { GeistMap, SpecNode } from "../gen";

export const geist: GeistMap = {
  page: "skeleton",
  component: "Skeleton",
  root: "data-geist-skeleton",
  ours: ".skeleton",
  defaults: { pill: "false", rounded: "false", squared: "false", animated: "true", button: "false", state: "on" },
  derive: {
    state: (node: SpecNode, props: Record<string, string>) => {
      const children = node.children.length > 0;
      const fixed = "width" in props || "height" in props || "boxHeight" in props;
      if (props.show === "false") return "off";
      if (fixed && children) return "auto";
      return children ? "wrap" : "on";
    },
  },
  props: {
    pill: { true: ".pill" },
    rounded: { true: ".rounded" },
    squared: { true: ".squared" },
    animated: { false: ".still" },
    button: { true: ".button" },
    state: { wrap: ".wrap", off: ".off", auto: ".auto" },
  },
};
