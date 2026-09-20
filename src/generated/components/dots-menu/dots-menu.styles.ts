// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const dotsMenuCss = css`acme-menu-button:where([disabled]) :where(.wrap) :where(.icon) {
  pointer-events: none;
  color: var(--accents-3);
}

acme-menu-button :where(.wrap) {
  align-items: center;
  display: flex;
  position: relative;
}

acme-menu-button :where(.wrap) :where(.icon) {
  cursor: pointer;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  width: 1rem;
  height: 1rem;
  display: inline-flex;
}

acme-menu-button::part(button) {
  flex-shrink: 0;
}

acme-menu-button:where([disabled]) :where(.wrap) {
  cursor: not-allowed;
}

acme-menu-button:where(:not([disabled])) :where(.wrap) :where(.icon) {
  color: var(--ds-gray-1000);
}

acme-menu-button svg {
  flex-shrink: 0;
}

acme-menu-button[aria-expanded="true"]::part(button) {
  background-color: var(--ds-gray-alpha-100);
}

acme-menu-button[data-hover]::part(button) {
  background-color: var(--themed-hover-bg, #383838);
}

:where(:host([data-dark])) acme-menu-button[data-hover]::part(button) {
  background-color: var(--themed-hover-bg, #ccc);
}

acme-menu-button[data-hover]::part(button):disabled {
  background-color: var(--ds-gray-100);
}
`;
