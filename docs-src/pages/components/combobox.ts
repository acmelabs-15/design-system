// Docs page: Combobox — mirrors https://vercel.com/geist/combobox
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "combobox",
  title: "Combobox",
  lede: "Filters a large list to selectable options based on the matching query.",
  tags: ["acme-combobox"],
  examples: [
    {
      h: "Default",
      p: "Focus opens the list; typing filters it; Enter picks the active option.",
      html: `<acme-combobox options='["One","Two","Three"]' placeholder="Search…" style="display:block;max-width:420px"></acme-combobox>`,
    },
    {
      h: "With a value",
      html: `<acme-combobox options='["One","Two","Three"]' value="Two" style="display:block;max-width:420px"></acme-combobox>`,
    },
    {
      h: "Sizes and states",
      html: `<div class="vstack" style="max-width:420px"><acme-combobox size="small" placeholder="Small" options='["One","Two"]'></acme-combobox><acme-combobox size="large" placeholder="Large" options='["One","Two"]'></acme-combobox><acme-combobox placeholder="Disabled" disabled></acme-combobox><acme-combobox value="us-west-9" error="No such region." options='["us-east-1","us-west-2"]' noun="regions"></acme-combobox></div>`,
    },
  ],
  practices: {
    "When to use": ["A known list the user filters by typing. Select for a short fixed list, Multi Select for several values, Search for free text."],
    Content: ["The placeholder names the scope (Search regions), never bare Search…; the empty state reads No {items} match “{query}”."],
  },
};
