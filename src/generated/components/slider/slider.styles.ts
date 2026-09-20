// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const sliderCss = css`.slider :where(.row) :where(.group) :where(.control) :where(.track) :where(.fill) {
  background-color: var(--ds-blue-700);
  -webkit-user-select: none;
  user-select: none;
  border-radius: 2147483647px;
  height: 100%;
  position: absolute;
}

.slider :where(.row) :where(.group) :where(.control) {
  touch-action: none;
  -webkit-user-select: none;
  user-select: none;
  align-items: center;
  display: flex;
  position: relative;
}

.slider :where(.row) :where(.group) :where(.control) :where(.track) :where(.thumb) {
  background-color: var(--ds-white);
  width: .375rem;
  height: .875rem;
  box-shadow: 0 0 0 calc(1px + 0px) var(--ds-gray-alpha-500);
  border-radius: 1px;
  flex-shrink: 0;
  transition-property: scale;
  transition-duration: .1s;
  transition-timing-function: cubic-bezier(.4, 0, .2, 1);
  animation-duration: .1s;
  display: block;
  position: relative;
}

.slider :where(.row) :where(.group) :where(.control) :where(.track) {
  background-color: var(--ds-gray-200);
  -webkit-user-select: none;
  user-select: none;
  border-radius: 2147483647px;
  flex-grow: 1;
  height: .5rem;
  display: block;
}

.slider {
  flex-direction: column;
  display: flex;
}

.slider :where(.row) {
  align-items: center;
  gap: .75rem;
  display: flex;
}

.slider :where(.row) :where(.start-input)::part(wrap), .slider :where(.row) :where(.end-input)::part(wrap) {
  width: 3rem;
}

.slider:where(.full) :where(.row) :where(.group) {
  width: 100%;
  min-width: 0;
}

.slider:where(:not(.full)) :where(.row) :where(.group) {
  min-width: 13.5rem;
}

:where(:host([data-dark])) .slider :where(.row) :where(.group) :where(.control) :where(.track) :where(.thumb) {
  box-shadow: 0 0 0 calc(1px + 0px) var(--ds-black);
}

.slider :where(.row) :where(.group) :where(.control) :where(.track) :where(.thumb):after {
  content: "";
  position: absolute;
  inset: -.5rem;
}

.slider :where(.row) :where(.group) :where(.control) :where(.track) :where(.thumb)[data-focus] {
  outline-offset: 2px;
  outline-width: 2px;
  outline-style: solid;
  outline-color: var(--ds-focus-color);
  scale: 1.2;
}

.slider :where(.row) :where(.group)[data-disabled] {
  cursor: not-allowed;
}

.slider :where(.row) :where(.group) :where(.control) :where(.track) :where(.fill)[data-disabled] {
  background-color: var(--ds-gray-500);
}

.slider :where(.row) :where(.group) :where(.control) :where(.track) :where(.thumb)[data-dragging][data-focus-within] {
  scale: 1.2;
}
`;
