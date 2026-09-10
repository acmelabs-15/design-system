// Maps acme-split-button (src/components/split-button) to Geist SplitButton's wrapper: a flex row
// of two composed Buttons (acme-button; only the classes the split button adds are derived, onto
// each button's part; an attribute state lands on the button's host), the trigger holding the
// chevron in an inner span. The open menu and its items have mappings of their own.
import { type GeistMap, has } from "../gen";

const SKIP = ["Open", "Open end"];
export const geist: GeistMap = {
  page: "split-button",
  component: "SplitButton",
  root: (n) => n.tag === "div" && has("relative")(n) && has("flex")(n) && !!n.attrs.style?.includes("--divider-color"),
  ours: ".split",
  skip: SKIP,
  ignore: ["geist-new-themed", "geist-new-default", "geist-new-default-fill"],
  defaults: { size: "medium", variant: "default" },
  // `buttonProps` carries the composed button's size and variant.
  derive: {
    size: (_n, p) => /size: '(\w+)'/.exec(p.buttonProps ?? "")?.[1] ?? "medium",
    variant: (_n, p) => /variant: '(\w+)'/.exec(p.buttonProps ?? "")?.[1] ?? "default",
  },
  props: { size: { small: ".sm", large: ".lg" }, variant: { secondary: ".secondary" } },
  children: [
    { ours: "acme-button.main", pick: 0, extends: "button", part: "button", leaf: true },
    { ours: "acme-button.trigger", pick: 1, extends: "button", part: "button", children: [{ ours: "", pick: 0, children: [{ ours: ".inner", pick: 0 }] }] },
  ],
};
