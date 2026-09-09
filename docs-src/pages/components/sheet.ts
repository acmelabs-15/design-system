// Docs page: Sheet — mirrors https://vercel.com/geist/sheet
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "sheet",
  title: "Sheet",
  lede: "Content in a side panel that slides in from the edge of the screen.",
  tags: ["acme-sheet"],
  examples: [
    {
      h: "Default",
      p: "Inset 12px from the edges, radius 16, the page stays interactive. Shown static.",
      html: `<acme-sheet static heading="Sheet Title"><p slot="description">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>Eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.<acme-button slot="actions">Close</acme-button><acme-button slot="actions" variant="primary">Next</acme-button></acme-sheet>`,
    },
  ],
  practices: {
    "When to use": ["Persistent associated context: deployment details, log row inspection, a member profile. Modal for a blocking decision, Drawer for mobile."],
    Behavior: ["Outside click does not close, so always render Close and honor Escape; trap focus and return it to the trigger row."],
    Content: ["Title Case title naming the entity (Deployment Details); read-mostly body; buttons Verb + Noun."],
  },
};
