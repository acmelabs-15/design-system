// Docs page: Calendar — mirrors https://vercel.com/geist/calendar
import type { Doc } from "../../site";

const presets = `{"last-3-days":{"text":"Last 3 Days","days":3},"last-7-days":{"text":"Last 7 Days","weeks":1},"last-14-days":{"text":"Last 14 Days","weeks":2},"last-month":{"text":"Last Month","months":1}}`;
const center = (inner: string) => `<div style="display:flex;justify-content:center;padding:48px 0">${inner}</div>`;
// Two months either side of today, as Geist computes with date-fns.
const bounds = `const iso = (d) => d.toLocaleDateString('en-CA');
const now = new Date();
for (const c of root.querySelectorAll('acme-calendar[allow-clear]')) {
  c.minValue = iso(new Date(now.getFullYear(), now.getMonth() - 2, now.getDate()));
  c.maxValue = iso(new Date(now.getFullYear(), now.getMonth() + 2, now.getDate()));
}`;
const sizeRow = (size: string) =>
  `<div class="row" style="gap:16px 16px;row-gap:48px;align-items:flex-start"><acme-calendar allow-clear${size}></acme-calendar><acme-calendar allow-clear compact${size} presets='${presets}'></acme-calendar><acme-calendar allow-clear stacked${size} presets='${presets}'></acme-calendar><acme-calendar${size} presets='${presets}'></acme-calendar></div>`;

export const doc: Doc = {
  id: "calendar",
  title: "Calendar",
  lede: "A calendar from which the user picks a date or a range of dates.",
  tags: ["acme-calendar"],
  examples: [
    {
      h: "Default",
      html: center(`<acme-calendar allow-clear></acme-calendar>`),
      script: bounds,
    },
    {
      h: "Horizontal Layout",
      p: "horizontal-layout lays the form and the month grid side by side inside the popover.",
      html: center(`<acme-calendar allow-clear horizontal-layout show-time-input="false" popover-alignment="center"></acme-calendar>`),
    },
    {
      h: "Sizes",
      p: "medium (the default) or small.",
      html: `<div class="vstack" style="gap:48px;padding:48px 0"><div><p style="font-family:var(--mono);font-size:14px;line-height:20px;color:var(--ds-gray-900);margin-bottom:16px">small</p>${sizeRow(' size="small"')}</div><div><p style="font-family:var(--mono);font-size:14px;line-height:20px;color:var(--ds-gray-900);margin-bottom:16px">default / medium</p>${sizeRow("")}</div></div>`,
      script: bounds,
    },
    {
      h: "Presets",
      p: "Common ranges as buttons.",
      html: center(`<acme-calendar presets='${presets}'></acme-calendar>`),
    },
    {
      h: "Compact",
      html: center(`<acme-calendar compact presets='${presets}'></acme-calendar>`),
    },
    {
      h: "Stacked",
      html: center(`<acme-calendar presets='${presets}' stacked></acme-calendar>`),
    },
    {
      h: "Presets with default value",
      p: "Common ranges, with one of them selected from the start.",
      html: center(`<acme-calendar preset-index="2" presets='${presets}' stacked></acme-calendar>`),
    },
    {
      h: "Min and max dates",
      p: "The earliest and latest dates the user can pick.",
      html: center(`<acme-calendar></acme-calendar>`),
      script: `const iso = (d) => d.toLocaleDateString('en-CA');
const c = root.querySelector('acme-calendar');
c.minValue = iso(new Date(Date.now() - 864e5)); // yesterday
c.maxValue = iso(new Date(Date.now() + 864e5)); // tomorrow`,
    },
    {
      h: "Pinned timezone",
      p: "pinned-timezone locks the calendar to one timezone. It shows as read-only text instead of a select.",
      html: center(`<acme-calendar pinned-timezone="America/Los_Angeles" popover-alignment="center"></acme-calendar>`),
    },
  ],
  practices: {
    "When to use": [
      "Analytics ranges, and any picker where the day of the week and the month matter.",
      "For an ISO date pasted whole, or shorthand like 7d, use a free-form Input.",
      "Give presets for the common ranges (Last 7 Days, Month to Date) so the user lands on the right window in one click.",
      "Pair the horizontal layout with live results next to the calendar; in a narrow surface such as a sidebar, use the stacked layout.",
    ],
    Behavior: [
      "Set min-value and max-value to the data window so nobody picks outside the retention range.",
      "Default to the user's locale and timezone; never show UTC to a US-Pacific viewer without saying so.",
      "The trigger label is the chosen range (Apr 1 – Apr 28, 2026); once a value is set, it never falls back to Pick a date.",
      "The range stays when the popover closes and opens again, so the user can change the end date without picking the start again.",
    ],
    Accessibility: [
      "Focus stays inside the popover: Tab cycles the day cells and the presets, not the page behind.",
      "Arrow keys move by day, Shift + arrow by week, Page Up and Page Down by month.",
      "A polite live region announces the range (From Apr 1 to Apr 28) after the second click.",
      "Each preset is a real button with a Title Case label (Last 30 Days), not a menu item without keyboard handling.",
    ],
  },
};
