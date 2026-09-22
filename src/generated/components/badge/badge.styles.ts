// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const badgeCss = css`.badge :where(.label) {
  align-items: center;
  gap: inherit;
  min-width: 0;
  display: inline-flex;
  position: relative;
}

.badge {
  font-weight: var(--acme-font-weight-500);
  white-space: nowrap;
  text-transform: capitalize;
  font-variant-numeric: tabular-nums;
  border-radius: 2147483647px;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  padding-block: .125rem;
  display: inline-flex;
}

.badge:where(.sm) {
  letter-spacing: .2px;
  gap: .25rem;
  height: 1.25rem;
  padding-inline: .5rem;
  font-size: 11px;
  line-height: 20px;
}

.badge:where(:not(.sm, .lg)) {
  gap: .3125rem;
  height: 1.5rem;
  font-size: 12px;
  line-height: 24px;
}

.badge:where(.lg) {
  height: 2rem;
  font-size: .875rem;
  line-height: calc(1.25 / .875);
  gap: .375rem;
}

.badge:where(.amber:not(.subtle)) {
  background-color: var(--ds-amber-700);
  color: var(--ds-black);
}

.badge:where(.blue:not(.subtle)) {
  background-color: var(--ds-blue-800);
}

.badge:where(:not(.blue, .purple, .amber, .red, .pink, .green, .teal, .inverted, .trial, .turbo):not(.subtle)) {
  background-color: var(--ds-gray-900);
}

.badge:where(.inverted) {
  background-color: var(--ds-gray-1000);
  color: var(--ds-gray-100);
}

.badge:where(.green:not(.subtle)) {
  background-color: var(--ds-green-900);
}

.badge:where(.pink:not(.subtle)) {
  background-color: var(--ds-pink-900);
}

.badge:where(.purple:not(.subtle)) {
  background-color: var(--ds-purple-900);
}

.badge:where(.red:not(.subtle)) {
  background-color: var(--ds-red-900);
}

.badge:where(.teal:not(.subtle)) {
  background-color: var(--ds-teal-900);
}

.badge:where(:is(.trial, .turbo)) {
  background-color: var(--ds-black);
  color: var(--ds-white);
}

.badge:where(.subtle) {
  background-color: #0000;
  position: relative;
}

