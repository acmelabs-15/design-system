// Docs page: Loading Dots — mirrors https://vercel.com/geist/loading-dots
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "loading-dots",
  title: "Loading Dots",
  lede: "Indicate an action running in the background, inside copy.",
  tags: ["acme-loading-dots"],
  examples: [
    {
      h: "Default",
      html: `<div class="row" style="gap:24px"><acme-loading-dots size="small"></acme-loading-dots><acme-loading-dots></acme-loading-dots><acme-loading-dots size="large"></acme-loading-dots></div>`,
    },
    {
      h: "With text",
      html: `<p class="text-copy-14" style="color:var(--text-2)" aria-live="polite"><acme-loading-dots>Loading</acme-loading-dots></p>`,
    },
  ],
  practices: {
    "When to use": [
      "Short indeterminate waits inside copy: Saving, Building. For buttons, the loading state of Button; for layout, Skeleton; for known progress, Progress; icon-sized waits, Spinner.",
    ],
    Content: ["Name the work in flight (Deploying, Uploading); never after a completed verb."],
  },
};
