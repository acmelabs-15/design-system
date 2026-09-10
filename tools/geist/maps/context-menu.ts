// Maps acme-context-menu (src/components/context-menu) to the reference's ContextMenuContent: the
// material list (`role="menu"`, 160 wide) that opens at the pointer. Ours composes acme-menu, whose
// list is the `menu` part: the content's own classes land on that part from the outer tree, so the
// list reads the context menu's rules (its own breakpoints included) over the composed menu's own.
// Inside it, the 1px separator (`.separator`, a block of ours slotted into the list) that follows
// the link rows over a link. The positioned wrapper around the list carries inline styles only
// (nothing to derive); the trigger area is a bare span with an inline style (our host), and the
// rows are acme-menu-item (maps/menu-item) with the same computed box, so neither is mapped here.
// Only the sketched open examples render the list.
import type { GeistMap } from "../gen";

export const geist: GeistMap = {
  page: "context-menu",
  component: "ContextMenuContent",
  root: (n) => n.attrs.role === "menu" && "data-radix-menu-content" in n.attrs,
  ours: "acme-menu",
  part: "menu",
  skip: ["Default", "Disabled items", "Link items", "Prefix and suffix"],
  // The exit animation names no keyframes in the reference sheets (a rule the compiler never wrote): nothing to derive.
  states: { "[data-state='closed']": null },
  children: [
    { ours: ".separator", pick: (c) => c.attrs.role === "separator" },
    { ours: "", pick: (c) => c.attrs.role === "menuitem", all: true, leaf: true },
  ],
};
