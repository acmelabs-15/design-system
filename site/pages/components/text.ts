import type { Doc } from "../../site";

export const doc: Doc = {
  id: "text",
  title: "Text",
  tags: ["acme-text"],
  lede: "Body text with native paragraph, inline or block semantics and responsive typography.",
  examples: [
    { h: "Paragraph", html: "<acme-text>A paragraph uses the body role and keeps author-owned inline content.</acme-text>" },
    { h: "Inline", html: '<p>Text can include <acme-text as="span" weight="600">an important phrase</acme-text> without changing the surrounding flow.</p>' },
    { h: "Responsive size", html: '<acme-text size=\'{"compact":"14px","expanded":"20px"}\'>The visual size follows the selected query.</acme-text>' },
    {
      h: "Line clamp",
      html: '<acme-text line-clamp="2" style="max-width:18rem">This longer paragraph remains complete for accessibility and selection while its visual presentation is limited to two lines. The component does not replace or shorten its text.</acme-text>',
    },
  ],
  practices: {
    "Keep meaning separate from appearance": [
      "The default native tag is p. Use span for phrasing content or div for an ordinary text block.",
      "size is a CSS font-size string, not a spacing token. Omitted CSS inputs read undefined.",
      "A positive lineClamp takes precedence over truncate. Both preserve the full content.",
    ],
  },
};
