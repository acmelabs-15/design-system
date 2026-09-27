import type { Doc } from "../../site";

export const doc: Doc = {
  id: "calendar",
  title: "Calendar",
  lede: "Choose a date or a range, with optional time editing and a named time zone.",
  tags: ["acme-calendar"],
  examples: [
    {
      h: "Date range",
      html: '<acme-field><span slot="label">Reporting period</span><acme-calendar show-time-input="false" value=\'{"start":"2026-09-10","end":"2026-09-15"}\'></acme-calendar></acme-field>',
    },
    { h: "Single date", html: '<acme-calendar aria-label="Deadline" mode="single" show-time-input="false" value="2026-09-22" clearable></acme-calendar>' },
    { h: "Date and time", html: '<acme-calendar aria-label="Meeting" mode="single" time-zone="America/Los_Angeles" value="2026-09-22T09:30:00-07:00"></acme-calendar>' },
    { h: "Inline", html: '<acme-calendar aria-label="Travel dates" presentation="inline" show-time-input="false" value=\'{"start":"2026-09-12","end":"2026-09-18"}\'></acme-calendar>' },
    { h: "Bounds", html: '<acme-calendar aria-label="September appointment" mode="single" show-time-input="false" min-value="2026-09-05" max-value="2026-09-25" value="2026-09-15"></acme-calendar>' },
    {
      h: "Presets",
      html: '<acme-calendar aria-label="Release period" show-time-input="false" presets=\'[{"label":"First week","value":{"start":"2026-09-01","end":"2026-09-07"}},{"label":"Release week","value":{"start":"2026-09-14","end":"2026-09-20"}}]\'></acme-calendar>',
    },
    {
      h: "Custom trigger and footer",
      html: '<acme-calendar aria-label="Maintenance window" show-time-input="false"><span slot="trigger">Choose maintenance dates</span><p slot="footer">Dates are provisional until you select Apply.</p></acme-calendar>',
    },
    { h: "Locale and direction", html: '<acme-calendar aria-label="موعد" locale="ar-SA" dir="rtl" mode="single" presentation="inline" show-time-input="false" value="2026-09-22"></acme-calendar>' },
    {
      h: "Native form",
      html: '<form id="calendar-form-example"><acme-field required><span slot="label">Booking dates</span><acme-calendar name="booking" required show-time-input="false" value=\'{"start":"2026-09-10","end":"2026-09-12"}\'></acme-calendar><span slot="help">A complete range is required.</span></acme-field><acme-button type="submit">Read dates</acme-button><acme-button type="reset" variant="secondary">Reset</acme-button><output></output></form>',
      script: 'root.querySelector("form").addEventListener("submit",event=>{event.preventDefault();root.querySelector("output").textContent=new FormData(event.currentTarget).get("booking");});',
    },
  ],
  practices: {
    Values: [
      "Use a scalar ISO string for single mode and an object with start and optional end for range mode. HTML range values and presets use validated JSON; Lit and React pass actual objects.",
      "With showTimeInput=false, values are civil dates such as 2026-09-22. With time editing enabled, values include an explicit UTC offset. Changing timeZone preserves an existing timestamp's instant.",
      "A range may be incomplete while you choose its end. Required ranges must be complete. Native form data contains one scalar ISO string or one JSON range entry.",
      "The grid uses Gregorian dates. Locale controls labels, number formatting and the start of the week. Native date/time editor presentation follows the browser.",
    ],
    Behavior: [
      "Arrow keys move by day or week. Home and End use locale week boundaries. Page Up/Down moves by month; Shift with Page Up/Down moves by year. Horizontal arrows follow direction.",
      "acme-input reports provisional edits; acme-change reports a committed change. Single date-only selection commits directly. Ranges and time edits use Apply. Programmatic values, reset and restoration stay silent.",
      "Nonexistent local times produce an error. Repeated local times retain a valid existing offset; otherwise the earlier occurrence is selected.",
      "The popup uses a native modal dialog with contained focus. Escape closes it and restores focus. Inline presentation does not trap page focus. Closing does not roll back provisional selection.",
      "Use Field, a native label or an accessible name. Custom trigger content stays inside the component's native button; keep that content noninteractive.",
    ],
  },
};
