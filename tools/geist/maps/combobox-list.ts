// Maps the floating list of acme-combobox (src/components/combobox, combobox-list.styles.ts) to
// Geist ComboboxList's popover content: the material box (`.list` in ours, `role="dialog"`) 8px
// under the field, sized by the script (the field's width, or `maxWidth`; a height of the rows it
// holds, five and a half rows at most) and the `[data-pristine="false"]` height transition once the
// user has typed. Inside it the plain listbox `ul` (`.options`), the centred empty message when no
// row matches (`.empty`), and the footer after the list (`.footer`, slotted content). Only the
// sketched open examples render it; the page's own examples are closed, and the rows are
// acme-combobox-option (maps/combobox-option.ts).
import type { GeistMap } from "../gen";
import { PAGE } from "./combobox";

export const geist: GeistMap = {
  page: "combobox",
  element: "combobox",
  component: "ComboboxList",
  root: (n) => n.attrs.role === "dialog" && "data-pristine" in n.attrs,
  ours: ".list",
  skip: [...PAGE, "Field variants", "Keyboard focus"],
  // The exit animation names no keyframes in the reference sheets (a rule the compiler never wrote): nothing to derive.
  states: { "[data-state='closed']": null },
  children: [
    {
      ours: ".options",
      pick: (c) => c.tag === "ul",
      children: [
        { ours: ".empty", pick: (c) => c.tag === "p" },
        { ours: "", pick: (c) => c.tag === "li", all: true, leaf: true },
      ],
    },
    { ours: ".footer", pick: (c) => c.tag === "footer", children: [{ ours: "", pick: () => true, all: true, leaf: true }] },
  ],
};
