// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const checkboxCss = css`.checkbox :where(.control) :where(input) {
  clip-path: inset(50%);
  white-space: nowrap;
  border-width: 0;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  position: absolute;
  overflow: hidden;
}

.checkbox :where(.control) {
  align-items: center;
  margin: -.125rem;
  padding: .125rem;
  display: flex;
  position: relative;
}

.checkbox :where(.control) :where(.box) {
  border-style: solid;
  border-width: 1px;
  border-color: var(--ds-gray-700);
  background-color: var(--ds-background-100);
  --checkbox-color: var(--ds-gray-700);
  border-radius: .25rem;
  justify-content: center;
  align-items: center;
  width: 1rem;
  height: 1rem;
  transition-property: all;
  transition-duration: .2s;
  transition-timing-function: cubic-bezier(.4, 0, .2, 1);
  animation-duration: .2s;
  display: inline-flex;
  position: relative;
  rotate: .000001deg;
}

.checkbox :where(.text) {
  margin-left: .5rem;
}

.checkbox {
  align-items: flex-start;
  font-size: 13px;
  display: inline-flex;
}

.checkbox:where([data-disabled]) {
  cursor: not-allowed;
  color: var(--ds-gray-500);
}

.checkbox:where(:not([data-disabled])) {
  cursor: pointer;
}

.checkbox :where(.control) :where(.box) :where(svg) :where(line) {
  stroke: var(--checkbox-color);
}

.checkbox :where(.control) :where(.box) :where(svg) :where(path) {
  stroke: var(--acme-background);
}

.checkbox[data-focus] :where(.control) :where(.box) {
  box-shadow: var(--ds-focus-ring);
}

.checkbox:where([data-indeterminate]) :where(.control) :where(.box) svg line {
  visibility: visible;
}

.checkbox:where([data-indeterminate]) :where(.control) :where(.box) svg path, .checkbox:not([data-indeterminate]) :where(.control) :where(.box) svg line, .checkbox:not([data-indeterminate]) :where(.control) :where(.box) svg path {
  visibility: hidden;
}

.checkbox:not([data-checked])[data-disabled] :where(.control) :where(.box) {
  border-color: var(--ds-gray-500);
  background-color: var(--ds-gray-100);
}

.checkbox[data-checked]:not([data-indeterminate]) :where(.control) :where(.box) {
  border-color: var(--ds-gray-1000);
  background-color: var(--ds-gray-1000);
}

.checkbox:where([data-indeterminate])[data-disabled] :where(.control) :where(.box) svg line {
  stroke: var(--ds-gray-500);
}

.checkbox[data-checked]:not([data-indeterminate]) :where(.control) :where(.box) svg path {
  visibility: visible;
}

@media (hover: hover) {
  .checkbox:not([data-disabled]):not([data-checked])[data-hover] :where(.control) :where(.box) {
    background-color: var(--ds-gray-200);
  }
}

.checkbox:not([data-checked]):not([data-disabled])[data-focus] :where(.control) :where(.box) {
  background-color: var(--ds-gray-200);
}

.checkbox[data-disabled][data-checked]:not([data-indeterminate]) :where(.control) :where(.box) {
  border-color: var(--ds-gray-600);
  background-color: var(--ds-gray-600);
}
`;
