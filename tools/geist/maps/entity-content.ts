// Maps acme-entity-content (src/components/entity-content) to the reference
// EntityContent: a centered row (the free width of the entity with `fill`, else its own) of a
// text column, the title over the description, each truncated on one line, and an optional
// trailing avatar (a slot in ours). `width` writes a variable the reference's own width class
// never reads (it resolves to no rule), so it is inert on both sides.
import { type GeistMap, has } from "../gen";

export const geist: GeistMap = {
  page: "entity",
  component: "EntityContent",
  root: has("[--width:initial]"),
  ours: ".content",
  defaults: { fill: "false" },
  props: { fill: { true: ".fill" } },
  perInstance: { "Entity with List and Checkbox": 3 },
  // The host is the column's flex item: the row's flex and min-width act there.
  host: { mirror: ["flex", "min-width"], mods: { ".fill": "[fill]" } },
  children: [
    {
      ours: ".text",
      pick: has("flex-col"),
      children: [
        { ours: ".title", pick: has("font-semibold") },
        { ours: ".description", pick: has("text-gray-900") },
      ],
    },
  ],
};
