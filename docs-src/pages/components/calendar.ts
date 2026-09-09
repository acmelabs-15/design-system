// Docs page: Calendar — mirrors https://vercel.com/geist/calendar
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "calendar",
  title: "Calendar",
  lede: "Select a date or a range from a calendar behind a button.",
  tags: ["acme-calendar"],
  examples: [
    {
      h: "Range",
      p: "The trigger is a secondary button labelled with the chosen range; the popover holds the range form and the month grid. Shown static here.",
      html: `<acme-calendar static range value="2026-09-08" end="2026-09-12"></acme-calendar>`,
    },
    {
      h: "Single date",
      html: `<acme-calendar static value="2026-09-15"></acme-calendar>`,
    },
    {
      h: "Presets",
      p: "Real buttons for the common ranges.",
      html: `<acme-calendar static range presets='[{"label":"Last 7 Days","days":7},{"label":"Last 30 Days","days":30},{"label":"Month to Date","days":9}]'></acme-calendar>`,
    },
    {
      h: "Closed",
      p: "Without static, the calendar opens from the button and closes on Escape or a pick.",
      html: `<acme-calendar value="2026-09-15" min="2026-01-01"></acme-calendar>`,
    },
  ],
  practices: {
    Behavior: ["Min and max bound the retention window; the timezone can be pinned; Apply commits the range."],
    Content: ["Presets are Title Case (Last 7 Days, Month to Date); the trigger reads the chosen range."],
  },
};
