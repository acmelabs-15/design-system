// Docs page: Project Banner — mirrors https://vercel.com/geist/project-banner
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "project-banner",
  title: "Project Banner",
  lede: "A project-wide notification that needs resolution and cannot be dismissed.",
  tags: ["acme-project-banner"],
  examples: [
    {
      h: "Variants",
      html: `<div class="vstack" style="margin:-24px"><acme-project-banner><svg class="ic" slot="icon" aria-hidden="true"><use href="#i-shield"/></svg>Attack Challenge Mode is enabled for this project.<a slot="action" href="#">Disable</a></acme-project-banner><acme-project-banner variant="success"><svg class="ic" slot="icon" aria-hidden="true"><use href="#i-shield"/></svg>Attack Challenge Mode is enabled for this project.<a slot="action" href="#">Disable</a></acme-project-banner><acme-project-banner variant="warning"><svg class="ic" slot="icon" aria-hidden="true"><use href="#i-rollback"/></svg>This project was rolled back by <span>@johnphamous</span>.<button slot="action">Undo Rollback</button></acme-project-banner><acme-project-banner variant="error"><svg class="ic" slot="icon" aria-hidden="true"><use href="#i-warn-tri"/></svg>Payment failed, update your card to keep deploying.<a slot="action" href="#">Add Credit Card</a></acme-project-banner></div>`,
    },
  ],
  practices: {
    "When to use": ["Overdue billing, an active rollback, attack mitigation, an expiring trial. One at a time; always with a call to action that resolves the state."],
    Content: ["One sentence in sentence case naming the impact; the CTA is Title Case Verb + Noun (Update Payment Method)."],
  },
};
