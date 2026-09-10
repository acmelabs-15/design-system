// Docs page: Keyboard Input — mirrors https://vercel.com/geist/keyboard-input
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "keyboard-input",
  title: "Keyboard Input",
  lede: "Display keyboard input that triggers an action.",
  tags: ["acme-kbd"],
  examples: [
    {
      h: "Modifiers",
      html: `<acme-kbd meta></acme-kbd><acme-kbd shift></acme-kbd><acme-kbd alt></acme-kbd><acme-kbd ctrl></acme-kbd>`,
    },
    {
      h: "Combination",
      html: `<acme-kbd meta shift></acme-kbd>`,
    },
    {
      h: "Small",
      html: `<acme-kbd small>/</acme-kbd>`,
    },
  ],
  practices: {
    "Best Practices": [
      "Use the element for shortcut hints in prose, menu items and button suffixes. Long-form docs that narrate a shortcut write the ⌘ K shortcut as text, so the page copies to plain text unchanged.",
      "Pass modifiers as the boolean attributes meta, shift, alt and ctrl. The element swaps ⌘ for Ctrl on Windows and Linux; a hard-coded Cmd+K ships the wrong glyph to half the readers.",
      "The content is one key, digit or named key (K, 7, Enter, Esc). Keep its case, keep modifiers out of it, and never pack a sentence into the element.",
      "Use small in dense surfaces (menu rows, command-bar items, table cells) where the default size crowds the text next to it.",
      "Punctuation stays outside the element: Press ⌘ K to open the command menu. Periods, commas and or separators live in the prose, so a screen reader does not read them as keys.",
    ],
  },
};
