import type { Doc } from "../../site";
export const doc: Doc = {
  id: "relative-time",
  title: "Relative Time",
  tags: ["acme-relative-time"],
  lede: "A localized elapsed-time phrase with a native absolute datetime. It adds no popup or focus behavior.",
  examples: [
    { h: "Past and future", html: '<acme-relative-time date="2026-09-21T12:00:00Z"></acme-relative-time>', script: 'root.querySelector("acme-relative-time").date = Date.now() - 120000;' },
    { h: "Absolute date input", html: '<acme-relative-time date="2026-09-21T12:00:00Z" auto-update="false"></acme-relative-time>' },
    {
      h: "Numeric wording",
      html: '<acme-relative-time date="2026-09-21T13:00:00Z" numeric="always" format="short"></acme-relative-time>',
      script: 'root.querySelector("acme-relative-time").date = Date.now() + 3600000;',
    },
  ],
  practices: {
    "Use explicit instants": [
      "date accepts an ISO date/timestamp, Date or epoch milliseconds. Valid inputs normalize to an owned epoch value; zero is valid.",
      "Date-only strings mean UTC midnight. Timestamp strings require an explicit offset; ambiguous locale strings are rejected.",
      "Months and years use approximate elapsed durations. Numeric auto uses the locale’s relative wording.",
      "autoUpdate defaults to true and schedules the next rounded-value or unit boundary. Use auto-update=false to stop automatic refresh.",
      "format selects long, short or narrow wording. Native style remains available for CSS.",
    ],
  },
};
