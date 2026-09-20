// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const clearableInputCss = css`.input :where(.cmdk) :where(.k-esc) :where(.keys) :where([data-key="esc"]) {
  inset-block: 0;
  transition-duration: var(--duration);
  transition-timing-function: var(--timing);
  animation-duration: var(--duration);
  animation-timing-function: var(--timing);
  align-items: center;
  display: flex;
  position: absolute;
  left: .25rem;
  translate: 2rem;
}

.input :where(.cmdk) :where(.k-esc) :where(.keys) :where([data-key="cmd"]) {
  inset-block: 0;
  transition-property: transform, translate, scale, rotate;
  transition-timing-function: var(--timing);
  transition-duration: var(--duration);
  animation-duration: var(--duration);
  animation-timing-function: var(--timing);
  align-items: center;
  display: flex;
  position: absolute;
  right: .25rem;
  margin-left: 0 !important;
}

.input :where(.cmdk) :where(.k-esc)::part(kbd) {
  transition-property: transform, translate, scale, rotate;
  transition-timing-function: var(--timing);
  transition-duration: var(--duration);
  animation-duration: var(--duration);
  animation-timing-function: var(--timing);
  position: relative;
  overflow: hidden;
  color: var(--ds-gray-900) !important;
}

.input :where(.clear) {
  box-sizing: border-box;
  cursor: pointer;
  tap-highlight-color: transparent;
  background-color: #0000;
  border-style: solid;
  border-width: 0;
  border-top-right-radius: .375rem;
  border-bottom-right-radius: .375rem;
  align-items: center;
  max-width: 100%;
  height: 100%;
  padding-inline: .625rem;
  font-size: 1rem;
  line-height: 1.5;
  text-decoration-line: none;
  transition-property: color, box-shadow, border-color;
  transition-duration: .15s;
  transition-timing-function: ease;
  animation-duration: .15s;
  animation-timing-function: ease;
  display: flex;
}

.input :where(.cmdk) {
  justify-content: center;
  gap: .25rem;
  padding-right: .625rem;
  font-weight: 500;
  display: flex;
}

.input :where(.clear) :where(acme-kbd)::part(kbd) {
  font-weight: 500;
  color: var(--ds-gray-900) !important;
}

.input :where(.cmdk) :where(.k-k)::part(kbd) {
  transition-property: translate;
  transition-timing-function: var(--timing);
  transition-duration: var(--duration);
  animation-duration: var(--duration);
  animation-timing-function: var(--timing);
  color: var(--ds-gray-900) !important;
}

@media not all and (width >= 960px) {
  .input :where(.cmdk) {
    display: none;
  }
}

@media (pointer: coarse) {
  .input :where(.clear) {
    display: none;
  }
}

.input[data-animate="true"] :where(.cmdk) :where(.k-esc) :where(.keys) :where([data-key="cmd"]) {
  translate: -1.5rem;
}

.input[data-animate="true"] :where(.cmdk) :where(.k-esc)::part(kbd) {
  width: 1.75rem;
  translate: 26px;
}

.input[data-animate="true"] :where(.cmdk) :where(.k-esc) :where(.keys) :where([data-key="esc"]) {
  translate: calc(calc(var(--padding) * -1) * -1) 0;
}

.input[data-animate="true"] :where(.cmdk) :where(.k-k)::part(kbd) {
  translate: 33px;
}

@media (hover: hover) {
  .input :where(.clear):hover {
    color: var(--acme-foreground);
  }
}

.input :where(.clear):focus-visible {
  outline-offset: -1px;
  outline-width: 2px;
  outline-style: solid;
  outline-color: var(--ds-focus-color);
}

.input :where(.clear):disabled {
  cursor: not-allowed;
}
`;
