// Maps the floating list of acme-multi-select (src/components/multi-select, multi-select-content.styles.ts)
// to Geist MultiSelectContent's popover content: the menu material box (`.content` in ours,
// `role="dialog"`) 8px under the trigger's end, 8px of padding, at least the trigger's width
// (`--acme-popover-trigger-width`, set by the script), no taller than the room below it or 384px
// (`--acme-popover-content-available-height`), scrolling, fading out over 200ms when it closes
// (`data-state="closed"`). Only the sketched open examples render it; the rows inside are
// acme-multi-select-row (maps/multi-select-row.ts).
import type { GeistMap } from "../gen";
import { PAGE } from "./multi-select";

export const geist: GeistMap = {
  page: "multi-select",
  element: "multi-select",
  component: "MultiSelectContent",
  root: (n) => n.attrs.role === "dialog",
  ours: ".content",
  skip: PAGE,
  states: { "[data-state=closed]": "[data-state=closed]" },
  children: [{ ours: "", pick: () => true, all: true, leaf: true }],
};
