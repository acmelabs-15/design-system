// Maps acme-command-item (src/components/command-item; the module ships beside the menu) to Geist
// CommandMenuItem: a 14px flex row at least 40px tall (36px from the sm breakpoint), 8px of side
// padding, a 6px radius, 12px between its parts, on the gray-alpha-100 fill while it is the
// highlighted row under a fine pointer (`data-selected`) or focused. In it an optional 20px prefix
// box in gray-900 (slotted content in ours), the label, an optional keybind pushed to the end (kbd
// chips of 20px on the background-100 fill with the border shadow; shown while the keybind box is
// hovered) and an optional suffix box at the end (slotted content). Only the sketched open
// examples render items.
import { type GeistMap, has } from "../gen";
import { CLOSED } from "./command-menu";

export const geist: GeistMap = {
  page: "command-menu",
  element: "command-menu",
  component: "CommandMenuItem",
  root: "cmdk-item",
  ours: ".item",
  skip: CLOSED,
  // The highlight is the menu's attribute on the row; a focus of the row itself is the Interaction controller's.
  states: { "[data-selected=true]": "[data-selected=true]", ":focus": "[data-focus]" },
  children: [
    { ours: ".prefix", pick: has("size-5"), children: [{ ours: "", pick: () => true, all: true, leaf: true }] },
    { ours: ".keys", pick: has("hidden"), states: { ":hover": "[data-hover]" }, children: [{ ours: ".key", pick: (c) => c.tag === "kbd", all: true }] },
    { ours: ".suffix", pick: has("items-stretch"), children: [{ ours: "", pick: () => true, all: true, leaf: true }] },
  ],
  slotted: ["svg", "p"],
};
