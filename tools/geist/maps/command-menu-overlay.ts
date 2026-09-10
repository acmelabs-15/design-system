// Maps the overlay of acme-command-menu (src/components/command-menu) to Geist CommandMenu's
// overlay: the fixed sheet over the viewport, background-100 at 80% opacity, that fades in on open
// and out on close (`data-state`). In ours it is the native dialog's `::backdrop`.
import type { GeistMap } from "../gen";
import { CLOSED, FRAMES } from "./command-menu";

export const geist: GeistMap = {
  page: "command-menu",
  element: "command-menu",
  component: "CommandMenu",
  root: "cmdk-overlay",
  ours: "dialog",
  pseudo: "::backdrop",
  skip: CLOSED,
  states: FRAMES,
  ignore: ["geist-overlay"],
};
