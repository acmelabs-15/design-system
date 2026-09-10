// Maps acme-label (src/components/label) to Geist Label: the generator derives label.styles.ts from this.
// The label element carries no classes; the text block inside does. withInput changes no class.
import { type GeistMap, has, type SpecNode } from "../gen";

export const geist: GeistMap = {
  page: "label",
  component: "Label",
  root: (n: SpecNode) => n.tag === "label",
  ours: ".label",
  defaults: { bypassCasing: "false", withInput: "false" },
  props: {
    bypassCasing: { true: ".plain" },
    withInput: { true: ".with-input" },
  },
  children: [{ ours: ".text", pick: has("block") }],
};
