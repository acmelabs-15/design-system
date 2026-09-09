// Docs page: Phone — mirrors https://vercel.com/geist/phone
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "phone",
  title: "Phone",
  lede: "A realistic phone frame for screenshots and recordings.",
  tags: ["acme-phone"],
  examples: [
    {
      h: "Composition",
      html: `<acme-phone address="vercel.com"></acme-phone>`,
    },
  ],
  practices: {
    "When to use": ["Marketing chrome around a mobile screenshot; decorative and aria-hidden; the inner image carries the alt text and a real device ratio."],
  },
};
