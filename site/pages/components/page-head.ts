// Docs page: Page Head (house component)
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "page-head",
  title: "Page Head",
  lede: "The page title, a meta line and the actions; a back link above when the page has a parent.",
  tags: ["acme-page-head"],
  house: true,
  examples: [
    {
      h: "Default",
      html: `<acme-page-head heading="Deployments"><span slot="meta">coding-agent-template · Production</span><acme-button slot="actions">Filters</acme-button><acme-button slot="actions" variant="primary">Deploy</acme-button></acme-page-head>`,
    },
    {
      h: "With a back link",
      html: `<acme-page-head heading="dpl_9WjH8QFQySx7" back="Deployments" back-href="#"><acme-status-dot slot="meta" state="ready" label></acme-status-dot><acme-button slot="actions" size="small">Visit</acme-button></acme-page-head>`,
    },
  ],
};
