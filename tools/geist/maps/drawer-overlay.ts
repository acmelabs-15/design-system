// Maps the dialog of acme-drawer (src/components/drawer): the reference's fixed full-viewport
// layer that pins the popup to the bottom edge, one step above the modal's layer when `nested`.
// In ours it is the native dialog element, opened in the top layer; the popup is drawer.ts.
import { type GeistMap, has } from "../gen";
import { closed } from "./drawer";

export const geist: GeistMap = {
  page: "drawer",
  component: "Drawer",
  element: "drawer",
  root: (n) => n.tag === "div" && has("items-end")(n),
  ours: "dialog",
  skip: closed,
  defaults: { nested: "false" },
  props: { nested: { true: ".nested" } },
  children: [{ ours: "", pick: has("geist-dialog"), leaf: true }],
};
