// Docs page: Middle Truncate — mirrors https://vercel.com/geist/middle-truncate
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "middle-truncate",
  title: "Middle Truncate",
  lede: "Truncate in the middle so the start and the end of a string both survive.",
  tags: ["acme-middle-truncate"],
  examples: [
    {
      h: "Examples",
      html: `<div class="vstack" style="gap:8px;max-width:420px"><div class="row" style="gap:16px;padding:12px 16px;border:1px solid var(--ds-gray-alpha-200);border-radius:6px"><span class="text-copy-13" style="width:128px;flex:none;color:var(--text-2)">Branch</span><acme-middle-truncate text="feature/redesign-dashboard-analytics-charts-with-new-tokens" tail="6"></acme-middle-truncate></div><div class="row" style="gap:16px;padding:12px 16px;border:1px solid var(--ds-gray-alpha-200);border-radius:6px"><span class="text-copy-13" style="width:128px;flex:none;color:var(--text-2)">Deployment</span><acme-middle-truncate class="mono" style="font-size:13px" text="dpl_8gmXTT1yJRP8UbGfXDvw5jhTE3Rb9" tail="4"></acme-middle-truncate></div></div>`,
    },
  ],
  practices: {
    "When to use": [
      "Paths, URLs, deployment IDs, commit hashes, branch names with prefixes; prose and headings end-truncate.",
      "Pair with a tooltip or a copy affordance; copying yields the full string.",
    ],
  },
};
