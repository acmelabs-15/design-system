// Maps acme-switch (src/components/switch) to Geist Switch, the segmented group: the generator derives switch.styles.ts from this.
// The controls inside are Geist SwitchControl, mapped by maps/switch-control.ts.
import { type GeistMap, has, type SpecNode } from "../gen";

export const geist: GeistMap = {
  page: "switch",
  component: "Switch",
  // The rendered root carries no marker attribute: it is the padded, rounded, flex group.
  root: (n: SpecNode) => n.tag === "div" && has("p-1")(n) && has("bg-background-100")(n),
  ours: ".switch",
  defaults: { size: "medium", hideBorder: "false" },
  props: { size: { small: ".sm", large: ".lg" }, hideBorder: { true: ".no-border" } },
  // The controls (a tooltip trigger may wrap one) are slotted acme-switch-control elements, styled by their own map;
  // the group's child rule (`[&>*]:h-full`) reaches them through the slot.
  children: [{ ours: "", pick: (c: SpecNode) => c.tag === "label" || c.tag === "span", all: true, leaf: true }],
  slotted: ["*"],
};
