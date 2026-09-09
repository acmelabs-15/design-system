// Docs page: Feedback — mirrors https://vercel.com/geist/feedback
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "feedback",
  title: "Feedback",
  lede: "Gather text feedback with an associated emotion, on desktop.",
  tags: ["acme-feedback"],
  examples: [
    {
      h: "Trigger",
      p: "Click to open the panel.",
      html: `<div class="row"><acme-feedback></acme-feedback><acme-feedback><svg class="ic" slot="prefix" aria-hidden="true"><use href="#i-flag"/></svg></acme-feedback></div>`,
    },
    {
      h: "Inline",
      html: `<acme-feedback inline prompt="Was this helpful?"></acme-feedback>`,
    },
    {
      h: "Panel",
      p: "The open panel, static.",
      html: `<acme-feedback static prompt="How did the import go?"></acme-feedback>`,
    },
  ],
  practices: {
    "When to use": ["At the end of a page, doc or completed flow; not a support form or NPS."],
    Behavior: ["Collapsed until clicked; submit closes the panel and returns focus; metadata carries non-PII context (route, build ID, plan)."],
    Content: ["The label is Title Case and short without a question mark; the prompt is sentence case; the placeholder Your feedback... is fixed."],
  },
};
