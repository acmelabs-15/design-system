import { type GeistMap, has, type SpecNode } from "../gen";
/** Source geometry baseline for the authored five-tier spinner. */
export const geist: GeistMap = {
  referenceOnly: true,
  page: "spinner",
  component: "Spinner",
  root: (node: SpecNode) => node.attrs["data-testid"] === "geistcn/spinner",
  ours: ".spinner",
  defaults: { size: "md" },
  props: { size: { sm: ".sm", lg: ".lg", xl: ".xl", "2xl": ".x2", "3xl": ".x3", "4xl": ".x4" } },
  children: [
    { ours: ".blade", pick: has("will-change-transform") },
    { ours: ".sr", pick: has("sr-only") },
  ],
  skip: ["Colors"],
  keyframes: ["spinner-opacity"],
};
