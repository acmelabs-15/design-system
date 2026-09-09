// Docs page: Radio — mirrors https://vercel.com/geist/radio
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "radio",
  title: "Radio",
  lede: "Single user input from a selection of options.",
  tags: ["acme-radio"],
  examples: [
    {
      h: "Default",
      html: `<div class="row" style="gap:24px"><acme-radio name="r1" value="1" checked>Option 1</acme-radio><acme-radio name="r1" value="2">Option 2</acme-radio></div>`,
    },
    {
      h: "Disabled",
      html: `<div class="row" style="gap:24px"><acme-radio name="r2" checked disabled>Option 1</acme-radio><acme-radio name="r2" disabled>Option 2</acme-radio></div>`,
    },
    {
      h: "Group",
      html: `<fieldset style="border:0;padding:0;margin:0"><legend class="text-label-14" style="font-weight:500">Billing Cycle</legend><div class="vstack" style="gap:8px;margin-top:8px"><acme-radio name="r3" value="monthly" checked>Monthly</acme-radio><acme-radio name="r3" value="yearly">Yearly</acme-radio></div></fieldset>`,
    },
  ],
  practices: {
    "When to use": ["Two to six mutually exclusive options where seeing every option matters. Past six, Select or Combobox; binary, Toggle; rich options, Choicebox."],
    Content: ["Group label is a Title Case noun in a legend; option labels stay parallel (Monthly / Yearly); a disabled option gets a tooltip naming why."],
  },
};
