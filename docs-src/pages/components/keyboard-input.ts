// Docs page: Keyboard Input — mirrors https://vercel.com/geist/keyboard-input
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "keyboard-input",
  title: "Keyboard Input",
  lede: "Display a keyboard shortcut that triggers an action.",
  tags: ["acme-kbd"],
  examples: [
    {
      h: "Modifiers",
      p: "The modifier props render the platform's glyph: ⌘ on a Mac, Ctrl elsewhere.",
      html: `<div class="row" style="gap:8px"><acme-kbd meta></acme-kbd><acme-kbd shift></acme-kbd><acme-kbd alt></acme-kbd><acme-kbd ctrl></acme-kbd></div>`,
    },
    {
      h: "Combination",
      html: `<div class="row" style="gap:8px"><acme-kbd meta shift></acme-kbd><acme-kbd meta>K</acme-kbd></div>`,
    },
    {
      h: "Small",
      html: `<acme-kbd small>/</acme-kbd>`,
    },
  ],
  practices: {
    Content: ["One key per element; modifiers swap ⌘ for Ctrl on Windows and Linux; punctuation stays outside the element.", "Small inside dense surfaces: menu rows, command items, table cells."],
  },
};
