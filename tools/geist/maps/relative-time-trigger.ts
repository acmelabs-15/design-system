// Maps the trigger of acme-relative-time (src/components/relative-time) to the wrapper Geist
// RelativeTimeCard takes from the context card it composes: an inline flex box that shrinks but never
// grows, in our tree the trigger part of the composed acme-context-card, whose own module carries the
// wrapper's rules (maps/context-card-trigger.ts) and mirrors its layout on its own host. This
// element's host is one box further out, the parent's item: the same layout is mirrored on it here,
// so a row that lays the element out sees the reference's box. A third mapping of the element.
import { type GeistMap, has } from "../gen";

export const geist: GeistMap = {
  page: "relative-time-card",
  element: "relative-time",
  component: "RelativeTimeCard",
  root: (n) => n.tag === "div" && has("flex-[0_1_auto]")(n) && has("cursor-pointer")(n),
  ours: "acme-context-card",
  part: "trigger",
  extends: "context-card-trigger",
  host: { mirror: ["display", "flex"] },
  // The wrapper's content is slotted: the plain label, or a composed element with rules of its own.
  children: [{ ours: "", pick: () => true, all: true, leaf: true }],
};
