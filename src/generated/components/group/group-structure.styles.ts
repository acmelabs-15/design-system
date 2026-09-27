// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const groupStructureCss = css`:host {
  place-content: normal flex-start;
  align-items: center;
  gap: var(--acme-layout-gap-2, var(--acme-spacing-2, .5rem));
  flex-direction: row;
  display: inline-block;
}

:host(:where([grow])) {
  display: block;
}

:host(:where([outline])) {
  border: var(--acme-group-outline-width, 1px) solid var(--acme-group-outline-color, var(--ds-gray-200));
  border-radius: var(--acme-group-outline-radius, var(--r, 8px));
  padding: var(--acme-group-outline-padding, 0px);
}

:host([attached]) [part~="root"] {
  gap: 0 !important;
}
`;
