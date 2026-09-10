// Maps acme-select (src/components/select) to Geist Select: the generator derives select.styles.ts from this.
// The root is the wrapper around the native select; a prefix cell and a suffix cell (the chevron by default)
// sit absolutely at its sides. The wrapper's variants the JSX does not name (a prefix present, the placeholder
// shown as the value) are read off the rendered root. The sketched examples (secondary type, disabled with
// affixes, placeholder selected, no suffix) come from the class strings in the component's client code.
import { type GeistMap, has, type SpecNode } from "../gen";

const field = (n: SpecNode) => n.children.find((c) => c.tag === "select");

export const geist: GeistMap = {
  page: "select",
  component: "Select",
  root: "data-geist-select",
  ours: ".wrap",
  defaults: { size: "medium", error: "false", disabled: "false", type: "default", prefix: "false", empty: "false" },
  values: { error: { "*": "true" } },
  derive: {
    prefix: (n) => (n.children.some(has("left-3")) ? "true" : "false"),
    // The field reads gray-700 when its value is the placeholder (a controlled field showing the placeholder).
    empty: (n) => (field(n) && has("placeholder:text-[var(--ds-gray-700)]")(field(n)!) ? "true" : "false"),
  },
  props: {
    size: { small: ".sm", large: ".lg" },
    error: { true: ".error" },
    disabled: { true: ".disabled" },
    type: { secondary: ".secondary" },
    prefix: { true: ".with-prefix" },
    empty: { true: ".empty" },
  },
  // The wrapper's hover is the group hover the cells key off; the field's own hover and focus are the wrapper's states too
  // (the cells take no pointer events, and any focus of the field reads as the wrapper's focus). Its disabled and invalid states stay native.
  states: { ":hover": "[data-hover]" },
  children: [
    { ours: ".prefix", pick: has("left-3"), children: [{ ours: "", pick: (c) => c.tag === "svg", leaf: true }] },
    {
      ours: "select",
      pick: (c) => c.tag === "select",
      states: { ":hover": "^[data-hover]", ":focus": "^[data-focus]", ":focus-visible": "^[data-focus]" },
      children: [{ ours: ".ph", pick: has("text-gray-800"), leaf: true }],
    },
    {
      ours: ".suffix",
      pick: has("right-3"),
      children: [
        // The default chevron is the suffix slot's fallback; a slotted suffix icon carries no class of the reference's.
        { ours: ".chevron", pick: has("size-(--ds-control-decoration-size)"), leaf: true },
        { ours: "", pick: (c) => c.tag === "svg", leaf: true },
      ],
    },
  ],
};
