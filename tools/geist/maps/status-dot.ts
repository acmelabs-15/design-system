// Maps acme-status-dot (src/components/status-dot) to Geist StatusDot: the generator derives status-dot.styles.ts from this.
// The DELETED state is a synthesized example (sketch/status-dot.deleted.json) from the component's client code.
import { type GeistMap, has, type SpecNode } from "../gen";

export const geist: GeistMap = {
  page: "status-dot",
  component: "StatusDot",
  root: (n: SpecNode) => n.attrs["data-testid"] === "geistcn/status-dot",
  ours: ".status-dot",
  defaults: { state: "QUEUED" },
  props: {
    state: { BUILDING: ".building", READY: ".ready", ERROR: ".error", CANCELED: ".canceled", DELETED: ".deleted" },
  },
  children: [
    { ours: ".dot", pick: has("rounded-full") },
    { ours: ".label", pick: has("ml-2") },
  ],
};
