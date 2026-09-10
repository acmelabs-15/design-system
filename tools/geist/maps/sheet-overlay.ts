// Maps the overlay of acme-sheet (src/components/sheet): the reference's fixed full-viewport sheet
// behind the panel (`data-slot="sheet-overlay"`), the backdrop color at the backdrop opacity,
// fading in while the panel is open and out again before the sheet unmounts. In ours it is the
// native dialog's `::backdrop`, keyed off the dialog's `data-state` like the panel.
import type { GeistMap } from "../gen";
import { closed } from "./sheet";

export const geist: GeistMap = {
  page: "sheet",
  component: "SheetContent",
  element: "sheet",
  root: (n) => n.attrs["data-slot"] === "sheet-overlay",
  ours: "dialog",
  pseudo: "::backdrop",
  skip: closed,
};
