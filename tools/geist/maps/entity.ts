// Maps acme-entity (src/components/entity) to the reference Entity: a padded row (a list item; a
// button when the row is clickable: full width, the list's background by inheritance, tinted on
// hover) holding a section of up to two columns. The left column takes the `left` node and the
// content (an acme-entity-content, or any slotted content); the right column, rendered only with
// a `right` node, takes the controls and sits at the row's end. Everything inside a column is
// slotted content with rules of its own. In a list, every row but the last carries the list's
// divider: a rule of the list on its child, emitted here on the row (the list is the row's
// context, an attribute the element keeps in step with its parent; the position is the host's).
// One example dashes the columns through leftClassName/rightClassName: the consumer's utilities,
// `::part(left)` and `::part(right)` in ours.
import { type GeistMap, has } from "../gen";

export const geist: GeistMap = {
  page: "entity",
  component: "Entity",
  root: (n) => (n.tag === "li" || n.tag === "button") && has("p-4")(n) && n.children.some((c) => c.tag === "section"),
  ours: ".entity",
  defaults: { as: "li", listed: "false" },
  derive: { listed: (_n, _p, ancestors) => (ancestors.some((a) => a.tag === "ul") ? "true" : "false") },
  props: { as: { button: ".clickable" }, listed: { true: "[data-listed]" } },
  // The checkbox list writes one Entity inside a `.map()` and renders three.
  perInstance: { "Entity with List and Checkbox": 3 },
  // The list's divider rules on its rows.
  fromAncestor: (c) => /^\[&>(li|button):not\(:last-child\)\]/.test(c),
  // The clickable row's hover is the Interaction controller's attribute; a row's place among its siblings is the host's.
  states: { ":hover": "[data-hover]", ":last-child": "@:last-child" },
  // The button inherits the list's background: the host passes it on.
  host: { mirror: ["background-color"], mods: { ".clickable": "[as=button]" } },
  ignore: ["border", "border-dashed", "border-gray-300", "rounded-md", "p-2"],
  children: [
    {
      ours: ".row",
      pick: (c) => c.tag === "section",
      children: [
        { ours: ".left", pick: has("left"), children: [{ ours: "", pick: () => true, all: true, leaf: true }] },
        { ours: ".right", pick: has("right"), children: [{ ours: "", pick: () => true, all: true, leaf: true }] },
      ],
    },
  ],
};
