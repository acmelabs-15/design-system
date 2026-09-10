// Maps acme-loading-dots (src/components/loading-dots) to Geist LoadingDots: the generator derives loading-dots.styles.ts from this.
// The three dots differ only by animation delay; the text wrapper exists when the element has content.
import { type GeistMap, has, type SpecNode } from "../gen";

export const geist: GeistMap = {
  page: "loading-dots",
  component: "LoadingDots",
  root: (n: SpecNode) => n.attrs["data-testid"] === "geistcn/loading-dots",
  ours: ".dots",
  defaults: { size: "md" },
  props: {
    size: { sm: ".sm", lg: ".lg" },
  },
  children: [
    { ours: ".text", pick: has("mr-2") },
    { ours: ".dot", pick: (c: SpecNode) => has("animate-blink")(c) && !has("animation-delay-200")(c) && !has("animation-delay-400")(c) },
    { ours: ".dot:nth-of-type(2)", pick: has("animation-delay-200") },
    { ours: ".dot:nth-of-type(3)", pick: has("animation-delay-400") },
  ],
};
