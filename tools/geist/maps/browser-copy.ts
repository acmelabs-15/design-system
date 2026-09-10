// Maps the copy button's icon stack inside acme-browser's address bar (src/components/browser): the
// generator derives browser-copy.styles.ts from this. The stack is a relative box holding two centred
// layers, the check (absolute, over the stack) and the copy glyph, that swap by scale and opacity
// for one second after a copy. The rest state is in the page's server HTML; the copied state is a
// sketch (tools/geist/sketch/browser.copied.json) drawn from the component's client code.
import { type GeistMap, has } from "../gen";

export const geist: GeistMap = {
  page: "browser",
  element: "browser",
  component: "Browser",
  root: (n) => n.tag === "div" && has("relative")(n) && n.children.length === 2 && has("absolute")(n.children[0]),
  ours: ".stack",
  defaults: { copied: "false" },
  // The JSX carries no copied prop: the state reads off the layers (the check is scaled in when copied).
  derive: { copied: (n) => (has("scale-100")(n.children[0]) ? "true" : "false") },
  props: { copied: { true: ".copied" } },
  children: [
    { ours: ".check", pick: 0 },
    { ours: ".copy", pick: 1 },
  ],
};
