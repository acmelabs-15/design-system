// Docs page: Book — mirrors https://vercel.com/geist/book
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "book",
  title: "Book",
  lede: "A decorative cover for marketing and docs landings, never for product rows.",
  tags: ["acme-book"],
  examples: [
    {
      h: "Default",
      html: `<div class="row" style="gap:24px;align-items:flex-start"><acme-book heading="The Design of Everyday Things" author="Don Norman"></acme-book><acme-book heading="Next.js Handbook" author="Vercel" hue="blue"></acme-book></div>`,
    },
    {
      h: "Variants",
      p: "simple fills the cover with the hue; stripe keeps a thin band.",
      html: `<div class="row" style="gap:24px;align-items:flex-start"><acme-book variant="simple" hue="teal" heading="Fluid Compute"></acme-book><acme-book variant="stripe" hue="pink" heading="Observability Guide" author="Vercel"></acme-book><acme-book hue="gray" heading="Git Workflows"><svg class="ic" slot="icon" aria-hidden="true"><use href="#i-branch"/></svg></acme-book></div>`,
    },
  ],
  practices: {
    "When to use": ["Marketing and docs landings only; not in dashboards or rows.", "The band takes any token; textured covers are for hero shots only."],
  },
};
