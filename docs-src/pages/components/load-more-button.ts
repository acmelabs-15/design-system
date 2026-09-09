// Docs page: Load More Button — mirrors https://vercel.com/geist/load-more-button
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "load-more-button",
  title: "Load More Button",
  lede: "A full-width button that appends more items to a paginated list.",
  tags: ["acme-load-more"],
  examples: [
    {
      h: "Default",
      html: `<acme-load-more></acme-load-more>`,
    },
    {
      h: "Loading",
      html: `<acme-load-more loading></acme-load-more>`,
    },
    {
      h: "Custom text",
      html: `<acme-load-more>Show More Results</acme-load-more>`,
    },
  ],
};
