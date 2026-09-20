// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const calendarStructureCss = css`:host {
  display: inline-block;
  position: relative;
}

.calendar {
  display: none;
}

:host([open]) .calendar {
  display: flex;
}

:host([static]) .calendar {
  display: flex;
  position: static;
}

.field {
  margin: 0;
}

.cal-trigger {
  gap: 8px;
}
`;
