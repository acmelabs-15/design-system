// Maps acme-toast (src/components/toast), the toast the viewport (maps/toaster.ts) stacks, to
// Geist's toast container: a 420px box at the area's bottom right corner that enters translated
// down and transparent (`.shown` ends the entry, `.hiding` starts the exit), filled per `type`
// (success blue, error red, warning amber), collapsed to 50px behind the front toast and expanded
// again while the pointer is over the area (the area's hover is the `data-expanded` attribute on
// every toast; a toast's place among its siblings is the host's). Inside: the column (`.body`),
// an optional visual block, the message row (`.message`: the type read to assistive tech, the
// text, the undo and dismiss controls) and the action row (`.actions`: cancel and action). The
// controls and actions are the button module's own buttons drawn in this tree, so only the
// classes the toast adds to them are emitted here. Every state is a sketch under
// tools/geist/sketch/toast.*.json; the page's own showcases render a button only.
import { type GeistMap, has, type SpecNode } from "../gen";

const button = (label: string) => (c: SpecNode) => c.tag === "button" && c.attrs["aria-label"] === label;
const bool = (v: string) => (v === "true" ? "true" : "false");

export const geist: GeistMap = {
  page: "toast",
  component: "Toast",
  root: "data-geist-toast",
  ours: ".toast",
  defaults: { type: "", visible: "false", hiding: "false", hideX: "false", fullWidth: "false", fullBleed: "false", overflowHidden: "false", visual: "false", wide: "false", clip: "false" },
  values: { visual: { "*": "true" } },
  // The message spans the row without a dismiss control or with `fullWidth`; the box clips with `overflowHidden` or a visual.
  derive: {
    wide: (_n, p) => bool(String(p.hideX === "true" || p.fullWidth === "true")),
    clip: (_n, p) => bool(String(p.overflowHidden === "true" || p.visual === "true")),
  },
  props: {
    type: { success: ".success", error: ".error", warning: ".warning" },
    visible: { true: ".shown" },
    hiding: { true: ".hiding" },
    fullBleed: { true: ".bleed" },
    wide: { true: ".wide" },
    clip: { true: ".clip" },
  },
  // The area's hover expands every toast: the viewport marks each one. A toast's place among the
  // area's children (the front toast is the last; a fourth from the end is hidden) is the host's.
  states: { ":hover": "[data-expanded]", ":last-child": "@:last-child", ":nth-last-child(n+4)": "@:nth-last-child(n+4)", ":nth-last-child(n+3)": "@:nth-last-child(n+3)" },
  ignore: ["toast-container", "group/toastContainer"],
  children: [
    {
      ours: ".body",
      pick: has("flex-col"),
      children: [
        { ours: ".visual", pick: has("-m-4") },
        {
          ours: ".message",
          pick: (c) => c.attrs.id === "toast-message",
          children: [
            { ours: ".sr", pick: has("sr-only") },
            { ours: ".text", pick: (c) => c.tag === "span" && !has("sr-only")(c) },
            {
              ours: ".controls",
              pick: has("flex-nowrap"),
              children: [
                { ours: ".undo", pick: button("Undo"), extends: "button", leaf: true },
                { ours: ".close", pick: button("Dismiss toast"), extends: "button", leaf: true },
              ],
            },
          ],
        },
        {
          ours: ".actions",
          pick: has("justify-end"),
          children: [
            { ours: ".cancel", pick: 0, extends: "button", leaf: true },
            { ours: ".action", pick: 1, extends: "button", leaf: true },
          ],
        },
      ],
    },
  ],
};
