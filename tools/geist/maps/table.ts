// Maps acme-table (src/components/table) to the reference Table: the root is the scroll box
// around a native table (14px gray-900 text); a header row of 36px medium cells; a 12px spacer
// body; the body whose props (striped, bordered, interactive, density) are read off its rendered
// class list, since the JSX carries them on the body, not the root; an optional footer. Rows and
// cells are mapped in bulk. A checkbox in a cell is an acme-checkbox in ours.
import type { GeistMap, SpecNode } from "../gen";

const tag = (t: string) => (c: SpecNode) => c.tag === t;
const slot = (s: string) => (c: SpecNode) => c.attrs["data-slot"] === s;
const body = (root: SpecNode) => root.children[0]?.children.find(slot("table-body"));
const bodyHas = (root: SpecNode, cls: string) => (body(root)?.styles.some((s) => s.cls === cls) ? "true" : "false");
const cells = (ours: string) => [{ ours, pick: tag(ours), all: true }];
const rows = (cell: string) => [{ ours: "tr", pick: slot("table-row"), all: true, children: cells(cell) }];

export const geist: GeistMap = {
  page: "table",
  component: "TableRoot",
  root: slot("table-root"),
  ours: ".root",
  defaults: { striped: "false", bordered: "false", interactive: "false", density: "default" },
  derive: {
    striped: (n) => bodyHas(n, "[&_tr:where(:nth-child(odd))]:bg-background-200"),
    bordered: (n) => bodyHas(n, "[&_tr:not(:last-child)]:border-b"),
    interactive: (n) => bodyHas(n, "[&_tr:hover]:bg-gray-100"),
    density: (n) => (bodyHas(n, "[&_td]:py-[5px]") === "true" ? "compact" : "default"),
  },
  props: {
    striped: { true: ".striped" },
    bordered: { true: ".bordered" },
    interactive: { true: ".interactive" },
    density: { compact: ".compact" },
  },
  // A row's hover is its own attribute (the element marks the row under a mouse or pen pointer); a checkbox in a cell is our element.
  states: { ":hover": "[data-hover]", ":has([role=checkbox])": ":has(acme-checkbox)", "[role=checkbox]": "acme-checkbox" },
  children: [
    {
      ours: "table",
      pick: tag("table"),
      children: [
        // Column widths are the consumer's, written inline on each col.
        { ours: "colgroup", pick: tag("colgroup"), leaf: true },
        { ours: "thead", pick: tag("thead"), children: rows("th") },
        { ours: ".spacer", pick: (c) => c.tag === "tbody" && c.attrs["aria-hidden"] === "true" },
        { ours: ".body", pick: slot("table-body"), children: rows("td") },
        { ours: "tfoot", pick: tag("tfoot"), children: rows("td") },
      ],
    },
  ],
};
