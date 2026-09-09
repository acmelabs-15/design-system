// Docs page: Empty State — mirrors https://vercel.com/geist/empty-state
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "empty-state",
  title: "Empty State",
  lede: "Fill a space that has no content yet, so the reader knows what to do next.",
  tags: ["acme-empty-state", "acme-icon-tile"],
  examples: [
    {
      h: "Blank slate",
      html: `<acme-empty-state heading="Title"><acme-icon-tile slot="icon"><svg class="ic" aria-hidden="true"><use href="#i-chart"/></svg></acme-icon-tile>A message conveying the state of the product.</acme-empty-state>`,
    },
    {
      h: "Informational",
      html: `<acme-empty-state heading="No Custom Events"><acme-icon-tile slot="icon"><svg class="ic" aria-hidden="true"><use href="#i-chart"/></svg></acme-icon-tile>This should detail the actions you can take on this screen, as well as why it is valuable.<acme-button slot="actions">Primary Action</acme-button><a slot="actions" href="#">Learn more <svg class="ic" aria-hidden="true"><use href="#i-arrow"/></svg></a></acme-empty-state>`,
    },
    {
      h: "No results",
      html: `<acme-empty-state heading="No Logs Match Your Filter">No logs match “status:500”. Clear the filter to see all logs.<acme-button slot="actions">Clear Filter</acme-button></acme-empty-state>`,
    },
    {
      h: "Dashboard forms",
      p: "flat drops the border; quiet is the inline note.",
      html: `<div class="vstack"><acme-empty-state variant="flat" heading="No deployments yet">Push to a connected branch to create one.</acme-empty-state><acme-empty-state variant="quiet">No data for this range.</acme-empty-state></div>`,
    },
  ],
  practices: {
    "When to use": [
      "Pick the variant by need: no-results, blank slate or informational, educational, guide, cleared, permission, error.",
      "One primary CTA, at most one secondary; the CTA is a real button or link.",
    ],
    Content: [
      "Title Case title, sentence-case description that adds new information; quote a typed query with curly quotes.",
      "CTA labels are Title Case Verb + Noun, never Get Started, Continue or OK.",
    ],
  },
};
