// Maps acme-choicebox-item (src/components/choicebox-item) to Geist ChoiceboxGroupItem: the generator derives
// choicebox-item.styles.ts from this. The root is the tile (a list item with a border, the flex item of the group's
// row: its `flex-1` is mirrored on the host). Inside, the body label holds the option row (the title block and the
// control) and, once the item is selected and has children, the content span under a divider; with
// interactiveContent the content is a div beside the label instead. The control is a composed acme-radio (its
// control alone, no text) or acme-checkbox: only the classes this element adds to their box (the blue check, the
// gray rest border) are derived, onto the box's part. A disabled item with a reason wraps its label in a tooltip.
// The states the server HTML lacks (control at start, interactive content, a disabled reason, content while
// disabled) are sketches under tools/geist/sketch/choicebox.*.json.
import { type GeistMap, has, type SpecNode } from "../gen";

const slot = (name: string) => (c: SpecNode) => c.attrs["data-slot"] === name;
const deep = (n: SpecNode): SpecNode[] => [n, ...n.children.flatMap(deep)];

export const geist: GeistMap = {
  page: "choicebox",
  component: "ChoiceboxGroupItem",
  root: (n: SpecNode) => n.tag === "li" && has("group/choicebox")(n),
  ours: ".tile",
  // The group's disabled and control position reach every item through context.
  inherit: { disabled: "ChoiceboxGroup", controlPosition: "ChoiceboxGroup" },
  defaults: { disabled: "false", controlPosition: "end", interactiveContent: "false", open: "false" },
  // `open`: the item is selected and has content to show.
  derive: { open: (n) => (deep(n).some(has("choicebox-content")) ? "true" : "false") },
  props: {
    disabled: { true: "[data-disabled]" },
    controlPosition: { start: ".start" },
    interactiveContent: { true: ".interactive" },
    open: { true: ".open" },
  },
  // Every state is an attribute on the tile, set by the Interaction controller (hover, focus, active) or reflected
  // off the control (checked, disabled). The control's own states (`peer-…`), the tile's and the option row's
  // `:has()` states read the same attributes (`^`: on the tile): the tile is the control's label, so its hover and
  // press are the control's. The checkbox's indeterminate marker never applies here (the item does not expose it).
  states: {
    ":hover": "^[data-hover]",
    ":focus-visible": "[data-focus]",
    ":active": "[data-active]",
    ":checked": "[data-checked]",
    ":disabled": "[data-disabled]",
    ":enabled": ":not([data-disabled])",
    ":has(:checked)": "^[data-checked]",
    ":has(:disabled)": "^[data-disabled]",
    ":has(:enabled)": "^:not([data-disabled])",
    ":focus-within": "[data-focus-within]",
    ".indeterminate": "^[data-indeterminate]",
  },
  // The radio control's `group` is the box's parent (the acme-radio host in ours): its hover is the host's.
  groupOnAncestor: true,
  host: { mirror: ["flex"] },
  ignore: ["choicebox-content"],
  children: [
    {
      ours: ".body",
      pick: (c: SpecNode) => c.tag === "label",
      children: [
        {
          ours: ".option",
          pick: slot("choicebox-group-item-option"),
          children: [
            {
              ours: ".text",
              pick: slot("choicebox-group-item-title-description"),
              children: [
                { ours: ".title", pick: 0 },
                { ours: ".description", pick: 1 },
              ],
            },
            // The radio: the standalone control (acme-radio's `.control`), its box a part of the radio's tree.
            {
              ours: "acme-radio",
              pick: (c: SpecNode) => c.tag === "span" && has("p-0.5")(c),
              extends: "radio/.control",
              children: [
                { ours: "", pick: (c: SpecNode) => c.tag === "input", leaf: true },
                { ours: "", part: "dot", pick: (c: SpecNode) => c.tag === "span", extends: "radio/.control/.dot", leaf: true },
              ],
            },
            // The checkbox: a whole acme-checkbox (no text), its box a part of the checkbox's tree.
            {
              ours: "acme-checkbox",
              pick: (c: SpecNode) => c.tag === "label",
              extends: "checkbox",
              children: [
                {
                  ours: "",
                  pick: 0,
                  children: [
                    { ours: "", pick: (c: SpecNode) => c.tag === "input", leaf: true },
                    { ours: "", part: "box", pick: (c: SpecNode) => c.tag === "span", extends: "checkbox/.control/.box", leaf: true },
                  ],
                },
              ],
            },
          ],
        },
        // The content under the option row: slotted light DOM of ours.
        { ours: ".content", pick: has("choicebox-content"), leaf: true },
      ],
    },
    // The tooltip around a disabled item's label (a disabled reason): a composed acme-tooltip, the classes this element gives its trigger.
    { ours: "acme-tooltip", pick: (c: SpecNode) => c.tag === "div" && has("self-stretch")(c), leaf: true },
    // Interactive content: a div beside the label, so clicks inside do not toggle the item.
    { ours: ".panel", pick: (c: SpecNode) => c.tag === "div" && has("choicebox-content")(c), leaf: true },
  ],
};
