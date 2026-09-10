// Docs page: Description — mirrors https://vercel.com/geist/description
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "description",
  title: "Description",
  lede: "A brief heading and subheading that give the reader the context they need to continue.",
  tags: ["acme-description"],
  examples: [
    {
      h: "Default",
      html: `<acme-description content="Data about this section." title="Section Title" tooltip="Additional context about what this section refers to."></acme-description>`,
    },
    {
      h: "Text right",
      html: `<acme-description content="Data about this section." right title="Section Title" tooltip="Additional context about what this section refers to."></acme-description>`,
    },
    {
      h: "Ellipsis",
      html: `<acme-description content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque sed venenatis libero. Phasellus consectetur turpis ac est pulvinar finibus. Mauris non tellus pretium, vehicula lectus sed, iaculis ex. Integer eu aliquet turpis. Cras sem nulla, commodo ut libero id, suscipit pulvinar lorem." ellipsis title="Section Title" tooltip="Additional context about what this section refers to."></acme-description>`,
    },
  ],
  practices: {
    "Best Practices": [
      "A Description is definition-list metadata: a short Title Case key with one value (Last Deployed, Region, Plan). Inline help under a form field is the input's helper text.",
      "It renders dl, dt and dd, so a screen reader announces each key and value as a definition; extra paragraphs around it break that.",
      "The title is a Title Case noun (Last Deployed, Build Duration); the content is sentence case unless the value is a literal identifier, ID or timestamp, which stays verbatim.",
      "A tooltip only when the title alone is ambiguous and one sentence settles it; the tooltip text is sentence case and ends with a period.",
      "No interactive control in the title: buttons, menus and links go in the content (dd) or the parent layout, never the label (dt).",
    ],
  },
};
