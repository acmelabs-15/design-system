import type { Doc } from "../../site";

export const doc: Doc = {
  id: "keyboard-input",
  title: "Keyboard Input",
  tags: ["acme-kbd"],
  lede: "Display named keys or author-owned key-cap content. Kbd never registers a shortcut.",
  examples: [
    { h: "Named keys", html: `<acme-kbd keys='["Mod","Shift","K"]'></acme-kbd>` },
    { h: "Individual modifiers", html: `<acme-kbd keys='["Meta"]'></acme-kbd><acme-kbd keys='["Shift"]'></acme-kbd><acme-kbd keys='["Alt"]'></acme-kbd><acme-kbd keys='["Control"]'></acme-kbd>` },
    { h: "Small key cap", html: '<acme-kbd size="small">/</acme-kbd>' },
  ],
  practices: {
    "Keep display separate from behavior": [
      "keys supplies named keys in authored order. When keys is absent, the default slot supplies the content.",
      "Platform symbols come from the shared hotkey formatter. Application message catalogs can replace visible and accessible key labels.",
      "Use configureMessages(locale, labels) with keys such as kbd.Control and kbd.Control.label. Platform-specific labels use kbd.mac.Control or the matching windows/linux key.",
    ],
  },
};
