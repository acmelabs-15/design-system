import type { Doc } from "../../site";

export const doc: Doc = {
  id: "quote",
  title: "Quote",
  tags: ["acme-quote"],
  lede: "Use native inline or block quotation semantics with optional citation metadata.",
  examples: [
    { h: "Inline quotation", html: "<p>The guide says <acme-quote>keep one name for each concept</acme-quote>.</p>" },
    {
      h: "Block quotation",
      html: '<acme-quote as="blockquote" cite="https://example.com/source">A quotation can occupy its own block.</acme-quote><p>Visible attribution is authored separately.</p>',
    },
  ],
  practices: { "Attribute explicitly": ["cite is native URL metadata. It does not create visible attribution or a navigation control."] },
};
