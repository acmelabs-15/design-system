// Maps acme-command-divider (src/components/command-divider; the module ships beside the menu) to
// Geist CommandMenuDivider: a 1px gray-alpha-400 line with 8px above and below, pulled 8px left
// and 16px wider than the list's content so it spans the list's padding. Hidden while a query
// narrows the list. Only the sketched open examples render dividers.
import type { GeistMap } from "../gen";
import { CLOSED } from "./command-menu";

export const geist: GeistMap = {
  page: "command-menu",
  element: "command-menu",
  component: "CommandMenuDivider",
  root: "cmdk-separator",
  ours: ".divider",
  skip: CLOSED,
};
