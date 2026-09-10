// Maps the dialog of acme-command-menu (src/components/command-menu) to Geist CommandMenu's dialog
// content: the fixed 640px box 15% from the top of the viewport, centred, rounded, on the
// background-100 fill with the modal shadow, that scales in on open and out on close
// (`data-state`). In ours it is the native dialog element, opened in the top layer; its backdrop is
// the reference's overlay (maps/command-menu-overlay.ts). Inside it the screen-reader title and
// description, then the palette root: its screen-reader label (an inline style in the reference,
// nothing to derive), the input block (maps/command-menu-input.ts) and the list
// (maps/command-menu-list.ts). Every open state is a sketch under tools/geist/sketch/command-menu.*.json;
// the page's own examples render the closed opener only.
import { type GeistMap, has } from "../gen";

/** The page's own examples: the menu is closed there, so no root renders. */
export const CLOSED = ["Default", "With divider", "With suffix"];
/** The dialog's open and closed frames are its own attribute in ours too. */
export const FRAMES = { "[data-state=open]": "[data-state=open]", "[data-state=closed]": "[data-state=closed]" };

export const geist: GeistMap = {
  page: "command-menu",
  element: "command-menu",
  component: "CommandMenu",
  root: "cmdk-dialog",
  ours: "dialog",
  skip: CLOSED,
  states: FRAMES,
  ignore: ["geist-dialog"],
  children: [
    { ours: ".title", pick: (c) => c.tag === "h2" },
    { ours: ".desc", pick: (c) => c.tag === "p" },
    {
      ours: ".root",
      pick: (c) => "cmdk-root" in c.attrs,
      children: [
        { ours: ".label", pick: (c) => c.tag === "label" },
        // The input block and the list carry their own maps.
        { ours: "", pick: has("[--padding:12px]"), leaf: true },
        { ours: "", pick: (c) => "cmdk-list" in c.attrs, leaf: true },
      ],
    },
  ],
};
