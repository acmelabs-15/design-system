// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const comboboxOptionCss = css`.option:where(.disabled) {
  pointer-events: none;
  opacity: .6;
}

.option :where(.start) {
  align-items: center;
  margin-left: -1px;
  margin-right: .75rem;
  display: flex;
}

.option :where(.end) {
  align-items: center;
  margin-left: auto;
  display: flex;
}

.option {
  cursor: pointer;
  border-radius: var(--ds-popover-row-radius);
  padding: var(--ds-popover-row-padding);
  color: var(--ds-gray-1000);
  outline-style: none;
  align-items: center;
  scroll-margin-block: .5rem;
  display: flex;
}

.option :where(.check) {
  width: var(--ds-control-decoration-size);
  height: var(--ds-control-decoration-size);
}

.option:where(:not(.auto)) {
  height: var(--ds-popover-row-height);
}

.option :where(.label), .option:where(:not(.active):not(.chosen)) :where(.end) {
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
  overflow: hidden;
}

.option:where(.active) {
  background-color: var(--ds-gray-alpha-100);
}

.option:where(.lg) {
  font-size: 1rem;
  line-height: 1.5;
}

.option:where(:not(.lg)) {
  font-size: .875rem;
  line-height: calc(1.25 / .875);
}

@media (forced-colors: active) {
  .option {
    outline-offset: 2px;
    outline: 2px solid #0000;
  }
}
`;
