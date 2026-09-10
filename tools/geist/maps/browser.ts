// Maps acme-browser (src/components/browser) to Geist Browser: the generator derives browser.styles.ts
// from this. The frame (a small material, rounded by container width from the md breakpoint) holds
// the header and the slotted content. The header is three sections: the traffic-light dots with the
// navigation controls, the address pill with its copy button (a composed acme-button, tertiary tiny
// square; only the icon size the browser adds is derived here), and an empty spacer hidden below lg.
// The copy button's icon stack has a mapping of its own (browser-copy).
import { type GeistMap, has } from "../gen";

export const geist: GeistMap = {
  page: "browser",
  component: "Browser",
  root: (n) => n.tag === "div" && has("material-small")(n) && has("overflow-hidden")(n),
  ours: ".frame",
  skip: ["Copied"],
  children: [
    {
      ours: ".header",
      pick: (c) => "data-geist-browser-header-root" in c.attrs,
      children: [
        {
          ours: ".section",
          pick: (c) => has("flex-1")(c) && !has("max-lg:hidden")(c),
          all: true,
          children: [
            {
              ours: ".dots",
              pick: has("gap-2"),
              children: [
                { ours: ".dot-close", pick: 0 },
                { ours: ".dot-min", pick: 1 },
                { ours: ".dot-zoom", pick: 2 },
              ],
            },
            { ours: ".controls", pick: has("max-md:hidden") },
            {
              ours: ".address",
              pick: has("w-full"),
              children: [
                { ours: ".text", pick: has("truncate") },
                { ours: "acme-button", pick: (c) => c.tag === "button", extends: "button", part: "button", children: [{ ours: "", pick: 0, children: [{ ours: "", pick: 0, leaf: true }] }] },
              ],
            },
          ],
        },
        { ours: ".spacer", pick: has("max-lg:hidden") },
      ],
    },
    // Everything after the header is the example's own content, slotted through in ours.
    { ours: "", pick: (c) => !("data-geist-browser-header-root" in c.attrs), all: true, leaf: true },
  ],
};
