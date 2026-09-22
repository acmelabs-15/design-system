import type { Doc } from "../../site";
export const doc: Doc = {
  id: "search-input",
  title: "Search",
  lede: "A native search field with a search icon and a clear action.",
  tags: ["acme-search"],
  examples: [
    { h: "Default", html: '<acme-search aria-label="Search projects" placeholder="Project name"></acme-search>' },
    { h: "Value", html: '<acme-search aria-label="Search projects" value="Project A"></acme-search>' },
    { h: "Disabled", html: '<acme-search disabled aria-label="Search projects" placeholder="Project name"></acme-search>' },
    { h: "Loading", html: '<acme-search loading aria-label="Search projects" value="Project A"></acme-search>' },
    { h: "Custom start", html: '<acme-search aria-label="Search favorites"><acme-star-icon slot="start"></acme-star-icon></acme-search>' },
    { h: "Without clear", html: '<acme-search clearable="false" aria-label="Search projects" value="Project A"></acme-search>' },
  ],
};
