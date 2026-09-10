// Maps the input block of acme-command-menu (src/components/command-menu) to Geist
// CommandMenuInput: the 12px-padded block under the top edge (`--padding`), with the gray-alpha-400
// hairline below it, that sticks to the top on a narrow screen. Above the field, when the menu is
// on a page, the breadcrumbs of the page stack (a menu-type acme-breadcrumbs of acme-breadcrumb
// chips in ours, styled by their own maps; the wrapper fades their ends on a narrow screen). The
// field row holds the searchbox (16px, 18px from the sm breakpoint, gray-700 placeholder) and the
// Esc chip (shown for a fine pointer only, gray-100 under it, the focus ring when focused). While
// the menu loads, a bar under the block shimmers along its bottom edge. Only the sketched open
// examples render it.
import { type GeistMap, has } from "../gen";
import { CLOSED } from "./command-menu";

export const geist: GeistMap = {
  page: "command-menu",
  element: "command-menu",
  component: "CommandMenuInput",
  root: has("[--padding:12px]"),
  ours: ".head",
  skip: CLOSED,
  children: [
    {
      ours: ".crumbs",
      pick: has("mb-2.5"),
      children: [
        {
          ours: "acme-breadcrumbs",
          part: "list",
          extends: "breadcrumbs",
          pick: (c) => c.tag === "div",
          children: [{ ours: "acme-breadcrumb", part: "item", extends: "breadcrumb", pick: (c) => c.tag === "span", all: true, leaf: true }],
        },
      ],
    },
    {
      ours: ".field",
      pick: has("px-1"),
      children: [
        { ours: ".input", pick: (c) => c.tag === "input" },
        { ours: ".esc", pick: (c) => c.tag === "button", states: { ":hover": "[data-hover]", ":focus-visible": "[data-focus]" } },
      ],
    },
    // The bar's own loading attribute is never set in the reference: the bar animates as soon as it renders.
    { ours: ".loading", pick: has("after:absolute"), states: { "[data-loading=true]": null } },
  ],
};
