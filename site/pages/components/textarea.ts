import type { Doc } from "../../site";
export const doc: Doc = {
  id: "textarea",
  title: "Textarea",
  lede: "Native multiline editing with optional content sizing.",
  tags: ["acme-textarea"],
  examples: [
    { h: "Default", html: '<acme-field><span slot="label">Description</span><acme-textarea placeholder="Describe your project"></acme-textarea></acme-field>' },
    { h: "Disabled", html: '<acme-textarea disabled aria-label="Description" value="Unavailable"></acme-textarea>' },
    { h: "Error", html: '<acme-field invalid><span slot="label">Description</span><acme-textarea value="Too short"></acme-textarea><span slot="error">Add more detail.</span></acme-field>' },
    {
      h: "Sizes",
      html: `<acme-v-stack gap="4">${["small", "medium", "large"].map((size) => `<acme-textarea size="${size}" aria-label="${size} description" placeholder="Description"></acme-textarea>`).join("")}</acme-v-stack>`,
    },
    { h: "Read Only", html: '<acme-textarea readonly aria-label="Summary" value="The project is ready for review."></acme-textarea>' },
    { h: "Rows", html: '<acme-textarea rows="5" aria-label="Detailed description"></acme-textarea>' },
    { h: "Auto resize", html: '<acme-textarea auto-resize min-height="80px" max-height="240px" aria-label="Notes" placeholder="Add several lines"></acme-textarea>' },
    { h: "Resize directions", html: '<acme-textarea resize="both" aria-label="Resizable notes"></acme-textarea>' },
  ],
};
