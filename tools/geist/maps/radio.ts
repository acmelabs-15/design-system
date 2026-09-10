// Maps acme-radio (src/components/radio) to Geist RadioGroupItem: the generator derives radio.styles.ts from this.
// The headless example builds its items with a hook, not the component (no instance in its code), so it is skipped;
// the standalone Radio is the item's control alone and adds no rule of its own.
import { type GeistMap, has, type SpecNode } from "../gen";

export const geist: GeistMap = {
  page: "radio",
  component: "RadioGroupItem",
  root: "data-geist-radio-item",
  ours: ".radio",
  defaults: { disabled: "false" },
  // The group's disabled reaches every item through context.
  inherit: { disabled: "RadioGroup" },
  props: { disabled: { true: "[data-disabled]" } },
  // Every state is an attribute on the root: the census sets the first three, the element reflects the
  // rest off its radio. The focus-visible polyfill marker is a duplicate of :focus-visible and is dropped.
  states: {
    ":hover": "[data-hover]",
    ":focus-visible": "[data-focus]",
    ":active": "[data-active]",
    ":checked": "[data-checked]",
    ":disabled": "[data-disabled]",
    ":is(data-focus-visible-added)": null,
  },
  children: [
    {
      ours: ".control",
      pick: (c: SpecNode) => c.tag === "span" && has("p-0.5")(c),
      children: [
        { ours: "input", pick: (c: SpecNode) => c.tag === "input" },
        { ours: ".dot", pick: (c: SpecNode) => c.tag === "span" && "aria-hidden" in c.attrs },
      ],
    },
    { ours: ".text", pick: (c: SpecNode, i: number) => c.tag === "span" && i === 1 },
  ],
  skip: ["Radio headless"],
  ignore: ["group", "peer"],
};
