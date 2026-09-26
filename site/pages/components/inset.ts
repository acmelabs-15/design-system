import type { Doc } from "../../site";

export const doc: Doc = {
  id: "inset",
  title: "Inset",
  tags: ["acme-inset"],
  lede: "Extend media through the nearest surface padding with logical edges and matching corners.",
  examples: [
    {
      h: "Top media",
      html: '<acme-card variant="outline"><acme-card-body><acme-inset side="block-start"><div style="height:120px;background:var(--ds-blue-300)"></div></acme-inset><acme-text style="margin-top:16px">The block-start edge includes both inline edges.</acme-text></acme-card-body></acme-card>',
    },
    {
      h: "Inline edges",
      html: '<acme-card><acme-card-body><acme-inset side="inline"><div style="padding:16px;background:var(--ds-gray-100)">Full-width supporting content</div></acme-inset></acme-card-body></acme-card>',
    },
    {
      h: "Interactive content",
      html: '<acme-card variant="outline"><acme-card-body><acme-inset side="inline" clip="false" padding="2"><acme-button variant="secondary">Focus remains visible</acme-button></acme-inset></acme-card-body></acme-card>',
    },
    { h: "Outside a surface", html: "<acme-inset><acme-text>No surrounding surface means no negative inset.</acme-text></acme-inset>" },
  ],
  practices: {
    Edges: [
      "Use all, inline or block for both edges of an axis. Use inline-start, inline-end, block-start or block-end for one edge plus both edges of the perpendicular axis.",
      "Logical edges follow writing direction. There are no separate physical left/right aliases.",
      "Card regions supply the padding and radius. Nested Cards reset the surrounding context; Inset outside a participating surface has zero bleed.",
      "Clipping defaults to true for media. Use clip=false and sufficient padding for interactive content whose focus outline must extend beyond its box.",
      "Shared layout inputs apply to Inset's real outer box. An explicitly supplied margin overrides the corresponding computed bleed.",
    ],
  },
};
