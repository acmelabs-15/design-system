// Maps acme-collapse (src/components/collapse) to Geist Collapse: a bordered block with an h3
// heading whose button trigger holds the title row and the turning chevron, over the region
// whose height animates (inline, 0 when closed) around the scrolling body. In a group the top
// border is the group's (`grouped`).
import { type GeistMap, has } from "../gen";

export const geist: GeistMap = {
  page: "collapse",
  component: "Collapse",
  root: (n) => n.tag === "div" && n.children.some((c) => c.tag === "h3"),
  ours: ".collapse",
  defaults: { size: "medium", defaultExpanded: "false", grouped: "false" },
  derive: { grouped: (n) => (has("border-t-0")(n) ? "true" : "false") },
  props: { size: { small: ".sm" }, defaultExpanded: { true: ".expanded" }, grouped: { true: ".grouped" } },
  // The trigger's focus rules (rounded corners, the ring) key off keyboard focus.
  states: { ":focus-visible": "[data-focus]", ":focus": "[data-focus]" },
  children: [
    {
      ours: ".heading",
      pick: (c) => c.tag === "h3",
      children: [
        {
          ours: ".trigger",
          pick: 0,
          children: [{ ours: ".row", pick: 0, children: [{ ours: ".chev", pick: 0 }] }],
        },
      ],
    },
    { ours: ".panel", pick: (c) => c.attrs.role === "region", children: [{ ours: ".body", pick: 0, leaf: true }] },
  ],
};
