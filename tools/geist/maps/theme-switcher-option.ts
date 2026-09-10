// Maps one option of acme-theme-switcher (src/components/theme-switcher) to Geist ThemeSwitcher's
// option: the span holding a hidden radio (the peer) and its round label. One instance renders three.
// The radio's states reach the label through the peer chain, so they land on the option span as
// attributes the element keeps in step with its radio (data-checked, data-disabled, data-focus); the
// label's own hover is the option's hover (the label fills it). A disabled group renders the label
// with its own class list, so `disabled` is a prop, not a state.
import { type GeistMap, has, type SpecNode } from "../gen";

const states = { ":hover": "^[data-hover]", ":focus-visible": "[data-focus]", ":active": "^[data-active]", ":checked": "[data-checked]", ":disabled": "[data-disabled]" };

export const geist: GeistMap = {
  page: "theme-switcher",
  component: "ThemeSwitcher",
  element: "theme-switcher",
  perInstance: 3,
  root: (n: SpecNode) => n.tag === "span" && has("h-full")(n) && n.children.some((c) => c.tag === "input"),
  ours: ".option",
  defaults: { disabled: "false" },
  props: { disabled: { true: "[data-disabled]" } },
  states,
  children: [
    { ours: "input", pick: has("peer") },
    {
      ours: ".control",
      pick: (c: SpecNode) => c.tag === "label",
      children: [
        { ours: ".sr", pick: has("sr-only") },
        { ours: ".icon", pick: has("size-4") },
      ],
    },
  ],
  ignore: ["peer", "group"],
};
