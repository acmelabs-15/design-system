// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const gaugeCss = css`.gauge :where(.label), .gauge :where(.icon) {
  display: flex;
  position: absolute;
}

.gauge {
  --delay: 0s;
  --percent-to-deg: 3.6deg;
  --transition-length: 1s;
  --transition-step: .2s;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  display: flex;
  position: relative;
  transform: translateZ(0);
}

.gauge :where(.ring) :where(.secondary) {
  transform-origin: calc(var(--circle-size) / 2) calc(var(--circle-size) / 2);
  transform: rotate(calc(360deg - 90deg - (var(--gap-percent) * var(--percent-to-deg) * var(--offset-factor-secondary)))) scaleY(-1);
  --offset-factor-secondary: calc(1 - var(--offset-factor));
  stroke-dasharray: calc(var(--stroke-percent) * var(--percent-to-px)) var(--circumference);
  transition: all var(--transition-length) ease var(--delay);
}

.gauge :where(.ring) :where(.primary) {
  transform-origin: calc(var(--circle-size) / 2) calc(var(--circle-size) / 2);
  transform: rotate(calc(-90deg + var(--gap-percent) * var(--offset-factor) * var(--percent-to-deg)));
  transition: var(--transition-length) ease var(--delay),stroke var(--transition-length) ease var(--delay);
  stroke-dasharray: calc(var(--stroke-percent) * var(--percent-to-px)) var(--circumference);
}

.gauge :where(.label) :where(.value) {
  font-family: var(--acme-font-sans);
  font-size: 14px;
  line-height: 20px;
  font-weight: var(--acme-font-weight-400);
  color: inherit;
}

.gauge:where(.indeterminate) :where(.ring) :where(.secondary) {
  opacity: 0 !important;
}

.gauge :where(.label) :where(.value) > strong {
  color: var(--ds-gray-1000);
  font-weight: var(--acme-font-weight-550);
}

.gauge:where(.indeterminate) circle {
  stroke: var(--ds-gray-alpha-400) !important;
}

.gauge svg {
  overflow: visible;
}
`;
