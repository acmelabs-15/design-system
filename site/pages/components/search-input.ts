// Docs page: Search Input — mirrors https://vercel.com/geist/search-input
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "search-input",
  title: "Search Input",
  lede: "A ready-made search field with a magnifying glass and a clear button.",
  tags: ["acme-search"],
  examples: [
    {
      h: "Default",
      html: `<acme-search aria-label="Search" placeholder="Enter some text..."></acme-search>`,
    },
    {
      h: "With Cmdk",
      html: `<acme-search aria-label="Search" cmdk placeholder="Enter some text..."></acme-search>`,
    },
    {
      h: "Disabled",
      html: `<acme-search aria-label="Search" cmdk disabled placeholder="Enter some text..."></acme-search>`,
    },
    {
      h: "Loading",
      html: `<acme-search aria-label="Search" loading placeholder="Enter some text..." value="Project A"></acme-search>`,
    },
    {
      h: "Custom Prefix",
      html: `<acme-search aria-label="Search" placeholder="Enter some text..."><acme-auto-awesome-icon slot="start" style="color:currentColor" size="16px"></acme-auto-awesome-icon></acme-search>`,
    },
  ],
};
