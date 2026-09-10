// Maps acme-menu-item (src/components/menu-item) to Geist MenuItem, MenuLink and MenuItemLocked: a
// 36px row (an anchor for a link) with an optional prefix and suffix span around the label; `type`
// error reads red; a disabled row carries aria-disabled. The highlight is the `data-selected` state.
import { CLOSED } from "./menu";
import { type GeistMap, has } from "../gen";

export const geist: GeistMap = {
  page: "menu",
  component: ["MenuItem", "MenuLink", "MenuItemLocked"],
  root: (n) => "data-geist-menu-item" in n.attrs && n.attrs.role === "menuitem",
  ours: ".item",
  skip: CLOSED,
  defaults: { type: "default" },
  props: { type: { error: ".error" } },
  // A list item is never a form control: the `:disabled` rules match nothing on either side.
  states: { ":disabled": null },
  children: [
    { ours: ".start", pick: has("mr-[var(--geist-gap-quarter)]") },
    { ours: ".end", pick: has("ml-auto") },
  ],
  slotted: ["svg"],
};
