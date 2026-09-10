// Maps acme-middle-truncate (src/components/middle-truncate) to Geist MiddleTruncate: the generator
// derives middle-truncate.styles.ts from this. The example maps eleven values over one instance;
// the narrow sketch is the truncated state (a visually hidden full value beside the cut text).
import { type GeistMap, has } from "../gen";

export const geist: GeistMap = {
  page: "middle-truncate",
  component: "MiddleTruncate",
  root: (n) => n.tag === "span" && has("inline-grid")(n),
  perInstance: 11,
  ours: ".truncate",
  // The example's own text classes on the root (its `className`), not the component's.
  ignore: ["text-label-14", "text-copy-14", "font-mono"],
  children: [
    { ours: ".full", pick: has("sr-only") },
    { ours: ".sizer", pick: (c) => has("invisible")(c) && has("col-start-1")(c) },
    { ours: ".text", pick: (c) => !has("invisible")(c) && has("col-start-1")(c) },
    { ours: ".measure", pick: has("absolute") },
  ],
};
