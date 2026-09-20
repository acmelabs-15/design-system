// Docs page: Show more — mirrors https://vercel.com/geist/show-more
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "show-more",
  title: "Show more",
  lede: "A styled control that shows content as expanded or collapsed.",
  tags: ["acme-show-more"],
  examples: [
    {
      h: "Default",
      p: "The element is controlled: the owner flips expanded on click.",
      html: `<acme-show-more></acme-show-more>`,
      script: `const el = root.querySelector("acme-show-more");
el.addEventListener("click", () => { el.expanded = !el.expanded; });`,
    },
    {
      h: "Expanded",
      html: `<acme-show-more expanded></acme-show-more>`,
    },
    {
      h: "No border",
      html: `<acme-show-more no-border></acme-show-more>`,
    },
  ],
  practices: {
    "Best Practices": [
      "Use Show More to reveal the rest of one long list or block: recent activity, repo branches, attached resources. Use Pagination for sibling pages of one data set and Collapse for optional sections.",
      "Show enough rows to convey the shape of the list before you truncate; five to ten is typical. A cut at two rows feels performative.",
      "Put the hidden count on the trigger so the cost of expanding is clear (<code>Show 12 More</code>, then <code>Show Less</code> once open). Both labels are Title Case.",
      "Do not flip between Show More and Show Less on the same data mid-flow. Collapsing rows the user opened scrolls them away from where they read.",
      "Render hidden rows in the DOM when the count is small so find-in-page works. Lazy-load only when the data set is large enough to slow the first render.",
      "The trigger is a <code>button</code> with <code>aria-expanded</code> and <code>aria-controls</code> pointing at the list. After expanding, move focus to the first revealed row.",
    ],
  },
};
