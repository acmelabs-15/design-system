// Maps acme-brands (src/components/brands) to the Geist brands page's logo preview: the generator
// derives brands.styles.ts from this. The page has no showcases: its 25 logo cells are sketched
// from the server HTML (sketch/brands.*.json), each the cell's ground around the preview. The root
// is the preview container: a grid box that forces the light theme's tokens (a logo reads the same
// on either page theme) and holds the copy button, placed over the frame's top right corner and
// shown on hover or focus, and the centred frame around the logo. `mode` is read off the logo:
// `text-white` on an inline logo or the forced-dark wrapper around an image pair is the dark mode,
// `text-black` the light one, neither the plain one (the mark in the page's text color). `full`
// drops the frame's 80% cap on an inline logo; `white` is the white ground the page gives the
// spacing illustrations. An image logo is a light and a dark file, one hidden per mode; an inline
// logo is slotted (a custom illustration) or the slot's fallback (a brand the element draws).
import { type GeistMap, has, type SpecNode } from "../gen";

const deep = (n: SpecNode, pred: (c: SpecNode) => boolean): boolean => n.children.some((c) => pred(c) || deep(c, pred));
const frame = (c: SpecNode) => c.tag === "div" && has("justify-center")(c);
const img = { light: has("geist-hide-on-dark"), dark: has("geist-hide-on-light") };

export const geist: GeistMap = {
  page: "brands",
  component: "Preview",
  root: has("brand-force-light"),
  ours: ".brands",
  defaults: { mode: "", full: "false", white: "false" },
  derive: {
    mode: (node) => (deep(node, (c) => has("text-white")(c) || has("brand-force-dark")(c)) ? "dark" : deep(node, has("text-black")) ? "light" : ""),
    full: (node) => String(!node.children.some((c) => frame(c) && has("[&_svg]:max-w-[80%]")(c))),
    white: (node) => String(has("bg-white")(node)),
  },
  props: {
    mode: { light: ".light", dark: ".dark" },
    full: { true: ".full" },
    white: { true: ".white" },
  },
  states: { ":hover": "[data-hover]", ":focus": "[data-focus]" },
  children: [
    // The copy button is an acme-button in ours; the classes the preview adds to it (its place over the frame, its opacity) land on its part.
    { ours: "acme-button.copy", pick: (c) => "data-geist-button" in c.attrs, extends: "button", part: "button", leaf: true },
    {
      ours: ".frame",
      pick: frame,
      children: [
        {
          ours: ".force",
          pick: has("brand-force-dark"),
          children: [
            { ours: "img.light", pick: img.light },
            { ours: "img.dark", pick: img.dark },
          ],
        },
        { ours: "img.light", pick: img.light },
        { ours: "img.dark", pick: img.dark },
        { ours: "svg", pick: (c) => c.tag === "svg", slotted: true, leaf: true },
      ],
    },
  ],
  slotted: ["svg"],
};
