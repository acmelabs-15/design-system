// Maps acme-modal-inset (src/components/modal-inset) to Geist ModalInset: the generator derives
// modal-inset.styles.ts from this. The inset is slotted into the modal's body, and its box is the
// host itself: full bleed through the body's padding (the padding variable reaches it through the
// slot), hairlines above and below, the tinted fill. The last inset of the body (`last`) meets the
// footer with no bottom hairline and no body padding under it; an inset with no div after it
// (the reference's `:last-of-type` among the body's divs) drops its bottom hairline too, an
// attribute the element keeps in step with its siblings.
import type { GeistMap } from "../gen";
import { closed } from "./modal";

export const geist: GeistMap = {
  page: "modal",
  component: "ModalInset",
  root: "data-geist-modal-inset",
  ours: ":host",
  skip: closed,
  props: { last: { true: "[last]" } },
  // A position among the body's children is the host's own (the `@` form).
  states: { ":last-of-type": "@[data-last-of-type]" },
  children: [{ ours: "", pick: () => true, all: true, leaf: true }],
};
