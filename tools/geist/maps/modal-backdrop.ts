// Maps the backdrop of acme-modal (src/components/modal): the reference's fixed sheet behind the
// overlay, faded in through `.active` (`[data-open]` on the dialog in ours) and out again before
// the modal unmounts, or the sheet's translucent backdrop with its own fade (`.sheet`). In ours it
// is the native dialog's `::backdrop`.
import { type GeistMap, has } from "../gen";
import { closed } from "./modal";

export const geist: GeistMap = {
  page: "modal",
  component: "Modal",
  element: "modal",
  root: (n) => n.tag === "div" && (has("geist-overlay-backdrop")(n) || has("bg-background-200/50")(n)),
  ours: "dialog",
  pseudo: "::backdrop",
  skip: closed,
  defaults: { sheet: "false", active: "false" },
  derive: { sheet: (n) => String(has("bg-background-200/50")(n)), active: (n) => String(has("active")(n)) },
  props: { sheet: { true: ".sheet" }, active: { true: "[data-open]" } },
};
