// Maps acme-checkbox (src/components/checkbox) to Geist Checkbox: the generator derives checkbox.styles.ts from this.
import { type GeistMap, type SpecNode } from "../gen";

const tag = (t: string) => (c: SpecNode) => c.tag === t;

export const geist: GeistMap = {
  page: "checkbox",
  component: "Checkbox",
  // The rendered root is the label tied to the hidden checkbox.
  root: (n: SpecNode) => n.tag === "label" && "for" in n.attrs,
  ours: ".checkbox",
  defaults: { disabled: "false", indeterminate: "false" },
  props: {
    disabled: { true: "[data-disabled]" },
    indeterminate: { true: "[data-indeterminate]" },
  },
  // Every state is an attribute on the root: the census sets the first two, the element reflects the
  // rest off its checkbox. The box's `.indeterminate` marker class is the same root attribute.
  states: { ":hover": "[data-hover]", ":focus-visible": "[data-focus]", ":checked": "[data-checked]", ":disabled": "[data-disabled]", ".indeterminate": "^[data-indeterminate]" },
  children: [
    {
      ours: ".control",
      pick: tag("span"),
      children: [
        { ours: "input", pick: tag("input") },
        {
          ours: ".box",
          pick: (c: SpecNode) => c.tag === "span" && "aria-hidden" in c.attrs,
          children: [{ ours: "svg", pick: tag("svg"), children: [{ ours: "path", pick: tag("path") }, { ours: "line", pick: tag("line") }] }],
        },
      ],
    },
    { ours: ".text", pick: (c: SpecNode, i: number) => c.tag === "span" && i === 1 },
  ],
  // `group`/`peer` are marker classes; `!important` is a stray token in the reference class string.
  ignore: ["group", "peer", "!important"],
};
