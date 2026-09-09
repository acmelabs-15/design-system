// Docs page: Search Input — mirrors https://vercel.com/geist/search-input
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "search-input",
  title: "Search Input",
  lede: "A search input with a magnifying glass and a clear button.",
  tags: ["acme-search"],
  examples: [
    {
      h: "Default",
      html: `<acme-search placeholder="Search projects" style="max-width:360px"></acme-search>`,
    },
    {
      h: "With ⌘K",
      html: `<acme-search cmdk placeholder="Search projects" style="max-width:360px"></acme-search>`,
    },
    {
      h: "Disabled",
      html: `<acme-search placeholder="Search projects" disabled style="max-width:360px"></acme-search>`,
    },
    {
      h: "Loading",
      html: `<acme-search value="Project A" loading style="max-width:360px"></acme-search>`,
    },
  ],
};
