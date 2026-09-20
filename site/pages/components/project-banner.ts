// Docs page: Project Banner — mirrors https://vercel.com/geist/project-banner
import type { Doc } from "../../site";

const shield = `<svg class="ic" width="16" height="16" slot="icon"><use href="#i-shield"/></svg>`;
const attack = (variant = "") =>
  `<acme-project-banner${variant ? ` variant="${variant}"` : ""} cta-label="Disable" cta-href="/">${shield}Attack Challenge Mode is enabled for this project</acme-project-banner>`;

export const doc: Doc = {
  id: "project-banner",
  title: "Project Banner",
  lede: "A temporary, project-wide notice that stays until someone resolves the state behind it.",
  tags: ["acme-project-banner"],
  examples: [
    { h: "Default", html: attack() },
    {
      h: "Success",
      p: "A positive, temporary mitigation that protects the project, such as Attack Challenge Mode.",
      html: `<div class="vstack" style="gap:24px"><div class="vstack" style="gap:8px">${attack("success")}</div></div>`,
    },
    {
      h: "Warning",
      p: "An exceptional state the project must leave, with no rush, such as an active rollback.",
      html: `<div class="vstack" style="gap:24px"><div class="vstack" style="gap:8px"><acme-project-banner variant="warning" cta-label="Undo Rollback"><svg class="ic" width="16" height="16" slot="icon"><use href="#i-rollback"/></svg>This project was rolled back by <acme-tooltip text="Yesterday for project marketing-website" style="text-decoration:underline dashed;text-underline-offset:5px">@johnphamous</acme-tooltip></acme-project-banner></div></div>`,
      script: `root.querySelector("acme-project-banner").addEventListener("acme-action", () => alert("Button clicked"));`,
    },
    {
      h: "Error",
      p: "Critical downtime, now or soon, that needs immediate attention, such as an overdue payment.",
      html: `<div class="vstack" style="gap:24px"><div class="vstack" style="gap:8px"><acme-project-banner variant="error" cta-label="Add Credit Card" cta-href="/$"><svg class="ic" width="16" height="16" slot="icon"><use href="#i-warn-tri"/></svg>Payment failed, update credit card information before your account is shut down</acme-project-banner></div></div>`,
    },
  ],
  practices: {
    "When to use": [
      "Project Banner is for project-wide states that need resolution: overdue billing, an active rollback, attack mitigation, an expiring trial that blocks deploys.",
      "An inline message tied to one field or card is a Note; a transient acknowledgment is a Toast; a confirmation is a Modal.",
      "The variant follows severity: <code>error</code> for critical downtime or a payment-blocking state, <code>warning</code> for an exceptional state with non-immediate action, <code>success</code> for a positive temporary mitigation, <code>gray</code> for a routine project-wide notice.",
    ],
    Behavior: [
      "A Project Banner has no dismiss control by design. A message that can go away without resolving the state is a Note, not a banner.",
      "One Project Banner at a time. Stacked banners drown the most urgent state.",
      "Every banner carries a call to action that resolves the state. A banner with no route is a dead end.",
    ],
    Content: [
      "The label is one sentence in sentence case that names the impact: <code>Your Pro trial expires in 3 days.</code> No <code>Heads up</code>, no apology first.",
      "The call to action is Title Case Verb + Noun and points at the resolver: <code>Update Payment Method</code>, <code>Reactivate Project</code>, <code>Review Tokens</code>.",
      "Name the affected entity when the surrounding chrome does not make the project obvious (<code>Production deployments are paused on my-project</code>).",
      "No emoji or interjection to signal severity in the copy; the variant carries that signal.",
    ],
  },
};
