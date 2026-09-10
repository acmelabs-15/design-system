// Maps acme-gauge (src/components/gauge) to Geist Gauge: the generator derives gauge.styles.ts from this.
import { type GeistMap, has } from "../gen";

export const geist: GeistMap = {
  page: "gauge",
  component: "Gauge",
  root: "data-geist-progress-circle",
  ours: ".gauge",
  defaults: { indeterminate: "false" },
  props: {
    indeterminate: { true: ".indeterminate" },
  },
  children: [
    {
      ours: ".ring",
      pick: (c) => c.tag === "svg" && !has("absolute")(c),
      children: [
        { ours: ".secondary", pick: (c) => c.tag === "circle" && !("data-geist-progress-circle-fg" in c.attrs) },
        { ours: ".primary", pick: (c) => "data-geist-progress-circle-fg" in c.attrs },
      ],
    },
    { ours: ".label", pick: (c) => c.tag === "div" && has("absolute")(c), children: [{ ours: ".value", pick: (c) => c.tag === "p" }] },
    { ours: ".icon", pick: (c) => c.tag === "svg" && has("absolute")(c) },
  ],
  // Arbitrary properties the reference sheet never emitted (a variable with !important): they have no effect there.
  ignore: ["[--stroke-percent:0_!important]", "[--stroke-percent:100_!important]"],
};
