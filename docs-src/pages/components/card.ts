// Docs page: Card (house component)
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "card",
  title: "Card",
  lede: "The block that must read as its own object: a bordered surface with a 6px radius.",
  tags: ["acme-card"],
  house: true,
  examples: [
    {
      h: "Variants",
      html: `<div class="row" style="gap:16px;align-items:stretch"><acme-card style="padding:16px;width:200px">Default</acme-card><acme-card variant="raised" style="padding:16px;width:200px">Raised</acme-card><acme-card variant="flat" style="padding:16px;width:200px">Flat</acme-card><acme-card variant="feature" style="padding:16px;width:200px">Feature</acme-card></div>`,
    },
  ],
};
