// Docs page: Checkbox — mirrors https://vercel.com/geist/checkbox
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "checkbox",
  title: "Checkbox",
  lede: "A control that toggles between checked and unchecked, alone or in a list.",
  tags: ["acme-checkbox"],
  examples: [
    {
      h: "Default",
      html: `<div class="row" style="gap:24px"><acme-checkbox>Default</acme-checkbox><acme-checkbox checked>Checked</acme-checkbox><acme-checkbox indeterminate>Indeterminate</acme-checkbox></div>`,
    },
    {
      h: "Disabled",
      html: `<div class="row" style="gap:24px"><acme-checkbox disabled>Disabled</acme-checkbox><acme-checkbox checked disabled>Disabled checked</acme-checkbox></div>`,
    },
    {
      h: "Group",
      p: "A fieldset with a Title Case legend and no colon.",
      html: `<fieldset style="border:0;padding:0;margin:0"><legend class="text-label-14" style="font-weight:500">Notify On</legend><div class="vstack" style="gap:8px;margin-top:8px"><acme-checkbox checked>Failed deployments</acme-checkbox><acme-checkbox>Successful deployments</acme-checkbox><acme-checkbox>Domain expiry</acme-checkbox></div></fieldset>`,
    },
  ],
  practices: {
    "When to use": ["Multi-select in lists and acknowledgments. A single boolean setting is a Toggle.", "Indeterminate is a visual state driven by a parent, not a third value."],
    Content: ["An acknowledgment label is a full sentence with a period.", 'A row-select box carries aria-label="Select {row name}".'],
  },
};
