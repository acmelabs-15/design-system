// Maps acme-description (src/components/description) to Geist Description: the generator derives description.styles.ts from this.
import { type GeistMap, has } from "../gen";

export const geist: GeistMap = {
  page: "description",
  component: "Description",
  root: (n) => n.tag === "dl",
  ours: ".description",
  defaults: { right: "false", ellipsis: "false" },
  props: {
    right: { true: ".right" },
    ellipsis: { true: ".ellipsis" },
  },
  children: [
    {
      ours: ".title",
      pick: (c) => c.tag === "dt",
      // The tooltip trigger inside the info wrapper is the tooltip element's host in ours.
      children: [{ ours: ".info", pick: has("inline-block"), children: [{ ours: ".trigger", pick: has("inline-flex"), leaf: true }] }],
    },
    { ours: ".content", pick: (c) => c.tag === "dd" },
  ],
  // A legacy size class the reference sheet no longer defines.
  ignore: ["s-[14px]"],
};
