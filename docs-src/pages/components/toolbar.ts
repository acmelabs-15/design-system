// Docs page: Toolbar (house component)
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "toolbar",
  title: "Toolbar",
  lede: "A row of controls above a list, with an end group pushed right.",
  tags: ["acme-toolbar"],
  house: true,
  examples: [
    {
      h: "Default",
      html: `<acme-toolbar><acme-search placeholder="Search deployments" style="width:260px"></acme-search><acme-select options='["All branches","main"]' aria-label="Branch"></acme-select><acme-button slot="end">Export</acme-button><acme-button slot="end" variant="primary">Deploy</acme-button></acme-toolbar>`,
    },
  ],
};
