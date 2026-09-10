// Maps acme-theme-switcher (src/components/theme-switcher) to Geist ThemeSwitcher's group: the pill
// fieldset with its hidden legend. The three options inside are mapped by maps/theme-switcher-option.ts.
// `small` is an attribute state in the reference (`data-small` on the fieldset), not a class.
import type { GeistMap, SpecNode } from "../gen";

export const geist: GeistMap = {
  page: "theme-switcher",
  component: "ThemeSwitcher",
  root: (n: SpecNode) => n.tag === "fieldset",
  ours: ".switcher",
  children: [
    { ours: ".legend", pick: (c: SpecNode) => c.tag === "legend" },
    // The options are the option map's roots: nothing is emitted for them here.
    { ours: "", pick: (c: SpecNode) => c.tag === "span", all: true, leaf: true },
  ],
};
