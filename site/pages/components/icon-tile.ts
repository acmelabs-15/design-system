import type { Doc } from "../../site";

export const doc: Doc = {
  id: "icon-tile",
  title: "Icon Tile",
  lede: "A presentation surface around an authored icon.",
  tags: ["acme-icon-tile"],
  examples: [
    { h: "Default", html: '<acme-icon-tile><acme-folder-icon size="24px"></acme-folder-icon></acme-icon-tile>' },
    {
      h: "Explicit dimensions",
      html: '<acme-h-stack><acme-icon-tile size="40px"><acme-search-icon size="20px"></acme-search-icon></acme-icon-tile><acme-icon-tile size="64px"><acme-folder-icon size="32px"></acme-folder-icon></acme-icon-tile></acme-h-stack>',
    },
    {
      h: "Empty-state indicator",
      html: '<acme-empty-state variant="outline"><acme-empty-state-indicator slot="indicator"><acme-icon-tile><acme-folder-icon size="24px"></acme-folder-icon></acme-icon-tile></acme-empty-state-indicator><acme-heading slot="heading" as="h3">No projects yet</acme-heading><p slot="description">Create a project to get started.</p></acme-empty-state>',
    },
  ],
  practices: {
    Composition: [
      "Icon Tile owns presentation. Its icon keeps its own accessible meaning; use a label on the icon when it conveys information that is not repeated nearby.",
      "size sets both dimensions using a CSS size. Omit it to use the default tile dimensions. The icon size remains a separate input on the icon.",
      "Use Icon Button for an action. A presentation tile does not add a button role, click behavior or keyboard focus.",
    ],
  },
};
