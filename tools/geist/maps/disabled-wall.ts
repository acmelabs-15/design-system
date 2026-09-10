// Maps acme-disabled-wall (src/components/disabled-wall) to Geist DisabledWall on the fieldset page:
// an empty overlay that covers its positioned container, takes the pointer and blocks selection.
// The reference styles it on its own and under disabled content alike, with the same values: the
// disabled ancestor is always there in ours. Disabled fieldset content renders a wall of its own
// before its children (the composed element in ours), so the one written example renders two
// roots for its one instance, and the examples that write none are skipped.
import { type GeistMap, has } from "../gen";

export const geist: GeistMap = {
  page: "fieldset",
  component: "DisabledWall",
  root: has("geist-disabled-wall"),
  ours: ".wall",
  skip: ["Disabled", "Multiple Fieldsets"],
  perInstance: { "With Disabled Wall": 2 },
  context: { ".geist-disabled": "" },
};
