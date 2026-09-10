// Maps acme-drawer (src/components/drawer) to Geist Drawer: the generator derives drawer.styles.ts
// from this. The root is the popup (`.geist-dialog`, `.drawer` in ours): the full-width sheet
// pinned to the bottom edge, capped at 80dvh, scrolling its content (`verticalScroll`, `.noscroll`
// when off), 100dvh tall for `height="max"` (`.max`; a number is an inline height). The consumer's
// content is slotted. The dialog and its backdrop are mapped on their own (drawer-overlay.ts,
// drawer-backdrop.ts). Every open state is a sketch under tools/geist/sketch/drawer.*.json; the
// page's own showcases render the closed opener only.
import { type GeistMap, has } from "../gen";

export const closed = ["Default", "Custom height"];

export const geist: GeistMap = {
  page: "drawer",
  component: "Drawer",
  root: has("geist-dialog"),
  ours: ".drawer",
  skip: closed,
  defaults: { verticalScroll: "true", height: "auto", nested: "false" },
  // A number height is an inline style alone: it reads as the default.
  values: { height: { max: "max", "*": "auto" } },
  props: { verticalScroll: { false: ".noscroll" }, height: { max: ".max" }, nested: { true: ".nested" } },
  // The marker class carries no rules of its own.
  ignore: ["tailwind"],
  // A menu opened straight inside the popup loses its shadow: that rule crosses into the menu's own tree.
  crossing: ["[data-geist-menu]"],
  children: [{ ours: "", pick: () => true, all: true, leaf: true }],
};
