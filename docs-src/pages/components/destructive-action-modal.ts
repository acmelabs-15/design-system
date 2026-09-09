// Docs page: Destructive Action Modal — mirrors https://vercel.com/geist/destructive-action-modal
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "destructive-action-modal",
  title: "Destructive Action Modal",
  lede: "Confirm a destructive action with a required type-to-confirm gate and an irreversibility band.",
  tags: ["acme-destructive-modal"],
  examples: [
    {
      h: "Default",
      p: "Shown static. The primary enables only when the typed phrase matches; submit dispatches acme-confirm.",
      html: `<acme-destructive-modal static heading="Delete Project" phrase="next-year-boilerplate" action="Delete Project" irreversible="Deleting next-year-boilerplate cannot be undone."><b>next-year-boilerplate</b> and all its deployments, domains, and environment variables will be permanently deleted.</acme-destructive-modal>`,
    },
  ],
  practices: {
    Behavior: [
      "The input gets focus on open; submit stays disabled until the phrase matches exactly; loading disables both buttons; an error keeps the modal open.",
      "Reversible but serious actions keep the typed gate and drop the red band.",
    ],
    Content: ["Title Case Verb + Noun as a statement, never a question; the description names the resource in bold; the success toast verb matches the button 1:1."],
  },
};
