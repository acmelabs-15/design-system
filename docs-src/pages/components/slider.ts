// Docs page: Slider — mirrors https://vercel.com/geist/slider
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "slider",
  title: "Slider",
  lede: "Select a value from a range.",
  tags: ["acme-slider"],
  examples: [
    {
      h: "Default",
      html: `<acme-slider value="50" aria-label="Volume"></acme-slider>`,
    },
    {
      h: "With label",
      html: `<acme-slider label="Volume" value="40"></acme-slider>`,
    },
    {
      h: "Disabled",
      html: `<acme-slider value="25" disabled aria-label="Volume"></acme-slider>`,
    },
  ],
  practices: {
    "When to use": [
      "Ranged numeric input where shape matters more than precision. Pair with a numeric Input for exact values; snap to a sensible step; show the live value in tabular numbers with its unit.",
    ],
  },
};
