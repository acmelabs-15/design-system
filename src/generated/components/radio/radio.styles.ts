// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const radioCss = css`.radio :where(.control) :where(input) {
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

.radio :where(.control) :where(.dot) {
  border-style: solid;
  border-width: 1px;
  border-color: var(--radio-color);
  background-color: var(--ds-background-100);
  border-radius: 2147483647px;
  width: 1rem;
  height: 1rem;
  transition-property: border-color, background;
  transition-duration: .2s;
  transition-timing-function: cubic-bezier(.4, 0, 1, 1);
  animation-duration: .2s;
  animation-timing-function: cubic-bezier(.4, 0, 1, 1);
  position: relative;
}

.radio :where(.control) {
  align-items: center;
  margin: -.125rem;
  padding: .125rem;
  display: flex;
}

.radio :where(.text) {
  margin-left: var(--acme-gap-quarter);
}

.radio {
  align-items: center;
  font-size: 13px;
  display: inline-flex;
}

.radio:where([data-disabled]), .radio:where([data-disabled]) :where(.control) {
  cursor: not-allowed;
  color: var(--ds-gray-500);
  --radio-color: var(--ds-gray-500);
}

.radio:where(:not([data-disabled])) :where(.control) {
  cursor: pointer;
  --radio-color: var(--ds-gray-700);
}

.radio:where(:not([data-disabled])) {
  --radio-color: var(--ds-gray-700);
}

@media (hover: hover) {
  .radio:where(:not([data-disabled]))[data-hover] :where(.text) {
    cursor: pointer;
  }
}

.radio:where(:not([data-disabled]))[data-checked] :where(.control) :where(.dot) {
  --radio-color: var(--ds-gray-1000);
}

.radio[data-focus] :where(.control) :where(.dot) {
  box-shadow: var(--ds-focus-ring);
}

.radio:where(:not([data-disabled]))[data-active] :where(.control) :where(.dot) {
  --radio-color: var(--ds-gray-600);
}

.radio :where(.control) :where(.dot):after {
  content: "";
  background-color: var(--radio-color);
  border-radius: 2147483647px;
  width: .5rem;
  height: .5rem;
  transition-property: transform, translate, scale, rotate;
  transition-duration: .15s;
  transition-timing-function: cubic-bezier(.4, 0, 1, 1);
  animation-duration: .15s;
  animation-timing-function: cubic-bezier(.4, 0, 1, 1);
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  translate: -50% -50%;
  scale: 0;
}

.radio[data-checked] :where(.control) :where(.dot):after {
  content: "";
  scale: 1;
}

@media (hover: hover) {
  .radio:where(:not([data-disabled]))[data-hover]:not([data-checked]):not([data-active]) :where(.control) :where(.dot) {
    background-color: var(--ds-gray-200);
    --radio-color: var(--ds-gray-900);
  }
}
`;
