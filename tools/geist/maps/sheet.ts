// Maps acme-sheet (src/components/sheet) to Geist Sheet: the generator derives sheet.styles.ts from
// this. The root is the panel (`data-slot="sheet-content"`, the native dialog in ours): a fixed box
// pinned to one edge of the viewport (`side`, right by default; the left and right panels are 75%
// wide up to 384px, the top and bottom ones full width), padded 24, with the elevated shadow. The
// Default example passes the overrides front apps use most (inset 12px, rounded 16, 512 wide from
// the lg breakpoint, no padding, a flex column, padded header, body and footer): `inset` in ours,
// read off the rendered root. Inside it the header (title, then whatever the consumer puts after
// it), the body (the description paragraph) and the footer of buttons. The overlay is mapped on
// its own (sheet-overlay.ts). Every open state is a sketch under tools/geist/sketch/sheet.*.json;
// the page's own showcases render the closed opener only.
import { type GeistMap, has } from "../gen";

export const closed = ["Default", "With Side"];
const slot = (name: string) => (n: { attrs: Record<string, string> }) => n.attrs["data-slot"] === name;

export const geist: GeistMap = {
  page: "sheet",
  component: "SheetContent",
  root: slot("sheet-content"),
  ours: "dialog",
  skip: closed,
  defaults: { side: "right", inset: "false" },
  derive: { inset: (n) => String(has("m-3")(n)) },
  props: {
    side: { top: ".top", bottom: ".bottom", left: ".left" },
    inset: { true: ".inset" },
  },
  // The panel's focus is the dialog's own.
  states: { ":focus": "[data-focus]" },
  // A strong inside the body is slotted content. The footer's zero-weight spacing rule (`sm:space-x-2`)
  // is outranked by the buttons' own `m-0` in the reference, and the generator leaves it out.
  slotted: ["strong"],
  children: [
    {
      ours: ".header",
      pick: slot("sheet-header"),
      children: [
        { ours: ".title", pick: (c) => c.tag === "h2" },
        // The consumer's paragraph after the title: slotted content, styled by the page.
        { ours: "", pick: (c) => c.tag !== "h2", all: true, leaf: true },
      ],
    },
    { ours: ".body", pick: slot("sheet-body") },
    {
      ours: ".footer",
      pick: slot("sheet-footer"),
      // The footer's buttons are slotted acme-buttons: the button's own mapping styles them.
      children: [{ ours: "", pick: () => true, all: true, leaf: true }],
    },
  ],
};
