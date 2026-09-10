// Maps acme-menu-section (src/components/menu-section) to Geist MenuSection: a presentational row
// holding the gray-800 heading and a plain group list of items (acme-menu-item, mapped on its own).
import { CLOSED } from "./menu";
import type { GeistMap } from "../gen";

export const geist: GeistMap = {
  page: "menu",
  component: "MenuSection",
  root: "data-geist-menu-section",
  ours: ".section",
  skip: CLOSED,
  children: [
    { ours: ".heading", pick: 0 },
    { ours: ".group", pick: 1, children: [{ ours: "", pick: (c) => c.tag === "li", all: true, leaf: true }] },
  ],
};
