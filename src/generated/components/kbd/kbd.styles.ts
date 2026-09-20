// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const kbdCss = css`.kbd:where(.sm) {
  min-width: 1.25rem;
  height: 1.25rem;
  min-height: 1.25rem;
  margin-left: .125rem;
  padding-inline: .25rem;
  font-size: .75rem;
  line-height: 1.7em;
}

.kbd:where(:not(.sm)) {
  min-height: 1.5rem;
  min-width: var(--acme-gap);
  margin-left: .25rem;
  padding-inline: .375rem;
  font-size: .875rem;
  line-height: 1.7em;
}

.kbd {
  background-color: var(--ds-background-100);
  color: var(--ds-gray-1000);
  box-shadow: 0 0 0 1px var(--ds-gray-alpha-400);
  border-radius: .25rem;
  justify-content: center;
  align-items: center;
  padding-block: 0;
  display: inline-flex;
  font-family: var(--acme-font-sans) !important;
  line-height: 1.7em !important;
}
`;
