// Docs page: Table — mirrors https://vercel.com/geist/table
import type { Doc } from "../../site";

const cols3 = `columns='[{"key":"c1","label":"Col 1"},{"key":"c2","label":"Col 2"},{"key":"c3","label":"Col 3"}]'`;
const rows3 = `rows='[{"c1":"Value 1.1","c2":"Value 1.2","c3":"Value 1.3"},{"c1":"Value 2.1","c2":"Value 2.2","c3":"Value 2.3"},{"c1":"Value 3.1","c2":"Value 3.2","c3":"Value 3.3"}]'`;
const cols4 = `columns='[{"key":"product","label":"Product","width":"44%"},{"key":"usage","label":"Usage","width":"22%"},{"key":"price","label":"Price","width":"22%"},{"key":"charge","label":"Charge","width":"11%"}]'`;
const items = [
  { product: "Brake Pads Set", usage: "100 sets", price: "$50 per set", charge: 5000 },
  { product: "Oil Filters", usage: "200 filters", price: "$10 per filter", charge: 2000 },
  { product: "Car Batteries", usage: "50 batteries", price: "$100 per battery", charge: 5000 },
  { product: "Headlight Bulbs", usage: "300 bulbs", price: "$15 per bulb", charge: 4500 },
  { product: "Windshield Wipers", usage: "250 pairs", price: "$20 per pair", charge: 5000 },
  { product: "Spark Plugs", usage: "500 sets", price: "$5 per set", charge: 2500 },
];
const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "usd", maximumFractionDigits: 2 });
const rows6 = `rows='${JSON.stringify(items.map((i) => ({ ...i, charge: money.format(i.charge) })))}'`;
const subtotal = money.format(items.reduce((s, i) => s + i.charge, 0));

export const doc: Doc = {
  id: "table",
  title: "Table",
  lede: "A semantic HTML table component.",
  tags: ["acme-table"],
  examples: [
    { h: "Basic table", html: `<acme-table ${cols3} ${rows3}></acme-table>` },
    { h: "Striped table", html: `<acme-table striped ${cols3} ${rows3}></acme-table>` },
    { h: "Bordered table", html: `<acme-table bordered ${cols3} ${rows3}></acme-table>` },
    { h: "Interactive table", html: `<acme-table interactive ${cols3} ${rows3}></acme-table>` },
    {
      h: "Full featured table",
      html: `<acme-table interactive striped ${cols4} ${rows6} footer='[{"text":"Subtotal","colspan":3},{"text":"${subtotal}"}]'></acme-table>`,
    },
    {
      h: "Virtualized table",
      html: `<div style="position:relative"><acme-table interactive striped virtualize ${cols4} rows="[]"></acme-table><div data-fade style="position:absolute;left:0;bottom:0;width:100%;height:30%;border-radius:6px;background:linear-gradient(to top,var(--ds-background-100),transparent);opacity:.8;pointer-events:none"></div></div><acme-show-more no-border style="margin-top:16px"></acme-show-more>`,
      script: `const items = ${JSON.stringify(items)};
const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "usd", maximumFractionDigits: 2 });
const all = Array.from({ length: 5000 }, (_, i) => ({ ...items[i % items.length], charge: money.format(items[i % items.length].charge) }));
const table = root.querySelector("acme-table"), more = root.querySelector("acme-show-more"), fade = root.querySelector("[data-fade]");
const apply = () => { table.rows = more.expanded ? all : all.slice(0, 9); fade.hidden = more.expanded; };
// Show More is controlled, as the reference's is: it bubbles a click and the owner sets expanded.
more.addEventListener("click", () => { more.expanded = !more.expanded; apply(); });
apply();`,
    },
  ],
  practices: {
    "When to use": [
      "Use a Table for rows that share one shape, where at least one column can be sorted or compared across rows.",
      "A row of descriptive content with a single action (a member, an integration) is an Entity.",
      "A key/value block on a detail page is a Description, not a two-column table.",
    ],
    Behavior: [
      "When the list is empty (filter cleared, nothing created yet), show an Empty State outside the table instead of an empty body.",
      "Render — in a cell whose value is unknown or does not apply. Never N/A, null or an empty string.",
      "A sortable header is a button. Its label stays Title Case; the arrow is decorative and the button announces the next sort state.",
      "Give numeric columns tabular numerals (or the mono face) so digits line up for comparison.",
    ],
    Content: [
      "Column headers are Title Case nouns or noun phrases: Last Used, Requests (7d), Created, Status. Never sentences.",
      "Cells use the short relative time (2m ago, 5h ago) and switch to Mar 14, 2026 past seven days. See Relative Time Card.",
      "Pagination labels are Previous and Next. Page copy reads Page 2 of 7 or 21–40 of 142, with an en dash inside the range.",
    ],
  },
};
