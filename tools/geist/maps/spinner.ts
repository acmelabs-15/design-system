// Maps acme-spinner (src/components/spinner) to Geist Spinner: the generator derives spinner.styles.ts from this.
// The blades' animation and rotation are inline styles the element writes; the keyframes ship through `keyframes`.
// "Colors" only adds a text colour utility through className (ours: the `color` attribute), so it is skipped.
import { type GeistMap, has, type SpecNode } from "../gen";

export const geist: GeistMap = {
  page: "spinner",
  component: "Spinner",
  root: (n: SpecNode) => n.attrs["data-testid"] === "geistcn/spinner",
  ours: ".spinner",
  defaults: { size: "md" },
  props: {
    size: { sm: ".sm", lg: ".lg", xl: ".xl", "2xl": ".x2", "3xl": ".x3", "4xl": ".x4" },
  },
  children: [
    { ours: ".blade", pick: has("will-change-transform") },
    { ours: ".sr", pick: has("sr-only") },
  ],
  skip: ["Colors"],
  keyframes: ["spinner-opacity"],
};
