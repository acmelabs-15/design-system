// Docs page: Chip (house component)
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "chip",
  title: "Chip",
  lede: "A pressable filter pill; pressed fills solid. Tags are the static small gray keywords.",
  tags: ["acme-chip", "acme-tag", "acme-tags"],
  house: true,
  examples: [
    {
      h: "Chips",
      html: `<div class="row" style="gap:8px"><acme-chip pressed>All</acme-chip><acme-chip>Production</acme-chip><acme-chip>Preview</acme-chip><acme-chip disabled>Archived</acme-chip></div>`,
    },
    {
      h: "Tags",
      html: `<acme-tags><acme-tag>next.js</acme-tag><acme-tag>edge</acme-tag><acme-tag>iad1</acme-tag></acme-tags>`,
    },
  ],
};
