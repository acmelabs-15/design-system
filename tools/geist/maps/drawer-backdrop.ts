// Maps the backdrop of acme-drawer (src/components/drawer): the reference's fixed black 40% sheet
// behind the popup, faded through the starting and ending frames, one step above the modal's
// layer when `nested`. In ours it is the native dialog's `::backdrop`.
import { type GeistMap, has } from "../gen";
import { closed } from "./drawer";

export const geist: GeistMap = {
  page: "drawer",
  component: "Drawer",
  element: "drawer",
  root: (n) => n.tag === "div" && has("bg-black/40")(n),
  ours: "dialog",
  pseudo: "::backdrop",
  skip: closed,
  defaults: { nested: "false" },
  props: { nested: { true: ".nested" } },
};
