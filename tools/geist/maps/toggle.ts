// Maps acme-toggle (src/components/toggle) to Geist Toggle: the generator derives toggle.styles.ts from this.
// Two spec examples are synthesized from the class tables in the reference chunk: checked medium/large,
// disabled-checked, colored-checked and disabled icons; label casing and no-margin. The page never renders them.
import { type GeistMap, has, type SpecNode } from "../gen";

export const geist: GeistMap = {
  page: "toggle",
  component: "Toggle",
  root: (n: SpecNode) => n.tag === "label" && has("touch-manipulation")(n),
  ours: ".toggle",
  defaults: { size: "small", checked: "false", disabled: "false", color: "false", direction: "label-first", labelCasing: "title", noMargin: "false", icon: "false" },
  // `checked={x}` reads a state variable: the first is false, the second true, on the page; a color or an icon is any value.
  values: { checked: { checked: "false", checked2: "true" }, color: { "*": "true" }, icon: { "*": "true" } },
  props: {
    size: { medium: ".md", large: ".lg" },
    checked: { true: "[data-checked]" },
    disabled: { true: "[data-disabled]" },
    color: { true: ".colored" },
    direction: { "switch-first": ".switch-first" },
    labelCasing: { normal: ".normal" },
    noMargin: { true: ".no-margin" },
  },
  states: { ":focus-visible": "[data-focus]", ":hover": "[data-hover]", ":active": "[data-active]", ":checked": "[data-checked]", ":disabled": "[data-disabled]" },
  children: [
    { ours: ".text", pick: (c: SpecNode) => c.tag === "span" && !has("peer-focus-visible:ring")(c) },
    { ours: "input", pick: has("peer") },
    {
      ours: ".track",
      pick: has("peer-focus-visible:ring"),
      children: [{ ours: ".thumb", pick: (c: SpecNode) => c.tag === "div", children: [{ ours: ".icon", pick: (c: SpecNode) => c.tag === "div", children: [{ ours: "svg", pick: (c: SpecNode) => c.tag === "svg", leaf: true }] }] }],
    },
  ],
  ignore: ["peer"],
  slotted: ["svg"],
};
