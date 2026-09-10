// Maps acme-text-copy (src/components/text-copy) to Geist TextWithCopyButton: a full-width
// text button whose body holds the label and a swap of two icon layers (copy, check); the
// reference keys hover off the pseudo-class, ours off the interaction attribute.
import { type GeistMap, has } from "../gen";

export const geist: GeistMap = {
  page: "text-with-copy-button",
  component: "TextWithCopyButton",
  root: (n) => n.tag === "button" && has("w-full")(n) && has("justify-start")(n),
  ours: ".text-copy",
  defaults: { ellipsis: "false" },
  props: { ellipsis: { true: ".ellipsis" } },
  states: { ":hover": "[data-hover]" },
  children: [
    {
      ours: ".body",
      pick: 0,
      children: [
        { ours: ".text", pick: (c) => c.tag === "p" },
        { ours: ".swap", pick: has("size-4"), children: [{ ours: ".layer", pick: 0 }] },
      ],
    },
  ],
};
