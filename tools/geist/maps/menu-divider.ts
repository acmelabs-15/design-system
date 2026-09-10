// Maps acme-menu-divider (src/components/menu-divider) to Geist MenuDivider: a 1px gray-alpha-400
// separator row that bleeds into the list's padding.
import { CLOSED } from "./menu";
import type { GeistMap } from "../gen";

export const geist: GeistMap = {
  page: "menu",
  component: "MenuDivider",
  root: "data-geist-menu-divider",
  ours: ".divider",
  skip: CLOSED,
};
