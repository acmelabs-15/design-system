// Docs page: Select — mirrors https://vercel.com/geist/select
import type { Doc } from "../../site";

const three = `<option>Option 1</option><option>Option 2</option><option>Option 3</option>`;
const fruit = `<option value="apple">Apple</option><option value="orange">Orange</option><option value="banana">Banana</option><option value="grape">Grape</option>`;
// A bare sprite icon (no utility class): the cell takes it as it is, at its own 16px.
const up = (slot: string) =>
  `<svg slot="${slot}" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" style="color:currentColor" aria-hidden="true"><use href="#i-arrow-circle-up"/></svg>`;
// Three fields side by side, each at the top of its own column, as wide as its content.
const col = (inner: string) => `<div style="display:flex;flex-direction:column;align-items:flex-start;flex:1;min-width:1px;max-width:100%">${inner}</div>`;
const row = (cols: string[]) => `<div class="row" style="flex-wrap:wrap;gap:0;align-items:stretch">${cols.map(col).join("")}</div>`;

export const doc: Doc = {
  id: "select",
  title: "Select",
  lede: "Display a dropdown list of items.",
  tags: ["acme-select"],
  examples: [
    {
      h: "Sizes",
      html: row([
        `<acme-select aria-label="Small" placeholder="Small" size="small">${three}</acme-select>`,
        `<acme-select aria-label="Default" placeholder="Default">${three}</acme-select>`,
        `<acme-select aria-label="Large" placeholder="Large" size="large">${three}</acme-select>`,
      ]),
    },
    {
      h: "Start and end",
      p: "Both places sit inside the field. A select has no add-on places, as the reference has none.",
      html: row([
        `<acme-select aria-label="Small" placeholder="Small" size="small">${up("start")}${up("end")}</acme-select>`,
        `<acme-select aria-label="Default" placeholder="Default">${up("start")}${up("end")}</acme-select>`,
        `<acme-select aria-label="Large" placeholder="Large" size="large">${up("start")}${up("end")}</acme-select>`,
      ]),
    },
    {
      h: "Disabled",
      html: `<acme-select aria-label="Disabled" disabled placeholder="Disabled with placeholder"></acme-select>`,
    },
    {
      h: "Error",
      html: row([
        `<acme-select aria-label="Small with error" error="Please select a value." placeholder="Small" size="small"></acme-select>`,
        `<acme-select aria-label="Default with error" error="Please select a value." placeholder="Default"></acme-select>`,
        `<acme-select aria-label="Large with error" error="Please select a value." placeholder="Large" size="large"></acme-select>`,
      ]),
    },
    {
      h: "Label",
      html: `<acme-select label="My label" placeholder="With label"></acme-select>`,
    },
    {
      h: "With options",
      html: `<div class="row" style="gap:16px;align-items:flex-start"><div><acme-select aria-label="Fruit" placeholder="Select a fruit">${fruit}</acme-select></div><div><acme-select aria-label="Fruit with default value" value="banana" placeholder="With default value">${fruit}</acme-select></div></div>`,
    },
    {
      h: "Required",
      html: `<acme-select label="Required field" placeholder="Please select an option" required><option value="option1">Option 1</option><option value="option2">Option 2</option><option value="option3">Option 3</option></acme-select>`,
    },
    {
      h: "Secondary",
      census: true,
      p: "No ring, gray text, the field shifted left: a select that reads as a plain control in a toolbar.",
      html: `<acme-select aria-label="Secondary" placeholder="Secondary" variant="secondary"></acme-select>`,
    },
    {
      h: "Secondary disabled",
      census: true,
      html: `<acme-select aria-label="Secondary disabled" disabled placeholder="Secondary disabled" variant="secondary"></acme-select>`,
    },
    {
      h: "Disabled with a start place",
      census: true,
      html: `<acme-select aria-label="Disabled" disabled placeholder="Disabled with a start place">${up("start")}</acme-select>`,
    },
    {
      h: "Placeholder selected",
      census: true,
      p: "A value equal to the placeholder shows the placeholder as the value, in gray.",
      html: `<acme-select aria-label="Fruit" placeholder="Select a fruit" value="Select a fruit">${fruit}</acme-select>`,
    },
    {
      h: "Empty end place",
      census: true,
      p: '<code>end="false"</code> leaves the end place empty, dropping the chevron; the field keeps its right padding.',
      html: `<acme-select aria-label="Empty end place" placeholder="Empty end place" end="false"></acme-select>`,
    },
    {
      h: "Label without casing",
      census: true,
      p: "<code>bypass-casing</code> keeps the label text as written.",
      html: `<acme-select bypass-casing label="My label" placeholder="Without casing"></acme-select>`,
    },
  ],
  practices: {
    "Best Practices": [
      "Use a Select for a short fixed list, under about ten items, where typing adds nothing. Move to Combobox once filtering helps.",
      "Use Multi Select when more than one value can be picked. Use Switch for a segmented choice of two or three options.",
      "Group a list longer than about ten items with native <code>optgroup</code>; there is no group element of its own.",
      "Write short options in Title Case and keep brand names canonical (<code>Next.js</code>, not <code>NextJS</code>). Keep one register across the list.",
      "The label is a short Title Case noun (<code>Framework</code>, <code>Region</code>), passed with the <code>label</code> attribute.",
      "The placeholder names the action (<code>Select a framework</code>). Do not restate the label, and avoid <code>Choose one…</code> or <code>Pick</code>.",
      "Validate on blur and pass the message in <code>error</code>. The message names the field and ends with a period (<code>Select a framework.</code>).",
      "Keep a labelled Select out of a Tooltip. Put the hint on a sibling icon button so the label is still announced.",
    ],
  },
};
