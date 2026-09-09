// Docs page: Description — mirrors https://vercel.com/geist/description
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "description",
  title: "Description",
  lede: "A brief heading and content that give the reader context to continue.",
  tags: ["acme-description"],
  examples: [
    {
      h: "Default",
      html: `<acme-description title="Section Title" tooltip="Data about this section.">Data about this section.</acme-description>`,
    },
    {
      h: "Text right",
      html: `<acme-description title="Section Title" right>Data about this section.</acme-description>`,
    },
    {
      h: "Ellipsis",
      html: `<acme-description title="Section Title" ellipsis style="display:block;max-width:240px">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</acme-description>`,
    },
  ],
  practices: {
    Content: [
      "Title Case noun keys (Last Deployed, Region, Plan); sentence-case values unless the value is a literal ID or timestamp.",
      "A tooltip only when the title alone is ambiguous; no controls in the title.",
    ],
  },
};
