// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const calendarStructureCss = css`:host {
  min-inline-size: 0;
  display: block;
}

[part="root"] {
  color: var(--ds-gray-1000);
  font-size: 14px;
  line-height: 20px;
}

[part="trigger"] {
  box-sizing: border-box;
  border: 1px solid var(--ds-gray-700);
  border-radius: var(--r-sm, 6px);
  background: var(--ds-background-100);
  min-block-size: 36px;
  inline-size: 100%;
  color: inherit;
  font: inherit;
  text-align: start;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: pointer;
  padding: 6px 12px;
  display: block;
  overflow: hidden;
}

[part="root"][data-size="small"] {
  font-size: 13px;
}

[data-size="small"] [part="trigger"] {
  min-block-size: 32px;
  padding-inline: 8px;
}

[part="trigger"]:focus-visible {
  box-shadow: var(--ds-focus-ring);
  outline: none;
}

[data-invalid="true"] [part="trigger"] {
  border-color: var(--warn-solid);
}

[part="trigger"]:disabled {
  background: var(--ds-gray-100);
  color: var(--ds-gray-700);
  cursor: not-allowed;
}

.calendar {
  box-sizing: border-box;
  background: var(--ds-background-100);
  inline-size: min(360px, 100vw - 16px);
  max-inline-size: 100%;
  color: var(--ds-gray-1000);
  font: inherit;
  border: 0;
  border-radius: 12px;
  padding: 16px;
}

dialog.calendar {
  inset: auto;
  left: var(--calendar-x, 0px);
  top: var(--calendar-y, 0px);
  max-inline-size: calc(100vw - 16px);
  max-block-size: var(--calendar-available-height, calc(100vh - 16px));
  box-shadow: var(--acme-shadow-5);
  opacity: var(--calendar-opacity, 1);
  margin: 0;
  position: fixed;
  overflow: auto;
}

dialog.calendar:not([open]) {
  display: none;
}

dialog.calendar::backdrop {
  background: none;
}

.calendar.inline {
  border: 1px solid var(--ds-gray-alpha-400);
}

.editors {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-block-end: 12px;
  display: grid;
}

.editors label {
  min-inline-size: 0;
  color: var(--ds-gray-900);
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  display: flex;
}

.editors input {
  box-sizing: border-box;
  min-block-size: 32px;
  inline-size: 100%;
  min-inline-size: 0;
  font: inherit;
  color: var(--ds-gray-1000);
  background: var(--ds-background-100);
  border: 1px solid var(--ds-gray-700);
  border-radius: 6px;
  padding: 4px 8px;
}

.editors input:focus-visible {
  box-shadow: var(--ds-focus-ring);
  outline: none;
}

.zone {
  color: var(--ds-gray-900);
  overflow-wrap: anywhere;
  margin: 0 0 12px;
  font-size: 12px;
}

.header {
  align-items: center;
  gap: 4px;
  margin-block-end: 8px;
  display: flex;
}

.header h2 {
  font-size: 14px;
  line-height: 20px;
  font-weight: var(--acme-font-weight-600);
  flex: 1;
  margin: 0;
}

.calendar button {
  min-block-size: 32px;
  color: inherit;
  font: inherit;
  cursor: pointer;
  background: none;
  border: 1px solid #0000;
  border-radius: 6px;
  padding: 4px 8px;
}

.calendar button:focus-visible {
  box-shadow: var(--ds-focus-ring);
  z-index: 1;
  outline: none;
  position: relative;
}

.calendar button:disabled, .editors input:disabled {
  color: var(--ds-gray-700);
  cursor: not-allowed;
}

.header button {
  min-inline-size: 32px;
}

[part="grid"] {
  table-layout: fixed;
  border-collapse: separate;
  border-spacing: 2px;
  inline-size: 100%;
}

[part="grid"] th {
  font-size: 12px;
  font-weight: var(--acme-font-weight-400);
  color: var(--ds-gray-900);
  padding: 2px 0;
}

[part="grid"] td {
  text-align: center;
  padding: 0;
}

.calendar [part="day"] {
  font-variant-numeric: tabular-nums;
  min-block-size: 36px;
  inline-size: 100%;
  min-inline-size: 28px;
  padding: 0;
}

[data-size="small"] [part="day"] {
  min-block-size: 32px;
}

[part="day"][data-outside] {
  color: var(--ds-gray-700);
}

[part="day"][aria-current="date"] {
  font-weight: var(--acme-font-weight-600);
  text-underline-offset: 3px;
  text-decoration: underline;
}

[part="day"][data-in-range] {
  background: var(--accent-weak);
  color: var(--ds-gray-1000);
}

[part="day"][data-selected] {
  background: var(--accent);
  color: var(--on-accent);
}

.actions, .presets {
  flex-wrap: wrap;
  gap: 8px;
  display: flex;
}

.presets {
  margin-block-end: 12px;
}

.presets button {
  border-color: var(--ds-gray-alpha-400);
}

.actions {
  justify-content: flex-end;
  margin-block-start: 12px;
}

.actions button:last-child {
  background: var(--accent);
  color: var(--on-accent);
}

.error {
  color: var(--warn-solid);
  margin: 12px 0 0;
  font-size: 13px;
}

@media (hover: hover) {
  .calendar button:hover:not(:disabled) {
    background: var(--ds-gray-alpha-100);
  }

  .calendar [data-selected]:hover:not(:disabled), .actions button:last-child:hover:not(:disabled) {
    background: var(--accent-hover);
  }
}

@media (forced-colors: active) {
  .calendar, [part="trigger"], .editors input {
    color: canvastext;
    background: canvas;
    border: 1px solid buttontext;
  }

  .calendar button:focus-visible, [part="trigger"]:focus-visible, .editors input:focus-visible {
    outline-offset: 2px;
    outline: 2px solid highlight;
  }

  .calendar [data-selected], .actions button:last-child {
    color: highlighttext;
    forced-color-adjust: none;
    background: highlight;
  }

  .calendar button:disabled, .editors input:disabled {
    color: graytext;
  }
}

.header button {
  place-items: center;
  display: grid;
}

:host(:dir(rtl)) .navigation-icon {
  transform: scaleX(-1);
}

[part="trigger"] {
  align-items: center;
  gap: 8px;
  display: flex;
}

.trigger-value {
  text-overflow: ellipsis;
  flex: 1;
  min-inline-size: 0;
  overflow: hidden;
}
`;
