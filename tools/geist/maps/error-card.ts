// Maps acme-error-card (src/components/error-card) to Geist ErrorCard: the generator derives
// error-card.styles.ts from this. The card is a red-200 column with a 1px red-400 border and 16px
// padding; the head column centres the 16px icon and the 16/24 title; with a `retry` callback the
// card appends a Button of type `unstyled` (no class of its own, only the base reset and the label
// span's 6px side padding) whose child is a medium 16/24 red-900 span reading Retry. The retry
// state is the sketch under tools/geist/sketch/error-card.retry.json.
import { type GeistMap, has } from "../gen";

export const geist: GeistMap = {
  page: "error-card",
  component: "ErrorCard",
  root: (n) => n.tag === "div" && has("list-none")(n),
  ours: ".card",
  children: [
    {
      ours: ".head",
      pick: has("gap-2"),
      children: [
        { ours: "svg", pick: (c) => c.tag === "svg" },
        { ours: ".title", pick: (c) => c.tag === "h3" },
      ],
    },
    {
      ours: ".retry",
      pick: (c) => c.tag === "button",
      children: [{ ours: ".retry-label", pick: has("truncate"), children: [{ ours: ".retry-text", pick: has("font-medium") }] }],
    },
  ],
  slotted: ["strong"],
};
