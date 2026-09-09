// Docs page: Badge — mirrors https://vercel.com/geist/badge
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "badge",
  title: "Badge",
  lede: "A short scannable label beside the thing it describes.",
  tags: ["acme-badge", "acme-pill"],
  examples: [
    {
      h: "Size",
      p: "small 20, medium 24, large 32; the text is capitalized.",
      html: `<div class="row"><acme-badge size="small">Small</acme-badge><acme-badge>Medium</acme-badge><acme-badge size="large">Large</acme-badge></div>`,
    },
    {
      h: "Variant",
      p: "Solid fills with the 900 step and white text; amber is amber-700 with black text; inverted is gray-1000.",
      html: `<div class="row" style="gap:8px"><acme-badge>Gray</acme-badge><acme-badge hue="blue">Blue</acme-badge><acme-badge hue="purple">Purple</acme-badge><acme-badge hue="amber">Amber</acme-badge><acme-badge hue="red">Red</acme-badge><acme-badge hue="pink">Pink</acme-badge><acme-badge hue="green">Green</acme-badge><acme-badge hue="teal">Teal</acme-badge><acme-badge inverted>Inverted</acme-badge></div>`,
    },
    {
      h: "Subtle",
      p: "Low contrast keeps the hue for the text on the hue's 100 background.",
      html: `<div class="row" style="gap:8px"><acme-badge subtle>Gray</acme-badge><acme-badge hue="blue" subtle>Blue</acme-badge><acme-badge hue="purple" subtle>Purple</acme-badge><acme-badge hue="amber" subtle>Amber</acme-badge><acme-badge hue="red" subtle>Red</acme-badge><acme-badge hue="pink" subtle>Pink</acme-badge><acme-badge hue="green" subtle>Green</acme-badge><acme-badge hue="teal" subtle>Teal</acme-badge></div>`,
    },
    {
      h: "Icon",
      p: "12, 14 or 16px by size, in the icon slot before the text.",
      html: `<div class="row"><acme-badge size="small" hue="green"><svg class="ic" slot="icon" aria-hidden="true"><use href="#i-check"/></svg>Ready</acme-badge><acme-badge hue="blue"><svg class="ic" slot="icon" aria-hidden="true"><use href="#i-rocket"/></svg>Production</acme-badge><acme-badge size="large" hue="red"><svg class="ic" slot="icon" aria-hidden="true"><use href="#i-alert"/></svg>Error</acme-badge></div>`,
    },
    {
      h: "Pill",
      p: "The badge shape as a link: white with an inset ring, in the same three sizes.",
      html: `<div class="row"><acme-pill size="small" href="#"><svg class="ic" slot="icon" aria-hidden="true"><use href="#i-github"/></svg>Repository</acme-pill><acme-pill href="#"><svg class="ic" slot="icon" aria-hidden="true"><use href="#i-branch"/></svg>main</acme-pill><acme-pill size="large" href="#"><svg class="ic" slot="icon" aria-hidden="true"><use href="#i-commit"/></svg>4rxecep</acme-pill></div>`,
    },
  ],
  practices: {
    "When to use": [
      "One badge per row; a badge is static and never carries a click handler.",
      "Green healthy, red error, amber warning, blue informational or production, gray neutral; the color carries the state, so no check or X icons.",
    ],
    Content: ["Title Case, one or two words.", "Subtle on dense surfaces; a title attribute on an ambiguous badge."],
  },
};
