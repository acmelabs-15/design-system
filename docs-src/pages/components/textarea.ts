// Docs page: Textarea — mirrors https://vercel.com/geist/textarea
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "textarea",
  title: "Textarea",
  lede: "Retrieve multi-line user input.",
  tags: ["acme-textarea"],
  examples: [
    {
      h: "Default",
      html: `<acme-textarea placeholder="Default" aria-label="Default" style="max-width:420px"></acme-textarea>`,
    },
    {
      h: "Disabled",
      html: `<acme-textarea placeholder="Disabled" disabled style="max-width:420px"></acme-textarea>`,
    },
    {
      h: "Error",
      html: `<acme-textarea value="Lorem ipsum" error="There has been an error." style="max-width:420px"></acme-textarea>`,
    },
    {
      h: "Large with label",
      html: `<acme-textarea size="large" label="Release Notes" placeholder="Large" style="max-width:420px"></acme-textarea>`,
    },
  ],
  practices: {
    Content: ["Short Title Case noun labels (Description, Release Notes); example placeholders; validation names the field and the constraint and ends with a period."],
  },
};
