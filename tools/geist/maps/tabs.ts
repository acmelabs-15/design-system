// Maps acme-tabs (src/components/tabs) to Geist Tabs' tab list: a no-scrollbar flex row with the
// inset hairline (none for `secondary`) that stops clipping while a tab shows its focus ring. The
// tabs inside are slotted acme-tab elements, styled by their own map (maps/tab.ts).
import type { GeistMap } from "../gen";

export const geist: GeistMap = {
  page: "tabs",
  component: "Tabs",
  root: "data-geist-tabs",
  ours: ".tabs",
  defaults: { variant: "primary" },
  props: { variant: { secondary: ".secondary" } },
  // A keyboard-focused tab sits in a shadow tree: the row learns of it through focusin.
  states: { ":has(:focus-visible)": "[data-focus-within]" },
  children: [{ ours: "", pick: (c) => c.attrs.role === "tab" || c.tag === "span", all: true, leaf: true }],
  ignore: ["group"],
};
