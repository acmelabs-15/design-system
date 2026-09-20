// Docs page: Pagination — mirrors https://vercel.com/geist/pagination
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "pagination",
  title: "Pagination",
  lede: "Two rail links that take the reader to the page before and the page after this one.",
  tags: ["acme-pagination"],
  examples: [
    {
      h: "Default",
      html: `<acme-pagination prev-title="Home" prev-href="#" next-title="Introduction" next-href="#"></acme-pagination>`,
    },
  ],
  practices: {
    "Best Practices": [
      "Pagination moves between sibling pages in a sequence: docs articles, blog posts, onboarding steps. To reveal more rows of one data set, use Show More or a numbered pager.",
      "<code>prev-title</code> and <code>next-title</code> are the destination page names (<code>Deploy Hooks</code>, <code>Environment Variables</code>). The element adds the <code>Previous</code> / <code>Next</code> label, the chevron and the <code>Go to {direction} page: {title}</code> accessible name; no arrows or <code>Go to</code> in the title.",
      "At the start or end of a sequence, leave the slot empty instead of disabling it. An empty rail reads cleaner than a dimmed link that goes nowhere.",
      "Titles are Title Case and short enough to fit the rail on one line. A long name truncates, so the distinctive word goes first.",
      "No ordinal positions such as <code>Page 3 of 10</code> in a title. Pagination is a sibling link, not a numbered pager.",
    ],
  },
};
