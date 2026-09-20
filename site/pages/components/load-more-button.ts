// Docs page: Load More Button — mirrors https://vercel.com/geist/load-more-button
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "load-more-button",
  title: "Load More Button",
  lede: "A full-width button that appends more items to a paginated list, with a loading state and layout variants.",
  tags: ["acme-load-more"],
  examples: [
    {
      h: "Default",
      html: `<acme-load-more>Load More</acme-load-more>`,
    },
    {
      h: "Loading",
      html: `<acme-load-more loading>Loading...</acme-load-more>`,
    },
    {
      h: "No Gap",
      p: "no-gap removes the space above the button.",
      html: `<acme-load-more no-gap>Load More</acme-load-more>`,
    },
    {
      h: "No Border Radius",
      p: "no-border-radius squares the corners so the button sits flush with the list.",
      html: `<acme-load-more no-border-radius>Load More</acme-load-more>`,
    },
    {
      h: "Custom Text",
      html: `<acme-load-more>Show More Results</acme-load-more>`,
    },
  ],
};
