// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const switchControlCss = css`.switch-control:where([data-disabled]) :where(.label) {
  pointer-events: none;
  cursor: not-allowed;
  color: var(--ds-gray-800);
}

.switch-control :where(input), .switch-control :where(.label) :where(.sr) {
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

.switch-control {
  flex: 1;
  align-self: stretch;
  display: flex;
}

.switch-control :where(.label) {
  cursor: pointer;
  color: var(--ds-gray-900);
  flex: 1;
  justify-content: center;
  align-items: center;
  transition-property: color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --acme-gradient-from, --acme-gradient-via, --acme-gradient-to;
  transition-duration: .15s;
  transition-timing-function: cubic-bezier(.4, 0, .2, 1);
  animation-duration: .15s;
  display: flex;
}

.switch-control:where([data-disabled]) {
  cursor: not-allowed;
}

.switch-control:where(:not(.icon)) :where(.label) {
  padding: 0 12px;
  font-size: 14px;
  font-weight: 500;
  text-decoration-line: none;
}

.switch-control:where(.lg:not(.icon)) :where(.label) {
  padding: 0 16px;
  font-size: 16px;
}

.switch-control:where(.sm.icon) :where(.label) {
  padding: 4px 8px;
}

.switch-control:where(.icon) :where(.label) {
  padding: 8px;
}

.switch-control:where(.lg.icon) :where(.label) {
  padding: 12px;
}

.switch-control[data-checked] :where(.label) {
  background-color: var(--switch-checked-color);
  color: var(--ds-gray-1000);
  border-radius: 4px;
}

.switch-control:where(.lg)[data-checked] :where(.label) {
  border-radius: 6px;
}

.switch-control[data-disabled] :where(.label) {
  color: var(--ds-gray-800);
}

@media (hover: hover) {
  .switch-control[data-hover] :where(.label) {
    color: var(--ds-gray-1000);
  }
}

.switch-control[data-focus] :where(.label) {
  box-shadow: var(--ds-focus-ring);
  outline-width: 0;
  outline-style: solid;
}
`;
