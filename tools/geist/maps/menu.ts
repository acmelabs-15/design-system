// Maps the floating list of acme-menu (src/components/menu): the positioned wrapper (`data-phase`
// for the exit fade, the z-index) and the material list inside it, `width` wide. Only the sketched
// open examples render it; the server-rendered examples are closed. The rows are acme-menu-item,
// acme-menu-section and acme-menu-divider, mapped on their own.
import type { GeistMap } from "../gen";

/** The page's own examples: every menu is closed there. */
export const CLOSED = ["Default", "With chevron", "Disabled items", "Locked items", "Link items", "Custom trigger", "Prefix and suffix", "Menu position", "With section"];
export const geist: GeistMap = {
  page: "menu",
  component: "Menu",
  root: (n) => n.tag === "div" && "data-phase" in n.attrs,
  ours: ".floating",
  skip: CLOSED,
  children: [{ ours: ".menu", pick: 0, children: [{ ours: "", pick: (c) => c.tag === "li", all: true, leaf: true }] }],
};
