// Maps acme-banner (src/components/banner) to Geist Banner's wide row: the generator derives
// banner.styles.ts from this. The component renders a fragment of two siblings: a mobile-only
// ButtonLink holding the whole message (mapped on its own, maps/banner-mobile.ts) and this row,
// hidden below the lg breakpoint, that centres an optional prefix, the 16px gray-900 message and
// a small secondary rounded ButtonLink (acme-button, its own classes skipped) with the arrow suffix.
// The example's own `className="p-4"` is the page's, not the component's: ignored here and set on
// the row's part by the docs example.
import { type GeistMap, has } from "../gen";

export const geist: GeistMap = {
  page: "banner",
  component: "Banner",
  root: (n) => n.tag === "div" && has("max-w-[1080px]")(n),
  ours: ".banner",
  ignore: ["p-4"],
  children: [
    { ours: ".text", pick: (c) => c.tag === "p" },
    { ours: "acme-button.action", pick: (c) => "data-geist-button" in c.attrs, extends: "button", part: "button", leaf: true },
  ],
  slotted: ["b", "strong"],
};
