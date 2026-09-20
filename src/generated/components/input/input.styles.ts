// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const inputCss = css`.wrap :where(input) {
  appearance: none;
  background-color: var(--ds-background-100);
  width: 100%;
  min-width: 0;
  color: var(--acme-foreground);
  border-style: none;
  outline-style: none;
  order: 1;
  display: inline-flex;
}

.wrap:where(.rounded) {
  border-radius: 2147483647px;
  margin-top: .75rem;
}

.wrap {
  max-width: 100%;
  font-weight: 400;
  transition-property: all;
  transition-duration: .15s;
  transition-timing-function: cubic-bezier(.4, 0, .2, 1);
  animation-duration: .15s;
  display: flex;
  overflow: hidden;
}

.wrap:where(.lg) {
  border-radius: .5rem;
}

.wrap:where(:not(.lg):not(.rounded)) {
  border-radius: .375rem;
}

.wrap:where(:not(.lg)) {
  font-size: .875rem;
  line-height: calc(1.25 / .875);
}

.wrap:where(:not(.error)) {
  box-shadow: 0 0 0 1px var(--ds-gray-alpha-400);
}

.wrap:where(.error) {
  box-shadow: 0 0 0 1px var(--ds-red-900), 0 0 0 4px var(--ds-red-300);
}

.wrap :where(input)::-webkit-search-decoration {
  -webkit-appearance: none;
}

.wrap :where(input)::-webkit-search-cancel-button {
  -webkit-appearance: none;
}

.wrap :where(input)::-webkit-search-results-button {
  -webkit-appearance: none;
}

.wrap :where(input)::-webkit-search-results-decoration {
  -webkit-appearance: none;
}

.wrap :where(input)::-webkit-inner-spin-button {
  appearance: none;
}

.wrap :where(input)::-webkit-outer-spin-button {
  appearance: none;
}

.wrap:where(.lg) > input {
  height: var(--ds-size-large);
  font-size: 1rem;
  line-height: 1.5;
}

.wrap:where(:not(.sm, .lg)) > input {
  height: var(--ds-size-medium);
}

.wrap:where(.sm) > input {
  height: 2rem;
}

.wrap:where(.rounded) > input {
  border-radius: 2147483647px;
}

