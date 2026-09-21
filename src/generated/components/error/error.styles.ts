// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const errorCss = css`.error:where(:not(.lg)) :where(.icon) {
  margin-top: .125rem;
}

.error:where(.lg) :where(.icon) {
  margin-top: .25rem;
}

.error :where(.icon) {
  align-items: center;
  margin-right: .5rem;
  display: flex;
}

.error :where(.text) :where(.label) {
  font-weight: var(--acme-font-weight-500);
  margin-right: .5rem;
}

.error {
  color: var(--ds-red-900);
  align-items: flex-start;
  display: flex;
}

.error :where(.text) :where(.action) {
  display: inline-block;
}

.error :where(.text) :where(.action) :where(.link) {
  cursor: pointer;
  font-weight: var(--acme-font-weight-500);
  color: inherit;
  outline-offset: 4px;
  outline-color: var(--ds-focus-color);
  align-items: center;
  gap: .125rem;
  text-decoration-line: underline;
  transition-property: opacity;
  transition-duration: .1s;
  transition-timing-function: cubic-bezier(.4, 0, .2, 1);
  animation-duration: .1s;
  display: inline-flex;
}

.error:where(.lg) {
  font-size: 1rem;
  line-height: 1.5rem;
}

.error:where(:not(.sm, .lg)) {
  font-size: .875rem;
  line-height: calc(1.25 / .875);
}

.error:where(.sm) {
  font-size: 13px;
}

.error:where(:not(.lg)) {
  line-height: 1.25rem;
}

.error :where(.text) {
  overflow-wrap: break-word;
}

.error :where(.text) :where(.action) :where(.link):focus-visible {
  outline-width: 2px;
  outline-style: solid;
}

@media (hover: hover) {
  .error :where(.text) :where(.action) :where(.link):not([aria-disabled]):hover {
    opacity: .6;
  }
}
`;
