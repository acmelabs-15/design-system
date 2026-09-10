// Maps acme-menu-button (src/components/menu-button) to Geist MenuButton: a Button (acme-button,
// whose own root classes are its own; only what the menu button adds is derived) whose label holds
// a full-width row (`.inner`) with the content and, with `showChevron`, an absolutely placed chevron
// that turns while the menu is open. The label is derived in full here: the menu button's content
// is always an element child of the button, a combination (with `svgOnly`, with the chevron's
// grown label) the button page never shows. An icon-only trigger (an element child, or `svgOnly`)
// reads gray-400 while open. The unstyled trigger (`type="unstyled"`, a bare reset button with no
// class of its own) loses the label's padding.
import { type GeistMap, has } from "../gen";

/** The first child of the trigger's content is an element, not text: the reference then sets `svgOnly`. */
const elementChild = (n: { children: { children: { text?: string; children: unknown[] }[] }[] }) => {
  const inner = n.children[0]?.children[0];
  return !!inner && inner.children.length > 0 && !inner.text;
};
export const geist: GeistMap = {
  page: "menu",
  component: "MenuButton",
  root: "data-geist-menu-button",
  ours: ".btn",
  extends: "button",
  defaults: { variant: "default", showChevron: "false", open: "false", svgOnly: "false", type: "button" },
  derive: {
    open: (n) => (n.attrs["data-is-open"] === "true" ? "true" : "false"),
    svgOnly: (n, p) => (p.svgOnly === "true" || elementChild(n) ? "true" : "false"),
  },
  props: { variant: { secondary: ".secondary" }, showChevron: { true: ".chevron" }, open: { true: ".open" }, svgOnly: { true: ".icon-only" }, type: { unstyled: ".unstyled" } },
  children: [
    {
      ours: ".label",
      pick: has("truncate"),
      children: [{ ours: ".inner", pick: 0, children: [{ ours: ".chev", pick: has("absolute"), children: [{ ours: "svg", pick: 0 }] }, { ours: "", pick: (c) => !has("absolute")(c), leaf: true }] }],
    },
  ],
  ignore: ["group/trigger"],
};
