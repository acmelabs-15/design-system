// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const themeSwitcherOptionCss = css`.option :where(.control) :where(.sr) {
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

.option :where(input) {
  appearance: none;
  outline-style: none;
  margin: 0;
  padding: 0;
  position: absolute;
}

.option :where(.control) {
  background-image: none;
  border-radius: 2147483647px;
  justify-content: center;
  align-items: center;
  width: 2rem;
  height: 2rem;
  margin: 0;
  display: flex;
  position: relative;
}

.option :where(.control) :where(.icon) {
  z-index: 1;
  width: 1rem;
  height: 1rem;
  position: relative;
}

.option {
  height: 100%;
}

.option:where([data-disabled]) :where(.control) {
  cursor: not-allowed;
  color: var(--ds-gray-500);
}

.option:where(:not([data-disabled])) :where(.control) {
  cursor: pointer;
  color: var(--ds-gray-700);
}

.option:where(:not([data-disabled]))[data-checked] :where(.control) {
  background-color: var(--ds-background-100);
  color: var(--ds-gray-1000);
  box-shadow: 0 0 0 1px var(--ds-gray-400), 0 1px 2px 0 var(--ds-gray-alpha-100);
}

.option:where(:not([data-disabled]))[data-focus] :where(.control) {
  color: var(--ds-gray-1000);
  box-shadow: var(--ds-focus-ring);
}

@media (hover: hover) {
  .option:where(:not([data-disabled]))[data-hover] :where(.control) {
    color: var(--ds-gray-1000);
  }
}

.option :where(.control)[data-small] {
  width: 1.5rem;
  height: 1.5rem;
}

.option:where(:not([data-disabled]))[data-checked] :where(.control) svg, .option:where(:not([data-disabled]))[data-focus] :where(.control) svg {
  color: var(--accents-8) !important;
}
`;
