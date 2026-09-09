// Docs page: Skeleton — mirrors https://vercel.com/geist/skeleton
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "skeleton",
  title: "Skeleton",
  lede: "Display a placeholder while the real content loads.",
  tags: ["acme-skeleton"],
  examples: [
    {
      h: "Default with set width",
      html: `<acme-skeleton width="160px"></acme-skeleton>`,
    },
    {
      h: "Box height",
      html: `<acme-skeleton width="160px" height="42px"></acme-skeleton>`,
    },
    {
      h: "Shapes",
      p: "Pill for avatars, rounded for buttons and chips, squared for image tiles.",
      html: `<div class="row" style="gap:16px"><acme-skeleton shape="pill" width="48px" height="48px"></acme-skeleton><acme-skeleton shape="rounded" width="96px" height="36px"></acme-skeleton><acme-skeleton shape="squared" width="48px" height="48px"></acme-skeleton></div>`,
    },
    {
      h: "No animation",
      html: `<acme-skeleton still height="100px"></acme-skeleton>`,
    },
  ],
  practices: {
    "When to use": ["Async data filling a known layout: rows, card grids, profile blocks. Never as decoration or as an empty state."],
    Behavior: ["Match the final content's size so nothing shifts; aria-busy on the region; honor reduced motion."],
  },
};
