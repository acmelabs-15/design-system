// Docs page: Clearable Input — mirrors https://vercel.com/geist/clearable-input
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "clearable-input",
  title: "Clearable Input",
  lede: "An input with a button that clears its value, and Escape does the same.",
  tags: ["acme-input"],
  examples: [
    {
      h: "Default",
      html: `<acme-input clearable value="coding-agent-template" aria-label="Project" style="max-width:320px"></acme-input>`,
    },
    {
      h: "Search with ⌘K",
      p: "The Search Input carries the keycaps.",
      html: `<acme-search cmdk placeholder="Search projects…" style="max-width:320px"></acme-search>`,
    },
  ],
};
