// Docs page: Multi Select — mirrors https://vercel.com/geist/multi-select
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "multi-select",
  title: "Multi Select",
  lede: "A keyboard-navigable dropdown for selecting several items.",
  tags: ["acme-multi-select"],
  examples: [
    {
      h: "Default",
      p: "The trigger reads the count; each row has a checkbox and a button whose action label appears on hover or focus.",
      html: `<acme-multi-select static options='[{"value":"ds","label":"Design System"},{"value":"c","label":"Components"},{"value":"t","label":"Design Tokens"}]' value='["ds","c"]' noun="categories"></acme-multi-select>`,
    },
    {
      h: "Single selection",
      html: `<acme-multi-select options='[{"value":"a","label":"analytics"},{"value":"b","label":"billing"}]' value='["a"]'></acme-multi-select>`,
    },
  ],
  practices: {
    "When to use": ["More than one value from a known list (regions, scopes, tags); Select for one value, Combobox when filtering matters, Toggle for a boolean."],
    Behavior: ["Up and Down move rows, Left and Right move between the checkbox and the button; the trigger shows the count, or the single name."],
  },
};
