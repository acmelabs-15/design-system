// Maps acme-empty-state (src/components/empty-state) to Geist EmptyState: the generator derives
// empty-state.styles.ts from this. The root is a full-width bordered column (48px by 70px padding,
// 24px gap) that centres an optional icon wrapper, the text column (title and description, each
// centred and capped at 340px) and the children as they come (a button, a link). `border={false}`
// keeps the border box and makes it transparent; `secondary` swaps the background for
// background-200 and the title's type for heading-14. The icon is the EmptyStateIcon tile
// (maps/icon-tile.ts), the button and the link are their own components: all three slotted in ours.
import { type GeistMap, has, type SpecNode } from "../gen";

const tile = (c: SpecNode) => c.attrs["aria-hidden"] === "true";

export const geist: GeistMap = {
  page: "empty-state",
  component: "EmptyState",
  root: has("px-[70px]"),
  ours: ".empty-state",
  defaults: { border: "true", secondary: "false" },
  props: {
    border: { false: ".no-border" },
    secondary: { true: ".secondary" },
  },
  children: [
    { ours: ".icon", pick: (c) => c.children.some(tile), children: [{ ours: "", pick: tile, leaf: true }] },
    {
      ours: ".text",
      pick: has("flex-col"),
      children: [
        { ours: ".title", pick: has("font-medium") },
        { ours: ".description", pick: has("text-copy-14") },
      ],
    },
    { ours: "", pick: (c) => "data-geist-button" in c.attrs, leaf: true },
    { ours: "", pick: (c) => c.tag === "a", leaf: true },
  ],
  slotted: ["a"],
};
