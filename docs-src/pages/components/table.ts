// Docs page: Table — mirrors https://vercel.com/geist/table
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "table",
  title: "Table",
  lede: "A semantic HTML table, or a virtualized grid past a few hundred rows.",
  tags: ["acme-table"],
  examples: [
    {
      h: "Basic",
      p: "Columns and rows as data.",
      html: `<acme-table columns='[{"key":"c1","label":"Col 1"},{"key":"c2","label":"Col 2"},{"key":"c3","label":"Col 3"}]' rows='[{"c1":"Value 1.1","c2":"Value 1.2","c3":"Value 1.3"},{"c1":"Value 2.1","c2":"Value 2.2","c3":"Value 2.3"},{"c1":"Value 3.1","c2":"Value 3.2","c3":"Value 3.3"}]'></acme-table>`,
    },
    {
      h: "Striped",
      html: `<acme-table striped columns='[{"key":"c1","label":"Col 1"},{"key":"c2","label":"Col 2"},{"key":"c3","label":"Col 3"}]' rows='[{"c1":"Value 1.1","c2":"Value 1.2","c3":"Value 1.3"},{"c1":"Value 2.1","c2":"Value 2.2","c3":"Value 2.3"},{"c1":"Value 3.1","c2":"Value 3.2","c3":"Value 3.3"}]'></acme-table>`,
    },
    {
      h: "Bordered",
      html: `<acme-table bordered columns='[{"key":"c1","label":"Col 1"},{"key":"c2","label":"Col 2"},{"key":"c3","label":"Col 3"}]' rows='[{"c1":"Value 1.1","c2":"Value 1.2","c3":"Value 1.3"},{"c1":"Value 2.1","c2":"Value 2.2","c3":"Value 2.3"},{"c1":"Value 3.1","c2":"Value 3.2","c3":"Value 3.3"}]'></acme-table>`,
    },
    {
      h: "Full featured",
      p: "Sortable and numeric columns, an interactive row, a footer slot.",
      html: `<acme-table striped interactive sort="product" columns='[{"key":"product","label":"Product","sortable":true},{"key":"usage","label":"Usage"},{"key":"rate","label":"Rate"},{"key":"charge","label":"Charge","numeric":true,"sortable":true}]' rows='[{"product":"Brake Pads Set","usage":"100 sets","rate":"$50.00","charge":"$5,000.00"},{"product":"Spark Plugs","usage":"500 sets","rate":"$5.00","charge":"$2,500.00"},{"product":"Oil Filter","usage":"—","rate":"$8.00","charge":"$16,500.00"}]'><div slot="foot" class="row" style="justify-content:space-between;padding:8px 12px"><span class="text-copy-13" style="color:var(--text-2)">Subtotal</span><b class="mono">$24,000.00</b></div></acme-table>`,
    },
    {
      h: "Empty",
      html: `<acme-table columns='[{"key":"c1","label":"Col 1"},{"key":"c2","label":"Col 2"},{"key":"c3","label":"Col 3"}]' rows='[]'><span slot="empty">No rows match the filter.</span></acme-table>`,
    },
  ],
  practices: {
    "When to use": ["Rows that share a shape with at least one comparable column. Entity for a row with one action; Description for key/value metadata."],
    Behavior: ["Empty list: an Empty State outside the table. Unknown cells show an em dash. Sortable headers are buttons; numeric columns are tabular."],
    Content: ["Title Case noun headers (Last Used, Requests (7d)); short relative times in cells; pager copy Page 2 of 7 or 21–40 of 142."],
  },
};
