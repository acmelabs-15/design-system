// Docs page: Relative Time Card — mirrors https://vercel.com/geist/relative-time-card
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "relative-time-card",
  title: "Relative Time Card",
  lede: "A popover that shows a given date in local time.",
  tags: ["acme-relative-time"],
  examples: [
    {
      h: "Default",
      p: "The trigger renders the short form; hover shows the moment in UTC and local time.",
      html: `<div class="row" style="gap:32px"><acme-relative-time date="1789002000000"></acme-relative-time><acme-relative-time date="1788900000000"></acme-relative-time><acme-relative-time date="1788300000000"></acme-relative-time></div>`,
    },
    {
      h: "Static",
      p: "The card pinned open.",
      html: `<div style="min-height:140px"><acme-relative-time static open date="1789002000000"></acme-relative-time></div>`,
    },
  ],
  practices: {
    "When to use": ["Recent timestamps in tables, entity rows, deploy lists and feeds; past 7 days in prose, render Mar 14, 2026 directly."],
    Content: ["Pass the date as epoch ms; the formatter produces 2m, 5h, Yesterday and already includes ago; children only for non-time labels (Just now, Queued)."],
  },
};
