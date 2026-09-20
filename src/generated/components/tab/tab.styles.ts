// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const tabCss = css`.tab :where(.icon) {
  margin-right: .375rem;
}

.tab {
  cursor: pointer;
  font-size: .875rem;
  line-height: calc(1.25 / .875);
  color: var(--ds-gray-900);
  background-color: #0000;
  border: 0 solid #0000;
  border-bottom-width: 2px;
  outline-width: 0;
  outline-style: solid;
  align-items: center;
  margin-bottom: -1px;
  padding-block: .875rem;
  padding-inline: .125rem;
  display: flex;
}

.tab.secondary {
  height: 2rem;
  font-family: var(--acme-font-sans);
  border-bottom-style: solid;
  border-bottom-width: 0;
  border-radius: .375rem;
  padding-block: 0;
  padding-inline: .75rem;
  font-size: 13px;
  font-weight: 400;
  line-height: 16px;
}

.tab:disabled {
  cursor: not-allowed;
}

.tab[aria-selected="true"] {
  color: var(--ds-gray-1000);
}

.tab.secondary > strong {
  color: var(--ds-gray-1000);
  font-weight: 500;
}

@media (hover: hover) {
  .tab:not(:disabled)[data-hover] {
    color: var(--ds-gray-1000);
  }
}

.tab.secondary:disabled {
  cursor: not-allowed;
  background-color: var(--ds-gray-200);
  color: var(--ds-gray-900);
}

.tab:not(.secondary)[aria-selected="true"] {
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-color: var(--ds-gray-1000);
}

.tab.secondary[aria-selected="true"] {
  background-color: var(--ds-gray-200);
  color: var(--ds-gray-1000);
}

.tab[data-focus][data-show-focus-ring="true"] {
  box-shadow: var(--ds-focus-ring);
}
`;
