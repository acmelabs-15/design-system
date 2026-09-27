import type { Doc } from "../../site";

export const doc: Doc = {
  id: "data-list",
  title: "Data List",
  tags: ["acme-data-list"],
  lede: "Present native terms and definitions with rich, author-owned values.",
  examples: [
    {
      h: "Metadata",
      html: '<acme-data-list><dl><div><dt>Project</dt><dd>Design system</dd></div><div><dt>Status</dt><dd><acme-badge>Ready</acme-badge></dd></div><div><dt>Owner</dt><dd><acme-link href="#team">Platform team</acme-link></dd></div></dl></acme-data-list>',
    },
    { h: "Multiple definitions", html: "<acme-data-list><dl><dt>Maintainers</dt><dd>Platform team</dd><dd>Accessibility team</dd><dt>Region</dt><dd>Global</dd></dl></acme-data-list>" },
    {
      h: "Vertical",
      html: '<acme-data-list orientation="vertical"><dl><div><dt>Release</dt><dd>September update</dd></div><div><dt>Summary</dt><dd>Shared controls and predictable interfaces.</dd></div></dl></acme-data-list>',
    },
    {
      h: "Column width and sizes",
      html: '<acme-data-list size="small" column-width="8rem"><dl><div><dt>Build</dt><dd>Successful</dd></div><div><dt>Revision</dt><dd><acme-copy-button value="2ec047be1" aria-label="Copy revision"></acme-copy-button> 2ec047be1</dd></div></dl></acme-data-list>',
    },
  ],
  practices: {
    Content: [
      "Supply one native dl with dt and dd children. Optional div elements may group each term and its definitions. Content stays in its original DOM parent.",
      "Use data-acme-data-list-part=item, label and value on your native elements for application-specific styling. The wrapper exposes the root shadow part.",
      "Horizontal pairs stack when the component becomes narrower than 24rem. Use orientation=vertical to keep them stacked at every width.",
      "Put links, badges and copy controls inside dd. Data List owns no form value, selection or keyboard engine.",
    ],
  },
};
