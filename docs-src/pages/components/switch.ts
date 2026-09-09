// Docs page: Switch — mirrors https://vercel.com/geist/switch
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "switch",
  title: "Switch",
  lede: "Choose between a set of two or three views of the same surface.",
  tags: ["acme-switch", "acme-switch-control"],
  examples: [
    {
      h: "Default",
      html: `<acme-switch value="source" aria-label="View"><acme-switch-control value="source">Source</acme-switch-control><acme-switch-control value="output">Output</acme-switch-control></acme-switch>`,
    },
    {
      h: "Disabled",
      html: `<acme-switch value="source" disabled aria-label="View"><acme-switch-control value="source">Source</acme-switch-control><acme-switch-control value="output">Output</acme-switch-control></acme-switch>`,
    },
    {
      h: "Sizes",
      html: `<div class="row" style="gap:16px"><acme-switch size="small" value="source" aria-label="View"><acme-switch-control value="source">Source</acme-switch-control><acme-switch-control value="output">Output</acme-switch-control></acme-switch><acme-switch value="source" aria-label="View"><acme-switch-control value="source">Source</acme-switch-control><acme-switch-control value="output">Output</acme-switch-control></acme-switch><acme-switch size="large" value="source" aria-label="View"><acme-switch-control value="source">Source</acme-switch-control><acme-switch-control value="output">Output</acme-switch-control></acme-switch></div>`,
    },
    {
      h: "Full width",
      html: `<acme-switch fill value="source" aria-label="View"><acme-switch-control value="source">Source</acme-switch-control><acme-switch-control value="output">Output</acme-switch-control></acme-switch>`,
    },
    {
      h: "Options as data",
      p: "The options attribute takes the same list as JSON.",
      html: `<acme-switch value="grid" aria-label="Layout" options='[{"value":"grid","label":"Grid"},{"value":"list","label":"List"},{"value":"map","label":"Map","disabled":true}]'></acme-switch>`,
    },
  ],
  practices: {
    "When to use": ["Two or three mutually exclusive views (Source / Output). Toggle for on/off; Tabs or Select past three options."],
    Content: ["Title Case, one or two parallel words; every control has a label, hidden when an icon carries it, with a tooltip."],
  },
};
