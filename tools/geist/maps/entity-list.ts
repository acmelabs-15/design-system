// Maps acme-entity-list (src/components/entity-list) to the reference EntityList: a list in the
// page background ringed by the border shadow, radius 5, clipping its rows. With a header the list
// rounds its bottom corners only (the header column is the entity-list-wrap mapping). The rows
// are slotted acme-entity elements, styled by their own map, which also emits the list's divider
// rules on them (a rule on a child that lives in another shadow tree): they are left out here.
import { type GeistMap, has } from "../gen";

export const geist: GeistMap = {
  page: "entity",
  component: "EntityList",
  root: (n) => n.tag === "ul",
  ours: ".list",
  defaults: { header: "false" },
  derive: { header: (n) => (has("last:rounded-b-[5px]")(n) ? "true" : "false") },
  props: { header: { true: ".headed" } },
  children: [{ ours: "", pick: () => true, all: true, leaf: true }],
  ignore: ["[&>li:not(:last-child)]:border-b", "[&>li:not(:last-child)]:border-[color:var(--accents-2)]", "[&>button:not(:last-child)]:border-b!", "[&>button:not(:last-child)]:border-[color:var(--accents-2)]"],
};
