// Docs page: Error Card — mirrors https://vercel.com/geist/error-card
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "error-card",
  title: "Error Card",
  lede: "A card that communicates an error state with a title and a message.",
  tags: ["acme-error-card"],
  examples: [
    {
      h: "Default",
      html: `<acme-error-card title="No credits left">Add a payment method to keep deploying past the free allowance.</acme-error-card>`,
    },
  ],
};