.badge:where(.trial) {
  background-image: linear-gradient(135deg, #0070f3, #f81ce5);
}

.badge:where(.turbo) {
  background-image: linear-gradient(135deg, #ff1e56, #0096ff);
}

.badge:where(:not(.sm)) {
  letter-spacing: 0;
  padding-inline: .75rem;
}

.badge:where(.amber.subtle) {
  color: var(--ds-amber-900);
}

.badge:where(.blue.subtle) {
  color: var(--ds-blue-900);
}

.badge:where(:not(.amber, .inverted, .trial, .turbo):not(.subtle)) {
  color: var(--ds-contrast-fg);
}

.badge:where(:not(.blue, .purple, .amber, .red, .pink, .green, .teal).subtle) {
  color: var(--ds-gray-1000);
}

.badge:where(.green.subtle) {
  color: var(--ds-green-900);
}

.badge:where(.pink.subtle) {
  color: var(--ds-pink-900);
}

.badge:where(.purple.subtle) {
  color: var(--ds-purple-900);
}

.badge:where(.red.subtle) {
  color: var(--ds-red-900);
}

.badge:where(.teal.subtle) {
  color: var(--ds-teal-900);
}

:where(:host([data-dark])) .badge:where(:not(.blue, .purple, .amber, .red, .pink, .green, .teal, .inverted, .trial, .turbo):not(.subtle)) {
  background-color: var(--ds-gray-500);
}

:where(:host([data-dark])) .badge:where(.green:not(.subtle)) {
  background-color: var(--ds-green-600);
}

:where(:host([data-dark])) .badge:where(.pink:not(.subtle)) {
  background-color: var(--ds-pink-600);
}

:where(:host([data-dark])) .badge:where(.purple:not(.subtle)) {
  background-color: var(--ds-purple-500);
}

:where(:host([data-dark])) .badge:where(.red:not(.subtle)) {
  background-color: var(--ds-red-800);
}

:where(:host([data-dark])) .badge:where(.teal:not(.subtle)) {
  background-color: var(--ds-teal-600);
}

.badge:where(.amber.subtle):before {
  content: "";
  background-color: oklch(from var(--ds-amber-200) .94 calc(c * 1.3) h);
}

.badge:where(.blue.subtle):before {
  content: "";
  background-color: oklch(from var(--ds-blue-200) .94 calc(c * 1.3) h);
}

.badge:where(:not(.blue, .purple, .amber, .red, .pink, .green, .teal).subtle):before {
  content: "";
  background-color: oklch(from var(--ds-gray-200) .94 c h);
}

.badge:where(.green.subtle):before {
  content: "";
  background-color: oklch(from var(--ds-green-200) .94 calc(c * 1.3) h);
}

.badge:where(.pink.subtle):before {
  content: "";
  background-color: oklch(from var(--ds-pink-300) .94 calc(c * 1.3) h);
}

.badge:where(.purple.subtle):before {
  content: "";
  background-color: oklch(from var(--ds-purple-200) .94 calc(c * 1.3) h);
}

.badge:where(.red.subtle):before {
  content: "";
  background-color: oklch(from var(--ds-red-200) .94 calc(c * 1.3) h);
}

.badge:where(.teal.subtle):before {
  content: "";
  background-color: oklch(from var(--ds-teal-300) .94 calc(c * 1.3) h);
}

.badge:where(.subtle):before {
  content: "";
  pointer-events: none;
  mix-blend-mode: multiply;
  border-radius: 2147483647px;
  position: absolute;
  inset: 0;
}

.badge:where(.sm) slot::slotted([slot="start"]), .badge:where(.sm) slot > [slot="start"] {
  width: .75rem !important;
  height: .75rem !important;
  margin-left: -.125rem !important;
}

.badge:where(:not(.sm, .lg)) slot::slotted([slot="start"]), .badge:where(:not(.sm, .lg)) slot > [slot="start"] {
  width: .875rem !important;
  height: .875rem !important;
  margin-left: -.25rem !important;
}

.badge slot::slotted([slot="start"]), .badge slot > [slot="start"] {
  flex-shrink: 0 !important;
  display: block !important;
  -webkit-transform: translate(0) !important;
}

.badge:where(.lg) slot::slotted([slot="start"]), .badge:where(.lg) slot > [slot="start"] {
  width: 1rem !important;
  height: 1rem !important;
}

:where(:host([data-dark])) .badge:where(.amber.subtle):before {
  content: "";
  background-color: oklch(from var(--ds-amber-200) .27 calc(c * 1.3) h);
}

:where(:host([data-dark])) .badge:where(.blue.subtle):before {
  content: "";
  background-color: oklch(from var(--ds-blue-200) .27 calc(c * 1.3) h);
}

:where(:host([data-dark])) .badge:where(:not(.blue, .purple, .amber, .red, .pink, .green, .teal).subtle):before {
  content: "";
  background-color: oklch(from var(--ds-gray-200) .27 c h);
}

:where(:host([data-dark])) .badge:where(.green.subtle):before {
  content: "";
  background-color: oklch(from var(--ds-green-200) .27 calc(c * 1.3) h);
}

:where(:host([data-dark])) .badge:where(.pink.subtle):before {
  content: "";
  background-color: oklch(from var(--ds-pink-300) .27 calc(c * 1.3) h);
}

:where(:host([data-dark])) .badge:where(.purple.subtle):before {
  content: "";
  background-color: oklch(from var(--ds-purple-200) .27 calc(c * 1.3) h);
}

:where(:host([data-dark])) .badge:where(.red.subtle):before {
  content: "";
  background-color: oklch(from var(--ds-red-200) .27 calc(c * 1.3) h);
}

:where(:host([data-dark])) .badge:where(.teal.subtle):before {
  content: "";
  background-color: oklch(from var(--ds-teal-300) .27 calc(c * 1.3) h);
}

:where(:host([data-dark])) .badge:where(.subtle):before {
  content: "";
  mix-blend-mode: screen;
}

.badge:where(:is(.sm, .lg)) slot::slotted([slot="start"][data-glyph="circular"]), .badge:where(:is(.sm, .lg)) slot > [slot="start"][data-glyph="circular"] {
  margin-left: -.25rem !important;
}

.badge:where(:not(.sm, .lg)) slot::slotted([slot="start"][data-glyph="circular"]), .badge:where(:not(.sm, .lg)) slot > [slot="start"][data-glyph="circular"] {
  margin-left: -.4375rem !important;
}
`;
