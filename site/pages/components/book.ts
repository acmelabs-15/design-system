// Docs page: Book — mirrors https://vercel.com/geist/book
import type { Doc } from "../../site";

const T = "The user experience of the Frontend Cloud";
const row = (inner: string, align = "baseline") => `<div class="row" style="gap:32px;align-items:${align};justify-content:flex-start">${inner}</div>`;
// A band drawing: the band's width by 149, amber with diagonal lines (an illustration sits on the band's color).
const lines = `<svg slot="illustration" width="197" height="149" viewBox="0 0 197 149" aria-hidden="true"><rect width="197" height="149" fill="var(--ds-amber-600)"/>${Array.from({ length: 14 }, (_, i) => `<line x1="${-40 + i * 24}" y1="0" x2="${40 + i * 24}" y2="149" stroke="var(--ds-amber-900)" stroke-width="1"/>`).join("")}</svg>`;
// A mark below the title of a simple cover, in place of the default lenses.
const icon = `<svg slot="illustration" width="48" height="48" viewBox="0 0 48 48" aria-hidden="true"><path d="M24 6l18 34H6z" fill="var(--ds-blue-700)"/><circle cx="24" cy="30" r="6" fill="var(--ds-background-100)"/></svg>`;

export const doc: Doc = {
  id: "book",
  title: "Book",
  lede: "A responsive book cover with interruptible hover motion and a reduced-motion alternative.",
  tags: ["acme-book"],
  examples: [
    {
      h: "Default",
      html: `<acme-book heading="${T}"></acme-book>`,
    },
    {
      h: "Variants",
      html: row(`<acme-book heading="${T}" variant="simple" width="196px"></acme-book><acme-book heading="${T}" variant="stripe" width="196px"></acme-book>`),
    },
    {
      h: "Custom color",
      html: row(
        `<acme-book color="#9D2127" heading="How Vercel improves your website's search engine ranking"></acme-book><acme-book color="#7DC1C1" text-color="#0a0a0a" heading="Design Engineering at Vercel" variant="simple"></acme-book><acme-book color="#FED954" heading="${T}"></acme-book>`,
      ),
    },
    {
      h: "Custom icon",
      html: row(
        `<acme-book heading="Vercel Platform Guide"><svg class="ic" width="16" height="16" slot="start" aria-hidden="true"><use href="#brand-vercel"/></svg></acme-book><acme-book heading="Next.js Documentation"><svg class="ic" width="16" height="16" slot="start" aria-hidden="true"><use href="#brand-next"/></svg></acme-book><acme-book heading="React Essentials"><svg class="ic" width="16" height="16" slot="start" aria-hidden="true"><use href="#brand-react"/></svg></acme-book>`,
      ),
    },
    {
      h: "Custom illustration",
      html: row(`<acme-book heading="${T}">${lines}</acme-book><acme-book heading="${T}" variant="simple">${icon}</acme-book>`, "stretch"),
    },
    {
      h: "Responsive",
      html: `<acme-book heading="${T}" width='{"compact":"150px","medium":"196px"}'></acme-book>`,
    },
    {
      h: "Width",
      html: row(`<acme-book heading="${T}" width="300px"></acme-book><acme-book heading="${T}" width="200px"></acme-book><acme-book heading="${T}" width="150px"></acme-book>`),
    },
    {
      h: "Textured",
      html: `<div class="vstack" style="gap:48px">${row(
        `<acme-book color="#7DC1C1" textured heading="Design Engineering at Vercel"></acme-book><acme-book color="#9D2127" textured heading="Design Engineering at Vercel"></acme-book><acme-book color="#FED954" textured heading="Design Engineering at Vercel"></acme-book>`,
      )}${row(
        `<acme-book color="#7DC1C1" text-color="#0a0a0a" textured heading="Design Engineering at Vercel" variant="simple"></acme-book><acme-book color="#9D2127" text-color="#ece4db" textured heading="Design Engineering at Vercel" variant="simple"></acme-book><acme-book color="#FED954" text-color="#9d3b05" textured heading="Design Engineering at Vercel" variant="simple"></acme-book>`,
      )}</div>`,
    },
  ],
  practices: {
    "When to use": [
      "Marketing pages, docs landing covers and changelog hero shots, where the content wants the picture of a labeled volume.",
      "In-product cards and dashboard tiles use Card; a Book is too decorative for repeated rows.",
      "Choose simple when the title alone carries the cover, and stripe when an icon or a color stripe adds hierarchy or a category cue.",
    ],
    Behavior: [
      "Set color from a token (var(--ds-blue-700), var(--ds-amber-600)) rather than a raw hex, so the cover follows the light and dark themes.",
      "Keep textured for hero shots; in a row of several books the texture fights the labels.",
      "Pointer motion uses Lit Motion. Touch does not start hover motion, and reduced-motion preferences cancel interpolation.",
      "Use the shared responsive width contract, for example compact and medium values. Numeric values are size tokens; use a CSS unit for pixel widths.",
    ],
    Assets: [
      "Browser distributions include the texture asset. Standard URL-aware application bundlers resolve the package image from the component module.",
      "For a bundler with custom asset handling, import @acmelabs/design-system/assets/book-texture.avif as a file and set --acme-book-texture to its CSS url(...) value. The default asset remains packaged with the library.",
    ],
    Accessibility: [
      "The cover text is supplied through heading. The component is presentation, with no built-in action.",
      "An inner illustration needs alt text only when it says something the title does not; otherwise mark it aria-hidden.",
      "Wrap Book in Link when it needs an action. Keep the focus indicator on that real link.",
    ],
  },
};
