// Maps acme-badge (src/components/badge) to Geist Badge: the generator derives badge.styles.ts from this.
// The Pill example on the same page is a link with the pill variant (acme-pill), not a Badge.
import { type GeistMap, has, type SpecNode } from "../gen";

export const geist: GeistMap = {
  page: "badge",
  component: "Badge",
  // The rendered root carries no marker attribute: it is the capitalized pill-shaped div.
  root: (n: SpecNode) => n.tag === "div" && has("rounded-full")(n) && has("capitalize")(n),
  ours: ".badge",
  defaults: { size: "md", variant: "gray", contrast: "high" },
  props: {
    size: { sm: ".sm", lg: ".lg" },
    variant: { blue: ".blue", purple: ".purple", amber: ".amber", red: ".red", pink: ".pink", green: ".green", teal: ".teal", inverted: ".inverted", trial: ".trial", turbo: ".turbo" },
    contrast: { low: ".subtle" },
  },
  children: [{ ours: ".label", pick: has("min-w-0") }],
  slotted: { "[data-slot=icon]": "[slot=icon]" },
};
