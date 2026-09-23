// Generates the Command Menu input header, field and loading treatment.
// Application page-stack actions compose Group and Button; their styles have their own owners.
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
      leaf: true,
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
