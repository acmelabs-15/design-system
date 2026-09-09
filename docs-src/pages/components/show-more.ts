// Docs page: Show More — mirrors https://vercel.com/geist/show-more
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "show-more",
  title: "Show More",
  lede: "Progressive disclosure of a single long list or block.",
  tags: ["acme-show-more"],
  examples: [
    {
      h: "Default",
      html: `<acme-show-more></acme-show-more>`,
    },
    {
      h: "Expanded",
      html: `<acme-show-more expanded></acme-show-more>`,
    },
    {
      h: "No border, with a count",
      html: `<acme-show-more no-border count="12"></acme-show-more>`,
    },
  ],
  practices: {
    Behavior: ["Show 5–10 rows before truncating; name the hidden count (Show 12 More); move focus to the first revealed row; aria-expanded on the trigger."],
  },
};
