// Docs page: Toggle — mirrors https://vercel.com/geist/toggle
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "toggle",
  title: "Toggle",
  lede: "Display a boolean value.",
  tags: ["acme-toggle"],
  examples: [
    {
      h: "Default",
      html: `<div class="row" style="gap:24px"><acme-toggle aria-label="Off"></acme-toggle><acme-toggle checked aria-label="On"></acme-toggle></div>`,
    },
    {
      h: "Disabled",
      html: `<div class="row" style="gap:24px"><acme-toggle disabled aria-label="Off"></acme-toggle><acme-toggle checked disabled aria-label="On"></acme-toggle></div>`,
    },
    {
      h: "Sizes",
      html: `<div class="row" style="gap:24px"><acme-toggle aria-label="Small"></acme-toggle><acme-toggle size="medium" aria-label="Medium"></acme-toggle><acme-toggle size="large" aria-label="Large"></acme-toggle></div>`,
    },
    {
      h: "Custom color",
      html: `<div class="row" style="gap:24px"><acme-toggle color="amber" checked aria-label="Amber"></acme-toggle><acme-toggle color="red" checked aria-label="Red"></acme-toggle></div>`,
    },
    {
      h: "With label",
      html: `<div class="row" style="gap:24px"><acme-toggle label="Enable Firewall"></acme-toggle><acme-toggle size="large" label="Enable Firewall" checked></acme-toggle></div>`,
    },
  ],
  practices: {
    "When to use": ["One boolean setting where ON takes effect immediately (Password Protection). Checkbox for a multi-select list, Switch for 2–3 views."],
    Behavior: ["Persist on change and confirm with a toast; disable only when the action is impossible and say why."],
    Content: ["A Title Case noun phrase naming what is true when ON: Password Protection, not Enable Password Protection; a description explains ON only."],
  },
};
