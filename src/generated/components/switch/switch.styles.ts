// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const switchCss = css`.switch {
  background-color: var(--ds-background-100);
  border-radius: 6px;
  padding: .25rem;
  display: flex;
}

.switch:where(.lg) {
  height: var(--ds-size-large);
  border-radius: 8px;
}

.switch:where(:not(.sm, .lg)) {
  height: var(--ds-size-medium);
}

.switch:where(.sm) {
  height: 2rem;
}

.switch:where(:not(.no-border)) {
  box-shadow: 0 0 0 1px var(--ds-gray-alpha-400);
}

.switch > slot::slotted(*), .switch > slot > * {
  height: 100% !important;
}
`;
