// Maps acme-project-banner (src/components/project-banner) to Geist ProjectBanner: the generator
// derives project-banner.styles.ts from this. The root is a full-width aside pulled up one pixel
// over the bar above it; inside, a column (a row from `md`) holds the message (icon wrapper and
// paragraph) and the call to action, a plain link or button underlined in the variant's hue.
import { type GeistMap, has, type SpecNode } from "../gen";

/** The variant, read off the root's background class: three examples pass it as a loop variable. */
const VARIANTS: [string, string][] = [
  ["bg-blue-100", "success"],
  ["bg-amber-100", "warning"],
  ["bg-red-100", "error"],
];

export const geist: GeistMap = {
  page: "project-banner",
  component: "ProjectBanner",
  // The rendered root carries no marker attribute: it is the aside translated up by one pixel.
  root: (n: SpecNode) => n.tag === "aside" && has("translate-y-[-1px]")(n),
  ours: ".project-banner",
  defaults: { variant: "gray" },
  derive: { variant: (n) => VARIANTS.find(([cls]) => has(cls)(n))?.[1] ?? "gray" },
  props: { variant: { success: ".success", warning: ".warning", error: ".error" } },
  // The action carries the interaction states (the Interaction controller); children inherit them.
  states: { ":hover": "[data-hover]", ":focus-visible": "[data-focus]" },
  children: [
    {
      ours: ".inner",
      pick: has("px-6"),
      children: [
        {
          ours: ".message",
          pick: has("items-center"),
          children: [
            // The icon is slotted light DOM inside the wrapper; the tooltip in the label is a composed element with styles of its own.
            { ours: ".icon", pick: (c) => c.attrs["aria-hidden"] === "true", children: [{ ours: "", pick: (c) => c.tag === "svg", leaf: true }] },
            { ours: ".label", pick: (c) => c.tag === "p", children: [{ ours: "", pick: (c) => c.tag === "span", leaf: true }] },
          ],
        },
        { ours: ".cta", pick: has("ml-6"), children: [{ ours: ".action", pick: 0 }] },
      ],
    },
  ],
  // A ring utility the reference names but its sheet never emits: the ring is the shadow utility plus the inline style the element writes.
  ignore: ["focus-visible:shadow-focus-ring"],
  slotted: ["svg"],
};
