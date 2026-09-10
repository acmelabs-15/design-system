// Maps acme-copy-button (src/components/copy-button) to Geist CopyButton. The button itself is
// acme-button (secondary, square, svg-only), so the mapping's root is the icon stack the copy
// button owns: two absolutely positioned layers (check, copy) that swap on `copied`.
import { type GeistMap, has } from "../gen";

export const geist: GeistMap = {
  page: "copy-button",
  component: "CopyButton",
  root: (n) => n.tag === "div" && has("size-4")(n) && has("relative")(n),
  ours: ".stack",
  defaults: { copied: "false" },
  props: { copied: { true: ".copied" } },
  children: [
    { ours: ".check", pick: 0 },
    { ours: ".copy", pick: 1 },
  ],
};
