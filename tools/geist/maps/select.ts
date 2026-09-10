// Maps acme-select (src/components/select) to Geist Select: the generator derives select.styles.ts from this.
//
// The root is the wrapper around the native select, and it holds two places, one at each side. Both sit
// INSIDE the field: absolutely positioned, transparent, no line. Measured across the reference's 20
// selects, all 23 of its decorations read that way, so a select has no add-on places at all — the
// attached cells an input can carry never appear here.
//
// The end place holds the chevron by default; a slotted element replaces it.
//
// As in the input map, `defaults`, the `derive` keys and every `pick` read the REFERENCE, so they keep
// its names. `props` values and `children[].ours` are OUR class names, and those carry the place.
//
// The wrapper's variants the JSX does not name (a start place present, the placeholder shown as the
// value) are read off the rendered root. The sketched examples (secondary type, disabled with places,
// placeholder selected, no end place) come from the class strings in the component's client code.
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
    prefix: { true: ".has-start" },
    empty: { true: ".empty" },
  },
  // The wrapper's hover is the group hover the cells key off; the field's own hover and focus are the wrapper's states too
  // (the cells take no pointer events, and any focus of the field reads as the wrapper's focus). Its disabled and invalid states stay native.
  states: { ":hover": "[data-hover]" },
  children: [
    { ours: ".start", pick: has("left-3"), children: [{ ours: "", pick: (c) => c.tag === "svg", leaf: true }] },
    {
      ours: "select",
      pick: (c) => c.tag === "select",
      states: { ":hover": "^[data-hover]", ":focus": "^[data-focus]", ":focus-visible": "^[data-focus]" },
      children: [{ ours: ".ph", pick: has("text-gray-800"), leaf: true }],
    },
    {
      ours: ".end",
      pick: has("right-3"),
      children: [
        // The default chevron is the end slot's fallback; a slotted icon carries no class of the reference's.
        { ours: ".chevron", pick: has("size-(--ds-control-decoration-size)"), leaf: true },
        { ours: "", pick: (c) => c.tag === "svg", leaf: true },
      ],
    },
  ],
};
