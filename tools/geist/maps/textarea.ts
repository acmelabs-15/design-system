// Maps acme-textarea (src/components/textarea) to Geist Textarea: the generator derives textarea.styles.ts from this.
// The wrapper is the Input's wrapper around a textarea; the error under it is an acme-error.
import { type GeistMap, type SpecNode } from "../gen";

export const geist: GeistMap = {
  page: "textarea",
  component: "Textarea",
  root: "data-geist-textarea-wrapper",
  ours: ".wrap",
  defaults: { size: "medium", error: "false" },
  values: { error: { "*": "true" } },
  props: {
    size: { small: ".sm", large: ".lg" },
    error: { true: ".error" },
  },
  states: { ":hover": "[data-hover]", ":has(:focus)": "[data-focus]" },
  children: [{ ours: "textarea", pick: (c: SpecNode) => c.tag === "textarea", states: {} }],
  ignore: ["geist-themed", "geist-error"],
};
