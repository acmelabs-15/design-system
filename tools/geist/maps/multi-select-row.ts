// Maps acme-multi-select-row (src/components/multi-select-row) to Geist MultiSelectRow: a flex row
// (`.row` in ours) of a 28px box (`.box`; 32px wide and after the button with `checkboxPosition="end"`)
// holding a Checkbox (acme-checkbox, composed; its own classes are its own, only the 28px square
// with the rounded gray-100 hover and gray-200 press the row adds is derived, onto its checkbox
// part) and a button (`.action`) that fills the rest: the name (`.name`, 14px label) after optional
// leading content (`.leading`, gray-900) in `.body`, and the action hint (`.hint`, 12px gray-900,
// at least 64px, right-aligned) in `.tail`, hidden until the button is hovered or focused. The
// hovered row's button reads gray-100 (`.hovered`); with the pointer over its checkbox
// (`.checkbox-hovered`) the checkbox reads gray-100 instead, the button stays transparent and the
// hint shows. A disabled row fades its button to 60% under a not-allowed cursor. Only the sketched
// open examples render rows.
import { type GeistMap, has, type SpecNode } from "../gen";
import { PAGE } from "./multi-select";

const flag = (test: (n: SpecNode) => boolean) => (n: SpecNode) => (test(n) ? "true" : "false");
const button = (n: SpecNode) => n.children.find((c) => c.tag === "button");

export const geist: GeistMap = {
  page: "multi-select",
  component: "MultiSelectRow",
  root: (n) => "data-multi-select-row" in n.attrs,
  ours: ".row",
  skip: PAGE,
  defaults: { disabled: "false", checkboxPosition: "start", hovered: "false", checkboxHovered: "false" },
  derive: {
    hovered: flag((n) => !!button(n) && has("bg-gray-100")(button(n)!)),
    checkboxHovered: flag((n) => !!button(n) && has("bg-transparent!")(button(n)!)),
  },
  props: {
    disabled: { true: ".disabled" },
    checkboxPosition: { end: ".end" },
    hovered: { true: ".hovered" },
    checkboxHovered: { true: ".checkbox-hovered" },
  },
  // The button's own pointer, press and keyboard focus states; the named label group is the button, so its hover and focus land there.
  states: { ":hover": "[data-hover]", ":active": "[data-active]", ":focus-visible": "[data-focus]" },
  groupOnAncestor: true,
  children: [
    {
      ours: ".box",
      pick: has("peer"),
      children: [{ ours: "acme-checkbox", pick: (c) => c.tag === "label", extends: "checkbox", part: "checkbox", leaf: true }],
    },
    {
      ours: ".action",
      pick: (c) => c.tag === "button",
      children: [
        {
          ours: ".body",
          pick: 0,
          children: [
            { ours: ".leading", pick: has("shrink-0"), children: [{ ours: "", pick: (c) => c.tag === "svg", leaf: true }] },
            { ours: ".name", pick: has("text-label-14") },
          ],
        },
        { ours: ".tail", pick: 1, children: [{ ours: ".hint", pick: 0 }] },
      ],
    },
  ],
  // `group`, `peer` and the named label group are marker classes.
  ignore: ["group", "peer", "group/label"],
  slotted: ["svg"],
};
