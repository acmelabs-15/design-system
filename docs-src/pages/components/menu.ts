// Docs page: Menu — mirrors https://vercel.com/geist/menu
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "menu",
  title: "Menu",
  lede: "A dropdown list of actions opened from a button, with typeahead and keyboard navigation.",
  tags: ["acme-menu", "acme-menu-item", "acme-menu-section", "acme-menu-divider"],
  examples: [
    {
      h: "Default",
      p: "The trigger slot opens the items slot. Shown static.",
      html: `<div class="row" style="gap:24px;align-items:flex-start"><acme-menu static><acme-button slot="trigger" variant="primary">Actions</acme-button><acme-menu-item slot="items">One</acme-menu-item><acme-menu-item slot="items">Two</acme-menu-item><acme-menu-item slot="items">Three</acme-menu-item><acme-menu-item slot="items" href="#">Test for a link<svg class="ic" slot="suffix" aria-hidden="true"><use href="#i-ext"/></svg></acme-menu-item></acme-menu><acme-menu static><acme-button slot="trigger">Actions<svg class="ic" slot="suffix" aria-hidden="true"><use href="#i-chev"/></svg></acme-button><acme-menu-item slot="items">Rename Project</acme-menu-item><acme-menu-item slot="items" disabled>Transfer Project…</acme-menu-item><acme-menu-divider slot="items"></acme-menu-divider><acme-menu-item slot="items" danger>Delete Project</acme-menu-item></acme-menu></div>`,
    },
    {
      h: "With section, shortcut and lock",
      html: `<acme-menu static><acme-button slot="trigger">Actions</acme-button><acme-menu-section slot="items" heading="Section"><acme-menu-item>One</acme-menu-item><acme-menu-item>Two</acme-menu-item></acme-menu-section><acme-menu-divider slot="items"></acme-menu-divider><acme-menu-item slot="items" locked>Three</acme-menu-item><acme-menu-item slot="items" shortcut="⌘K">Four</acme-menu-item></acme-menu>`,
    },
    {
      h: "Live",
      p: "Click to open; Escape, outside click and activation close it.",
      html: `<div style="min-height:200px"><acme-menu><acme-button slot="trigger" variant="primary">Actions</acme-button><acme-menu-item slot="items">Rename Project</acme-menu-item><acme-menu-item slot="items">Transfer Project…</acme-menu-item><acme-menu-divider slot="items"></acme-menu-divider><acme-menu-item slot="items" danger>Delete Project</acme-menu-item></acme-menu></div>`,
    },
  ],
  practices: {
    Behavior: [
      "Open on click, not hover; close on activation, Escape and outside click; return focus to the trigger; auto-flip at the window bounds.",
      "Cap around 10 items; group with a section past that; lock permission-gated items with a lock suffix.",
    ],
    Content: ["Title Case Verb + Noun (Rename Project); … only when a dialog follows; destructive items last after a divider; section titles 1–2 words."],
  },
};
