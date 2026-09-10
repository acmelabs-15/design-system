// Maps the trigger of acme-context-card (src/components/context-card) to Geist ContextCardTrigger's
// wrapper: an inline flex box that clips its content, a pointer cursor, a flex item that shrinks
// but never grows. Its layout rules are mirrored on the host, so a parent that lays the host out
// (a flex row of buttons, a centred column) sees the reference's box. The wrapper's content is
// slotted: a plain span, or a composed element with rules of its own. The reference's `render`
// prop merges the wrapper onto the consumer's own element (a link, styled by the consumer's
// classes); ours slots that element, so those classes are the consumer's and carry nothing here.
// A second mapping of the element; the open card is maps/context-card.ts.
import { type GeistMap, has } from "../gen";

export const geist: GeistMap = {
  page: "context-card",
  element: "context-card",
  component: "ContextCardTrigger",
  root: (n) => has("flex-[0_1_auto]")(n) && has("cursor-pointer")(n),
  ours: ".trigger",
  host: { mirror: ["display", "flex"] },
  // The consumer's classes on a rendered link trigger (the "Render prop" example): the consumer's, not the trigger's.
  ignore: ["text-blue-700", "underline", "underline-offset-2"],
  children: [{ ours: "", pick: () => true, all: true, leaf: true }],
};
