// Maps acme-dots-menu (src/components/dots-menu) to Geist DotsMenu's trigger: a MenuButton
// (acme-menu-button, a small square tertiary Button composed in our shadow tree; its own root
// classes and its label are its own, only what the dots menu adds is derived, onto its button
// part) whose content is a relative row (`.wrap`) around a 16px box (`.icon`) holding the dots
// icon, `iconSize` wide. The open trigger reads gray-alpha-100 (the `aria-expanded` state on the
// composed element's host); a disabled one takes the not-allowed cursor and reads the icon in
// accents-3. The open list and its rows are the menu's own (maps/menu, maps/menu-item), read from
// the sketched open examples with the menu's census runs.
import type { GeistMap } from "../gen";

export const geist: GeistMap = {
  page: "dots-menu",
  component: "DotsMenu",
  root: "data-geist-menu-button",
  ours: "acme-menu-button",
  part: "button",
  extends: "menu-button",
  defaults: { disabled: "false" },
  props: { disabled: { true: "[disabled]" } },
  children: [
    {
      ours: "",
      pick: 0,
      children: [{ ours: "", pick: 0, children: [{ ours: ".wrap", pick: 0, children: [{ ours: ".icon", pick: 0, children: [{ ours: "svg", pick: 0 }] }] }] }],
    },
  ],
  ignore: ["group/trigger"],
};
