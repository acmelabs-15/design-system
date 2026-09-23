import type { Doc } from "../../site";
export const doc: Doc = {
  id: "item",
  title: "Item",
  tags: ["acme-item", "acme-item-media", "acme-item-content", "acme-item-heading", "acme-item-description", "acme-item-metadata", "acme-item-actions"],
  lede: "Arrange media, descriptive content and independent actions without adding another interaction owner.",
  examples: [
    {
      h: "Content and actions",
      html: '<acme-item variant="outline"><acme-item-media><acme-folder-icon size="24px"></acme-folder-icon></acme-item-media><acme-item-content><acme-item-heading>Project assets</acme-item-heading><acme-item-description>Images, documents and shared resources.</acme-item-description><acme-item-metadata>Updated today</acme-item-metadata></acme-item-content><acme-item-actions><acme-button variant="secondary" size="small">Manage</acme-button></acme-item-actions></acme-item>',
    },
    {
      h: "Native navigation and a separate action",
      html: '<acme-item><acme-item-content><acme-item-heading><acme-link href="#project">Project overview</acme-link></acme-item-heading><acme-item-description>Open the project or manage it separately.</acme-item-description></acme-item-content><acme-item-actions><acme-button variant="secondary" size="small">Manage project</acme-button></acme-item-actions></acme-item>',
    },
    {
      h: "List composition",
      html: '<acme-list marker="none"><ul aria-label="Resources"><li><acme-item variant="outline"><acme-item-content><acme-item-heading>Design notes</acme-item-heading><acme-item-description>Research and decisions</acme-item-description></acme-item-content></acme-item></li><li><acme-item variant="outline"><acme-item-content><acme-item-heading>Examples</acme-item-heading><acme-item-description>Verified compositions</acme-item-description></acme-item-content></acme-item></li></ul></acme-list>',
    },
    {
      h: "Vertical",
      html: '<acme-item orientation="vertical" variant="muted"><acme-item-media><acme-description-icon size="32px"></acme-description-icon></acme-item-media><acme-item-content><acme-item-heading>Release notes</acme-item-heading><acme-item-description>Content flows vertically in this presentation.</acme-item-description></acme-item-content><acme-item-actions><acme-button variant="secondary">Read notes</acme-button></acme-item-actions></acme-item>',
    },
    {
      h: "Selection content",
      html: '<acme-radio-group aria-label="Plan"><acme-radio-card value="standard"><acme-item-content><acme-item-heading>Standard</acme-item-heading><acme-item-description>A focused set of features.</acme-item-description></acme-item-content></acme-radio-card><acme-radio-card value="extended"><acme-item-content><acme-item-heading>Extended</acme-item-heading><acme-item-description>Additional capabilities.</acme-item-description></acme-item-content></acme-radio-card></acme-radio-group>',
    },
  ],
  practices: {
    Ownership: [
      "Item provides content structure. It owns no selection, form value, link destination or keyboard collection.",
      "Place Item inside a native li for a list, or compose its content parts inside the appropriate selection control. List and Radio Group keep those responsibilities.",
      "Item Heading does not choose a heading level. Compose Heading when the document needs an actual heading.",
      "Keep secondary actions outside the main link or selection label. Actions remain available to keyboard and touch users.",
    ],
  },
};
