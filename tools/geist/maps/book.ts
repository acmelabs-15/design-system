// Maps acme-book (src/components/book) to Geist Book: the generator derives book.styles.ts from this.
// The root is the perspective box: the hover group, the holder of the width variables and of the
// media queries that pick a responsive width. The reference keeps the variant, color and texture
// classes on the rotating wrapper below it; ours keeps them on the root, so the wrapper's compounds
// are context that becomes the root's state. `color` is read off the wrapper: the stripe variant
// always has one (amber by default), the simple variant only when the prop is given. The icon
// (stripe) and the illustration's content are slotted; the two logo images the reference renders
// for an icon are one slotted element in ours.
import { type GeistMap, has } from "../gen";

export const geist: GeistMap = {
  page: "book",
  component: "Book",
  root: has("BH179W_perspective"),
  ours: ".book",
  defaults: { variant: "stripe", color: "false", textured: "false" },
  derive: {
    color: (node) => String(node.children.some(has("BH179W_color"))),
  },
  props: {
    variant: { stripe: ".stripe", simple: ".simple" },
    color: { true: ".color" },
    textured: { true: ".textured" },
  },
  states: { ":hover": "[data-hover]" },
  // The paper texture is served from the package (assets/), not from the reference's storage.
  assets: { "https://k2mkucxia43oc7fa.public.blob.vercel-storage.com/front/design/book-texture.avif": "https://cdn.jsdelivr.net/npm/@acmelabs/design-system/assets/book-texture.avif" },
  context: {
    ".BH179W_rotateWrapper.BH179W_stripe": ":where(.stripe)",
    ".BH179W_rotateWrapper.BH179W_simple": ":where(.simple)",
    ".BH179W_rotateWrapper.BH179W_simple.BH179W_color": ":where(.simple.color)",
    ".BH179W_rotateWrapper.BH179W_simple:not(.BH179W_color)": ":where(.simple:not(.color))",
  },
  children: [
    {
      ours: ".wrap",
      pick: has("BH179W_rotateWrapper"),
      children: [
        {
          ours: ".cover",
          pick: has("BH179W_book"),
          children: [
            {
              ours: ".band",
              pick: has("BH179W_stripe"),
              children: [
                { ours: ".illustration", pick: has("BH179W_illustration"), leaf: true },
                { ours: ".bind", pick: has("BH179W_bind") },
              ],
            },
            {
              ours: ".body",
              pick: has("BH179W_body"),
              children: [
                { ours: ".bind", pick: has("BH179W_bind") },
                {
                  ours: ".content",
                  pick: has("BH179W_content"),
                  children: [
                    { ours: ".title", pick: has("BH179W_title") },
                    { ours: ".illustration", pick: has("BH179W_illustration"), leaf: true },
                    // The icon: an inline svg, or a light and a dark logo image; slotted in ours, no rules of its own.
                    { ours: "", pick: (c) => c.tag === "svg" || c.tag === "img", all: true, leaf: true },
                  ],
                },
              ],
            },
            { ours: ".texture", pick: has("BH179W_texture") },
          ],
        },
        { ours: ".pages", pick: has("BH179W_pages") },
        { ours: ".back", pick: has("BH179W_back") },
      ],
    },
  ],
};
