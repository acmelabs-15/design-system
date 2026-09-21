// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const choiceboxItemCss = css`.tile {
  border-style: solid;
  border-width: 1px;
  border-color: var(--ds-gray-400);
  border-radius: .375rem;
  flex-direction: column;
  flex: 1;
  justify-content: flex-start;
  align-items: stretch;
  list-style-type: none;
  transition-property: color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --acme-gradient-from, --acme-gradient-via, --acme-gradient-to;
  transition-duration: .15s;
  transition-timing-function: cubic-bezier(.4, 0, 1, 1);
  animation-duration: .15s;
  animation-timing-function: cubic-bezier(.4, 0, 1, 1);
  display: flex;
  overflow: hidden;
}

:host {
  flex: 1;
}

.tile :where(.body) {
  flex-direction: column;
  flex: 1;
  justify-content: flex-start;
  align-items: stretch;
  display: flex;
}

.tile :where(.body) :where(.option) {
  flex-direction: row;
  align-items: center;
  padding: .75rem;
  display: flex;
}

.tile :where(.body) :where(.option) :where(.text) {
  flex-direction: column;
  justify-content: flex-start;
  align-self: flex-start;
  align-items: stretch;
  gap: .25rem;
  display: flex;
}

.tile:where(:not(.open)) :where(.body) :where(.option) {
  height: 100%;
}

.tile:where(.start) :where(.body) :where(.option) :where(.text) {
  flex: 1;
}

.tile :where(acme-tooltip) {
  border-radius: inherit;
  flex: 1;
  align-self: stretch;
}

.tile:where(:not(.start)) :where(.body) :where(.option) :where(.text) {
  flex: 0 auto;
}

.tile :where(.panel) {
  cursor: auto;
}

.tile:where([data-disabled]), .tile:where([data-disabled]) :where(.body) {
  cursor: not-allowed;
}

.tile:where(:not([data-disabled])), .tile:where(:not([data-disabled])) :where(.body) {
  cursor: pointer;
}

.tile:where(:not(.start)) :where(.body) :where(.option) {
  justify-content: space-between;
  gap: 1.5rem;
}

.tile:where(.start) :where(.body) :where(.option) {
  gap: .75rem;
}

.tile:where(:not([data-disabled]).open) :where(.body) :where(.option) {
  border-bottom-style: solid;
  border-bottom-width: 1px;
  border-color: var(--ds-blue-600);
}

.tile :where(.body) :where(.option) :where(acme-checkbox)::part(box) {
  border-color: var(--ds-gray-500);
}

.tile :where(.body) :where(.option) :where(.text) :where(.title) {
  font-size: .875rem;
  line-height: 1.25rem;
  font-weight: var(--acme-font-weight-500);
}

.tile :where(.body) :where(.option) :where(.text) :where(.description) {
  color: var(--ds-gray-900);
  font-size: .875rem;
  line-height: 1.25rem;
}

.tile :where(.body) :where(.option) :where(acme-radio)::part(dot) {
  --radio-color: var(--ds-gray-500);
}

.tile[data-disabled] :where(.body) :where(.option) :where(.text) :where(.title), .tile[data-disabled] :where(.body) :where(.option) :where(.text) :where(.description) {
  color: var(--ds-gray-800);
}

.tile[data-checked] :where(.body) :where(.option) :where(acme-radio)::part(dot), .tile[data-active] :where(.body) :where(.option) :where(acme-radio)::part(dot) {
  --radio-color: var(--ds-blue-900);
}

.tile :where(.body) :where(.option) :where(acme-radio)::part(dot):after {
  content: "";
  transition-duration: .15s;
  transition-timing-function: cubic-bezier(.4, 0, 1, 1);
  animation-duration: .15s;
  animation-timing-function: cubic-bezier(.4, 0, 1, 1);
}

.tile :where(.body) :where(.option) :where(.text) :where(.description):empty {
  display: none;
}

.tile[data-checked]:not([data-disabled]) :where(.body) :where(.option) :where(.text) :where(.title), .tile[data-checked]:not([data-disabled]) :where(.body) :where(.option) :where(.text) :where(.description) {
  color: var(--ds-blue-900);
}

.tile:not([data-checked])[data-disabled] :where(.body) :where(.option) :where(acme-checkbox)::part(box) {
  border-color: var(--ds-gray-500);
}

.tile:not([data-checked])[data-disabled] :where(.body) :where(.option) :where(acme-radio)::part(dot) {
  background-color: var(--ds-gray-100);
}

.tile[data-checked][data-disabled] :where(.body) :where(.option) :where(acme-radio)::part(dot) {
  --radio-color: var(--ds-gray-900) !important;
}

.tile[data-checked] :where(.body) :where(.option) :where(acme-radio)::part(dot):after {
  content: "";
  scale: 1;
}

.tile[data-checked]:not([data-disabled]) {
  border-color: var(--ds-blue-600);
}

.tile[data-checked]:not([data-disabled]) :where(.body) :where(.option) {
  background-color: var(--ds-blue-100);
}

@media (hover: hover) {
  .tile[data-hover]:not([data-disabled]) {
    border-color: var(--ds-gray-500);
    background-color: var(--ds-gray-100);
  }
}

.tile[data-checked]:not([data-indeterminate]) :where(.body) :where(.option) :where(acme-checkbox)::part(box) {
  border-color: var(--ds-blue-900);
  background-color: var(--ds-blue-900);
}

.tile :where(.body) :where(.content) input[type="checkbox"][data-checked] + *, .tile :where(.panel) input[type="checkbox"][data-checked] + * {
  --checkbox-color: var(--ds-blue-900);
}

@media (hover: hover) {
  .tile:where(:not([data-disabled])):not([data-checked]):not([data-active]) :where(.body) :where(.option) :where(acme-radio)[data-hover]::part(dot) {
    background-color: var(--ds-gray-200);
    --radio-color: var(--ds-gray-900);
  }

  .tile:not([data-disabled]):not([data-checked])[data-hover] :where(.body) :where(.option) :where(acme-checkbox)::part(box) {
    border-color: var(--ds-gray-700);
    background-color: var(--ds-background-100);
  }
}

.tile:not([data-checked]):not([data-disabled])[data-focus] :where(.body) :where(.option) :where(acme-checkbox)::part(box) {
  background-color: var(--ds-gray-200);
}

@media (hover: hover) {
  .tile[data-hover][data-checked]:not([data-disabled]) {
    border-color: var(--ds-blue-600) !important;
  }

  .tile[data-hover][data-checked]:not([data-disabled]) :where(.body) :where(.option) {
    background-color: var(--ds-blue-200) !important;
  }
}

.tile[data-disabled][data-checked]:not([data-indeterminate]) :where(.body) :where(.option) :where(acme-checkbox)::part(box) {
  border-color: var(--ds-gray-600);
  background-color: var(--ds-gray-600);
}

@media (hover: hover) {
  .tile:not([data-checked]):not([data-active]):not([data-disabled]) :where(.body) :where(.option) :where(acme-radio)[data-hover]::part(dot) {
    background-color: var(--ds-background-100);
    --radio-color: var(--ds-gray-700);
  }
}
`;
