// Maps the trigger of acme-tooltip (src/components/tooltip) to Geist Tooltip's wrapper span: an
// inline flex box of fit height around the slotted content, focusable, and the anchor of the
// bubble. Its box rules are mirrored on the host, so a parent that lays the host out (a
// description's info slot, a progress stop) sees the reference's box. A second mapping of the element.
import type { GeistMap } from "../gen";

export const geist: GeistMap = {
  page: "tooltip",
  element: "tooltip",
  component: "Tooltip",
  root: (n) => n.attrs["data-testid"] === "legacy/tooltip-trigger",
  ours: ".trigger",
  host: { mirror: ["display", "height", "align-items"] },
  // The trigger's content is slotted: a plain span, or a composed element with rules of its own.
  children: [{ ours: "", pick: () => true, all: true, leaf: true }],
};
