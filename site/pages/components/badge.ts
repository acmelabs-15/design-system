// Docs page: Badge — mirrors https://vercel.com/geist/badge
import type { Doc } from "../../site";

const hues = ["gray", "blue", "purple", "amber", "red", "pink", "green", "teal"];
const shield = `<svg class="ic" width="16" height="16" slot="icon" aria-hidden="true"><use href="#i-shield"/></svg>`;
const variantRows = hues.map((h) => `<div class="row" style="gap:4px"><acme-badge variant="${h}">${h}</acme-badge><acme-badge variant="${h}" contrast="low">${h}-subtle</acme-badge></div>`).join("");
const iconRows = hues
  .map(
    (h) =>
      `<div class="row" style="gap:4px">${["lg", "md", "sm"].map((s) => `<acme-badge size="${s}" variant="${h}">${shield}${h}</acme-badge>`).join("")}${["sm", "md", "lg"].map((s) => `<acme-badge size="${s}" variant="${h}" contrast="low">${shield}${h}</acme-badge>`).join("")}</div>`,
  )
  .join("");
const slack = `<svg class="ic" width="16" height="16" slot="icon" aria-hidden="true"><use href="#i-slack"/></svg>`;

export const doc: Doc = {
  id: "badge",
  title: "Badge",
  lede: "A label that marks an element that needs attention, or that sorts it with similar elements.",
  tags: ["acme-badge", "acme-pill"],
  examples: [
    {
      h: "Variants",
      html: `<div class="vstack" style="gap:8px">${variantRows}<div class="row" style="gap:4px"><acme-badge variant="inverted">inverted</acme-badge><acme-badge variant="trial">Trial</acme-badge><acme-badge variant="turbo">Turborepo</acme-badge></div></div>`,
    },
    {
      h: "Sizes",
      html: `<div class="row" style="gap:8px"><acme-badge size="sm">Small</acme-badge><acme-badge size="md">Medium</acme-badge><acme-badge size="lg">Large</acme-badge></div>`,
    },
    {
      h: "With icons",
      html: `<div class="vstack" style="gap:8px">${iconRows}<div class="row" style="gap:4px"><acme-badge size="lg" variant="inverted">${shield}inverted</acme-badge><acme-badge size="md" variant="inverted">${shield}inverted</acme-badge><acme-badge size="sm" variant="inverted">${shield}inverted</acme-badge></div></div>`,
    },
    {
      h: "Pill",
      p: "A special link. It is less prominent than a button and takes the badge shape.",
      html: `<div class="vstack" style="gap:16px"><div class="row" style="gap:8px"><acme-pill href="#badge#pill" size="sm">Label</acme-pill><acme-pill href="#badge#pill" size="md">Label</acme-pill><acme-pill href="#badge#pill" size="lg">Label</acme-pill></div><div class="row" style="gap:8px"><acme-pill href="#badge#pill" size="sm">${slack}Label</acme-pill><acme-pill href="#badge#pill" size="md">${slack}Label</acme-pill><acme-pill href="#badge#pill" size="lg">${slack}Label</acme-pill></div></div>`,
    },
  ],
  practices: {
    "Best Practices": [
      "A badge is short metadata next to the thing it describes: status, plan tier, environment or role. One badge per row; two side by side means the row needs a second column.",
      "A colored dot with no text is a Status Dot. A clickable filter chip that changes a query is the pill or a small Button.",
      "A badge is static. Do not attach a click handler; use a Button or a link when the user can act on the value.",
      "Badge content is text, or an icon plus text. Never two icons, and never a badge inside a badge.",
      'Pair a lifecycle badge (Alpha, Beta, Early Access) with a Tooltip that names the limit, such as "Alpha: API may change before GA".',
      "Title Case, one word when possible and two at most: Active, Pending, Pro, Enterprise Trial. Use the API or log term: Production not Prod, Deployed not Live, Canceled not Cancelled.",
      "No checkmark for success and no X for errors; the variant carries the signal. Green is healthy, red is error, amber is warning, blue is informational or production, gray is neutral. The subtle contrast tones any of them down on dense surfaces.",
      "No sentences inside a badge (Currently Active, You are on Pro); the row around it gives the context.",
      "Set a title on icon-only or ambiguous badges so screen readers announce the meaning. The text must read without the color.",
    ],
  },
};
