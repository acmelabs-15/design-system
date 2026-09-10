// Maps the label an acme-select renders above its field (src/components/select, select-label.styles.ts) to the
// Geist Select `label` prop: a label element whose text block sits above the wrapper. `bypassCasing` drops the
// block's capitalize (read off the rendered block). Only the Label and Required examples and the sketched
// "Label without casing" render one.
import { type GeistMap, has, type SpecNode } from "../gen";

export const geist: GeistMap = {
  page: "select",
  element: "select",
  component: "Select",
  root: (n: SpecNode) => n.tag === "label" && n.children.some(has("cursor-text")),
  ours: ".field",
  defaults: { casing: "true" },
  derive: { casing: (n) => (n.children.some(has("capitalize")) ? "true" : "false") },
  props: { casing: { false: ".raw" } },
  children: [
    { ours: ".text", pick: has("cursor-text") },
    { ours: "", pick: (c: SpecNode) => "data-geist-select" in c.attrs, leaf: true },
  ],
  skip: ["Sizes", "Prefix and suffix", "Disabled", "Error", "With options", "Secondary", "Secondary disabled", "Disabled with prefix", "Placeholder selected", "No suffix"],
};
