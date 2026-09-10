// Maps acme-tab (src/components/tab) to Geist Tabs' tab button: the 14px gray-900 label with a
// transparent 2px bottom border that turns gray-1000 when selected, or the 32px rounded pill of a
// secondary row. The row's variant reaches the tab as its own modifier; every Tabs example
// renders three of these roots.
import { type GeistMap, has } from "../gen";

export const geist: GeistMap = {
  page: "tabs",
  component: "Tabs",
  element: "tab",
  perInstance: 3,
  root: "data-geist-tab",
  ours: ".tab",
  states: {
    "[data-variant=primary]": ":not(.secondary)",
    "[data-variant=secondary]": ".secondary",
    ":hover": "[data-hover]",
    ":focus-visible": "[data-focus]",
  },
  children: [{ ours: ".icon", pick: has("mr-1.5"), leaf: true }],
};
