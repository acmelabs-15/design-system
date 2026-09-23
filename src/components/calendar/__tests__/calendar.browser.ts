import { AcmeCalendarMonthIcon } from "../../../generated/icons/classes/calendar-month-icon";
customElements.define("acme-calendar-month-icon", AcmeCalendarMonthIcon);
import { AcmeChevronRightIcon } from "../../../generated/icons/classes/chevron-right-icon";
customElements.define("acme-chevron-right-icon", AcmeChevronRightIcon);
import { AcmeChevronLeftIcon } from "../../../generated/icons/classes/chevron-left-icon";
customElements.define("acme-chevron-left-icon", AcmeChevronLeftIcon);
import { AcmeCalendar } from "../calendar";
customElements.define("acme-calendar", AcmeCalendar);
document.body.innerHTML =
  '<form id="form"><label for="calendar">Deadline</label><acme-calendar id="calendar" value="2026-09-10" mode="single" show-time-input="false" name="date" locale="en-US" time-zone="UTC"></acme-calendar><button type="reset" id="reset">Reset</button><input id="after"></form><acme-calendar id="inline" mode="single" presentation="inline" show-time-input="false" aria-label="Schedule" locale="en-US" time-zone="UTC" value="2026-09-10"></acme-calendar>';
