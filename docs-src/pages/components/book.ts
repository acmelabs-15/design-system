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
  lede: "A responsive book cover.",
  tags: ["acme-book"],
  examples: [
    {
      h: "Default",
      html: `<acme-book title="${T}"></acme-book>`,
    },
    {
      h: "Variants",
      html: row(`<acme-book title="${T}" variant="simple" width="196"></acme-book><acme-book title="${T}" variant="stripe" width="196"></acme-book>`),
    },
    {
      h: "Custom color",
      html: row(
        `<acme-book color="#9D2127" title="How Vercel improves your website's search engine ranking"></acme-book><acme-book color="#7DC1C1" text-color="white" title="Design Engineering at Vercel" variant="simple"></acme-book><acme-book color="#FED954" title="${T}"></acme-book>`,
      ),
    },
    {
      h: "Custom icon",
      html: row(
        `<acme-book title="Vercel Platform Guide"><svg class="ic" width="16" height="16" slot="icon" aria-hidden="true"><use href="#i-vercel"/></svg></acme-book><acme-book title="Next.js Documentation"><svg class="ic" width="16" height="16" slot="icon" aria-hidden="true"><use href="#i-next"/></svg></acme-book><acme-book title="React Essentials"><svg class="ic" width="16" height="16" slot="icon" aria-hidden="true"><use href="#i-react"/></svg></acme-book>`,
      ),
    },
    {
      h: "Custom illustration",
      html: row(`<acme-book title="${T}">${lines}</acme-book><acme-book title="${T}" variant="simple">${icon}</acme-book>`, "stretch"),
    },
    {
      h: "Responsive",
      html: `<acme-book title="${T}" width='{"sm":150,"md":196}'></acme-book>`,
    },
    {
      h: "Width",
      html: row(`<acme-book title="${T}" width="300"></acme-book><acme-book title="${T}" width="200"></acme-book><acme-book title="${T}" width="150"></acme-book>`),
    },
    {
      h: "Textured",
      html: `<div class="vstack" style="gap:48px">${row(
        `<acme-book color="#7DC1C1" textured title="Design Engineering at Vercel"></acme-book><acme-book color="#9D2127" textured title="Design Engineering at Vercel"></acme-book><acme-book color="#FED954" textured title="Design Engineering at Vercel"></acme-book>`,
      )}${row(
        `<acme-book color="#7DC1C1" text-color="white" textured title="Design Engineering at Vercel" variant="simple"></acme-book><acme-book color="#9D2127" text-color="#ece4db" textured title="Design Engineering at Vercel" variant="simple"></acme-book><acme-book color="#FED954" text-color="#9d3b05" textured title="Design Engineering at Vercel" variant="simple"></acme-book>`,
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
      "Use width and width-sm to keep covers in proportion across breakpoints; a squashed aspect ratio breaks the metaphor.",
    ],
    Accessibility: [
      "The cover is decorative chrome; the title lives in the heading element, so screen readers do not announce it twice.",
      "An inner illustration needs alt text only when it says something the title does not; otherwise mark it aria-hidden.",
      "When the book wraps a link, put the focus ring on the link, not on the cover, so keyboard users see the real target.",
    ],
  },
};
