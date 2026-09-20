// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const barRowsStructureCss = css`:host {
  flex-direction: column;
  display: flex;
}

:host([lined]) ::slotted(acme-bar-row) {
  border-bottom: 1px solid var(--hair);
}

:host([lined]) ::slotted(acme-bar-row:last-child) {
  border-bottom: 0;
}
`;
