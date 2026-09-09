// Docs page: Pagination — mirrors https://vercel.com/geist/pagination
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "pagination",
  title: "Pagination",
  lede: "Navigate to the previous or next page.",
  tags: ["acme-pagination"],
  examples: [
    {
      h: "Default",
      html: `<acme-pagination prev-title="Home" prev-href="#" next-title="Introduction" next-href="#"></acme-pagination>`,
    },
  ],
  practices: {
    Content: ["Sibling pages only; titles are the destination names in Title Case with the distinctive word first; hide an end slot rather than disable it."],
  },
};
