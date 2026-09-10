// Maps the card content of acme-relative-time (src/components/relative-time) to Geist
// RelativeTimeCard's content: what the component adds inside the context card it composes (the
// overlay, the shell, the stem and the padded box are the context card's own, maps/context-card.ts).
// A column at least 300px wide with a 12px gap: the full age (up to three units, `tabular-nums`, 13px,
// gray-900) in its own column, then the zone rows 8px apart, each a row with the zone at its start (a
// 16px chip on gray-200 with a 2px radius holding the zone's abbreviation in 12px monospace, then the
// date at 13px) and the clock time (12px monospace, tabular figures) at its end. A client-only state
// drawn from the component's class strings (tools/geist/sketch/relative-time-card.open.json); the
// trigger wrapper and the plain trigger label have mappings of their own.
import type { GeistMap } from "../gen";

const div = (c: { tag: string }) => c.tag === "div";
const span = (c: { tag: string }) => c.tag === "span";
export const geist: GeistMap = {
  page: "relative-time-card",
  element: "relative-time",
  component: "RelativeTimeCard",
  root: (n) => n.tag === "div" && n.styles.some((s) => s.cls === "min-w-[300px]"),
  ours: ".content",
  skip: ["Default", "Plain"],
  children: [
    { ours: ".ago", pick: 0, children: [{ ours: ".age", pick: span }] },
    {
      ours: ".rows",
      pick: 1,
      children: [
        {
          ours: ".row",
          pick: div,
          all: true,
          children: [
            { ours: ".place", pick: div, children: [{ ours: ".chip", pick: div, children: [{ ours: ".abbr", pick: span }] }, { ours: ".date", pick: span }] },
            { ours: ".clock", pick: span },
          ],
        },
      ],
    },
  ],
};