.wrap:where(.has-start) > input {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.wrap:where(.has-end) > input {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.wrap > input {
  padding-inline: .75rem;
}

.wrap :where(.start) > slot::slotted(svg), .wrap :where(.start) > slot > svg, .wrap :where(.end) > slot::slotted(svg), .wrap :where(.end) > slot > svg {
  width: var(--ds-control-decoration-size) !important;
  height: var(--ds-control-decoration-size) !important;
}

@media (hover: hover) {
  .wrap:where(:not(.error))[data-hover] {
    box-shadow: 0 0 0 1px var(--ds-gray-alpha-500);
  }

  .wrap:where(.error)[data-hover] {
    box-shadow: 0 0 0 1px var(--ds-red-900), 0 0 0 4px var(--ds-red-500);
  }
}

.wrap :where(input):focus {
  outline-style: none;
}

.wrap :where(input):disabled {
  cursor: not-allowed;
  background-color: var(--ds-gray-100);
  color: var(--ds-gray-700);
  opacity: 1;
  -webkit-text-fill-color: var(--accents-3);
}

.wrap:where(:not(.error))[data-focus] {
  box-shadow: 0 0 0 1px var(--ds-gray-alpha-600), 0 0 0 4px #00000029 !important;
}

.wrap:where(.error)[data-focus] {
  box-shadow: 0 0 0 1px var(--ds-red-900), 0 0 0 4px var(--ds-red-300);
}

:where(:host([data-dark])) .wrap:where(:not(.error))[data-focus] {
  box-shadow: 0 0 0 1px var(--ds-gray-alpha-600), 0 0 0 4px #ffffff3d !important;
}

.wrap:where(.has-end) > :last-child:where(:not(slot)) {
  border-color: var(--ds-gray-alpha-400);
  color: var(--ds-gray-700);
  flex-shrink: 0;
  order: 2;
  align-items: center;
  padding-block: 0;
  padding-inline: .75rem;
  display: flex;
  position: relative;
}

.wrap:where(.has-end) > slot:last-child::slotted(*), .wrap:where(.has-end) > slot:last-child > * {
  border-color: var(--ds-gray-alpha-400) !important;
  color: var(--ds-gray-700) !important;
  flex-shrink: 0 !important;
  order: 2 !important;
  align-items: center !important;
  padding-block: 0 !important;
  padding-inline: .75rem !important;
  display: flex !important;
  position: relative !important;
}

.wrap:where(.has-end:not(.end-inside)) > :last-child:where(:not(slot)) {
  background-color: var(--ds-background-200);
  border-left-style: solid;
  border-left-width: 1px;
}

.wrap:where(.has-end:not(.end-inside)) > slot:last-child::slotted(*), .wrap:where(.has-end:not(.end-inside)) > slot:last-child > * {
  background-color: var(--ds-background-200) !important;
  border-left-style: solid !important;
  border-left-width: 1px !important;
}

.wrap:where(.end-inside) > :last-child:where(:not(slot)) {
  background-color: var(--ds-background-100);
  border-left-style: solid;
  border-left-width: 0;
}

.wrap:where(.end-inside) > slot:last-child::slotted(*), .wrap:where(.end-inside) > slot:last-child > * {
  background-color: var(--ds-background-100) !important;
  border-left-style: solid !important;
  border-left-width: 0 !important;
}

.wrap:where(.clearable) > :last-child:where(:not(slot)) {
  padding-right: 0;
}

.wrap:where(.clearable) > slot:last-child::slotted(*), .wrap:where(.clearable) > slot:last-child > * {
  padding-right: 0 !important;
}

.wrap:where(.has-start) > :nth-child(2):where(:not(slot)) {
  border-color: var(--ds-gray-alpha-400);
  color: var(--ds-gray-700);
  flex-shrink: 0;
  order: 0;
  align-items: center;
  padding-block: 0;
  padding-inline: .75rem;
  display: flex;
  position: relative;
}

.wrap:where(.has-start) > slot:nth-child(2)::slotted(*), .wrap:where(.has-start) > slot:nth-child(2) > * {
  border-color: var(--ds-gray-alpha-400) !important;
  color: var(--ds-gray-700) !important;
  flex-shrink: 0 !important;
  order: 0 !important;
  align-items: center !important;
  padding-block: 0 !important;
  padding-inline: .75rem !important;
  display: flex !important;
  position: relative !important;
}

.wrap:where(.start-inside) > :nth-child(2):where(:not(slot)) {
  background-color: var(--ds-background-100);
  border-right-style: solid;
  border-right-width: 0;
  margin-right: -.75rem;
}

.wrap:where(.start-inside) > slot:nth-child(2)::slotted(*), .wrap:where(.start-inside) > slot:nth-child(2) > * {
  background-color: var(--ds-background-100) !important;
  border-right-style: solid !important;
  border-right-width: 0 !important;
  margin-right: -.75rem !important;
}

.wrap:where(.has-start:not(.start-inside)) > :nth-child(2):where(:not(slot)) {
  background-color: var(--ds-background-200);
  border-right-style: solid;
  border-right-width: 1px;
}

.wrap:where(.has-start:not(.start-inside)) > slot:nth-child(2)::slotted(*), .wrap:where(.has-start:not(.start-inside)) > slot:nth-child(2) > * {
  background-color: var(--ds-background-200) !important;
  border-right-style: solid !important;
  border-right-width: 1px !important;
}

.wrap :where(input):disabled::placeholder {
  color: var(--accents-3);
}

.wrap:where(.has-start) > :first-child:not([disabled]), .wrap:where(:not(.has-start).has-end) > :first-child:not([disabled]) {
  color: var(--themed-fg);
}

@media (hover: hover) {
  .wrap:where(:not(.error))[data-hover]:has(input:disabled) {
    box-shadow: 0 0 0 1px var(--ds-gray-alpha-400);
  }
}

.wrap:where(.end-inside):has(input:disabled) > :last-child:where(:not(slot)) {
  cursor: not-allowed;
  background-color: var(--ds-gray-100);
}

.wrap:where(.end-inside):has(input:disabled) > slot:last-child::slotted(*), .wrap:where(.end-inside):has(input:disabled) > slot:last-child > * {
  cursor: not-allowed !important;
  background-color: var(--ds-gray-100) !important;
}

.wrap:where(.start-inside):has(input:disabled) > :nth-child(2):where(:not(slot)) {
  cursor: not-allowed;
  background-color: var(--ds-gray-100);
}

.wrap:where(.start-inside):has(input:disabled) > slot:nth-child(2)::slotted(*), .wrap:where(.start-inside):has(input:disabled) > slot:nth-child(2) > * {
  cursor: not-allowed !important;
  background-color: var(--ds-gray-100) !important;
}

@media (hover: hover) {
  .wrap:where(:not(.error))[data-hover]:has(textarea:disabled) {
    box-shadow: 0 0 0 1px var(--ds-gray-alpha-400);
  }

  .wrap:where(.has-end)[data-hover]:not(:has(input:disabled)) > .end {
    color: var(--ds-gray-1000);
  }
}
`;
