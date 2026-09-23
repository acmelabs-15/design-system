import type { Doc } from "../../site";
const actions = '<acme-button variant="secondary">Save</acme-button><acme-toggle-button>Bold</acme-toggle-button><acme-button variant="secondary" disabled>Unavailable</acme-button>';
export const doc: Doc = {
  id: "toolbar",
  title: "Toolbar",
  lede: "Related actions with one named keyboard focus owner.",
  tags: ["acme-toolbar"],
  examples: [
    { h: "Actions", html: `<acme-toolbar aria-label="Document actions">${actions}<acme-button variant="secondary">Export</acme-button></acme-toolbar>` },
    {
      h: "Attached presentation and selection",
      html: `<acme-toolbar aria-label="Formatting"><acme-group attached>${actions}</acme-group><acme-radio-group name="alignment" value="left" aria-label="Alignment"><acme-radio value="left">Left</acme-radio><acme-radio value="center">Center</acme-radio><acme-radio value="right">Right</acme-radio></acme-radio-group></acme-toolbar>`,
    },
    { h: "Trailing text input", html: `<acme-toolbar aria-label="Search actions">${actions}<input slot="end" aria-label="Search" placeholder="Search"></acme-toolbar>` },
    { h: "Vertical", html: `<acme-toolbar aria-label="Vertical actions" orientation="vertical">${actions}</acme-toolbar>` },
    { h: "Disabled toolbar", html: `<acme-toolbar aria-label="Unavailable actions" disabled>${actions}</acme-toolbar>` },
  ],
  practices: {
    Keyboard: [
      "Provide aria-label or aria-labelledby. Tab enters at the first available control; arrows, Home and End move focus. A vertical Toolbar uses vertical arrows. loop=false stops at the ends.",
      "Radio and Segmented Control choices remain owned by their selection component. Toolbar arrows move focus without selecting; Space changes the focused choice.",
      "Text inputs keep their editing keys. Follow the accessibility pattern by placing a control with conflicting editing keys last. Tab exits; reentry returns to the first action. Use ordinary layout for a row of independent filters.",
      "Native disabled controls are skipped. Disabling the whole Toolbar makes its content inert without rewriting individual disabled properties.",
      "Menus retain their own arrow handling and return focus to their trigger. Group supplies joined appearance, not keyboard ownership.",
    ],
  },
};
