// Maps acme-switch-control (src/components/switch-control) to Geist SwitchControl: the generator derives switch-control.styles.ts from this.
import { type GeistMap, has, type SpecNode } from "../gen";

// Interaction and own states land on the root label as attributes: the census sets the first three,
// the element reflects the rest off its radio. The content div's hover is the root's hover (it fills the label).
const states = { ":hover": "^[data-hover]", ":focus-visible": "^[data-focus]", ":active": "^[data-active]", ":checked": "[data-checked]", ":disabled": "[data-disabled]" };

export const geist: GeistMap = {
  page: "switch",
  component: "SwitchControl",
  // The rendered root is the label that carries data-disabled (a tooltip trigger may wrap it).
  root: (n: SpecNode) => n.tag === "label" && "data-disabled" in n.attrs,
  ours: ".switch-control",
  defaults: { size: "medium", disabled: "false", icon: "false" },
  // An icon is a JSX element; a group clones its direct children with its own size (a wrapped control keeps its own).
  values: { icon: { "*": "true" } },
  inherit: { size: "Switch >" },
  props: {
    size: { small: ".sm", large: ".lg" },
    disabled: { true: "[data-disabled]" },
    icon: { true: ".icon" },
  },
  states,
  children: [
    { ours: "input", pick: has("peer") },
    { ours: ".label", pick: (c: SpecNode) => c.tag === "div", children: [{ ours: ".sr", pick: has("sr-only") }] },
  ],
  ignore: ["peer"],
  slotted: ["svg"],
};
