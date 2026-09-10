// Maps acme-kbd (src/components/kbd) to Geist Kbd (the Keyboard Input page): the generator derives kbd.styles.ts from this.
// Each modifier glyph and the key sit in their own span; the meta span's inline style is the element's.
import type { GeistMap, SpecNode } from "../gen";

export const geist: GeistMap = {
  page: "keyboard-input",
  component: "Kbd",
  root: "data-geist-kbd",
  ours: ".kbd",
  defaults: { small: "false" },
  props: {
    small: { true: ".sm" },
  },
  children: [{ ours: ".key", pick: (c: SpecNode) => c.tag === "span" }],
};
