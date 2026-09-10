// Maps the dialog of acme-modal (src/components/modal): the reference's fixed full-viewport overlay
// that centres the panel (`.geist-overlay`), or the sheet's viewport that pins it to the bottom edge
// (`.sheet`). In ours it is the native dialog element, opened in the top layer. The focus-trap
// wrapper around the panel is its child (`.trap`); the panel itself is modal.ts.
import { type GeistMap, has } from "../gen";
import { closed } from "./modal";

export const geist: GeistMap = {
  page: "modal",
  component: "Modal",
  element: "modal",
  root: (n) => n.tag === "div" && (has("geist-overlay")(n) || (has("fixed")(n) && has("items-end")(n))),
  ours: "dialog",
  skip: closed,
  defaults: { sheet: "false" },
  derive: { sheet: (n) => String(has("items-end")(n)) },
  props: { sheet: { true: ".sheet" } },
  children: [
    { ours: ".trap", pick: (c) => has("outline-none")(c) && !("data-geist-modal" in c.attrs), leaf: true },
    // The sheet's popup sits in the viewport directly: the panel, mapped in modal.ts.
    { ours: "", pick: has("pointer-events-auto"), leaf: true },
  ],
};
