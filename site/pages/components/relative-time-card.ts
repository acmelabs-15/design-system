// Docs page: Relative Time Card — mirrors https://vercel.com/geist/relative-time-card
import type { Doc } from "../../site";

/** A fixed moment for the census examples, so both sides read one date: 2026-09-09T08:15:30Z. */
const MOMENT = Date.UTC(2026, 8, 9, 8, 15, 30);
const cell = (inner: string) => `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;flex:0 1 auto">${inner}</div>`;
const sides = ["top", "bottom", "left", "right"].map((side) => cell(`<acme-relative-time date="${MOMENT}" side="${side}"><acme-button>Hover Me</acme-button></acme-relative-time>`));

export const doc: Doc = {
  id: "relative-time-card",
  title: "Relative Time Card",
  lede: "Popover to show a given date in local time.",
  tags: ["acme-relative-time"],
  examples: [
    {
      h: "Default",
      html: `<acme-relative-time side="top"><acme-button>Hover Me</acme-button></acme-relative-time>`,
      script: `root.querySelector("acme-relative-time").date = Date.now();`,
    },
    {
      h: "Open",
      census: true,
      p: "The card open on each side of a button trigger: the full age in tabular figures over the UTC row and the local row, each a zone chip beside the date with the clock time at the row's end.",
      html: `<div style="display:flex;flex-direction:row;align-items:stretch;justify-content:space-around;flex:0 1 auto">${sides.join("")}</div>`,
    },
    {
      h: "Plain",
      census: true,
      p: "With nothing slotted the element draws the short age itself, a 14px label in gray-900.",
      html: `<acme-relative-time date="${MOMENT}"></acme-relative-time>`,
    },
  ],
  practices: {
    "Best Practices": [
      "Use it wherever a recent timestamp appears in a scannable surface: Table cells, Entity rows, deploy lists, activity feeds. A static date older than seven days in body prose renders as <code>Mar 14, 2026</code> directly.",
      "<code>date</code> is a number: epoch milliseconds. Do not pre-format it, and do not replace the trigger with a formatted string. The element's short age (<code>2 minutes ago</code>, <code>5 hours ago</code>, <code>3 days ago</code>) is the canonical form.",
      "No <code>ago</code> after the element. The short age already reads <code>2 minutes ago</code>, so an extra word gives <code>2 minutes ago ago</code>.",
      "Slotted content is for labels that are not times (<code>Just now</code>, <code>Pending</code>, <code>Queued</code>), where the formatter cannot describe the state.",
      "Add a leading label when the row is ambiguous on its own: <code>Last deploy</code> followed by the element. The card already shows absolute UTC and local time, so that copy does not repeat elsewhere on the row.",
    ],
  },
};
