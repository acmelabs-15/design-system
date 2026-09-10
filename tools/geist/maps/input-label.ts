// Maps the label an acme-input renders above its field (src/components/input, input-label.styles.ts) to the
// Geist Input `label` prop: a label element whose text block sits above the wrapper. Only the Label example renders one.
import { type GeistMap, has, type SpecNode } from "../gen";

export const geist: GeistMap = {
  page: "input",
  element: "input",
  component: "Input",
  root: (n: SpecNode) => n.tag === "label" && n.children.some(has("cursor-text")),
  ours: ".field",
  children: [
    { ours: ".text", pick: has("cursor-text") },
    { ours: "", pick: (c: SpecNode) => "data-geist-input-wrapper" in c.attrs, leaf: true },
  ],
  skip: ["Default", "Prefix and suffix", "Disabled", "Search", "⌘K", "Error", "Rounded prefix and suffix", "Rounded prefix and suffix without styling"],
};
