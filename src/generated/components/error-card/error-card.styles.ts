// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const errorCardCss = css`.card {
  border-style: solid;
  border-width: 1px;
  border-color: var(--ds-red-400);
  color: var(--ds-red-900);
  box-shadow: none;
  border-radius: .5rem;
  flex-direction: column;
  padding: 1rem;
  list-style-type: none;
  display: flex;
  background-color: var(--ds-red-200) !important;
}

.card :where(.head) {
  flex-direction: column;
  align-items: center;
  gap: .5rem;
  display: flex;
}

.card :where(.retry) :where(.retry-label) {
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-inline: .375rem;
  display: inline-block;
  overflow: hidden;
}

.card :where(.head) :where(.title) {
  text-align: center;
  font-family: var(--acme-font-sans);
  color: inherit;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}

.card :where(.retry) :where(.retry-label) :where(.retry-text) {
  color: var(--ds-red-900);
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
}

.card :where(.head) :where(.title) > slot::slotted(strong), .card :where(.head) :where(.title) > slot > strong {
  color: var(--ds-gray-1000) !important;
  font-weight: 550 !important;
}

.card:empty {
  display: none;
}
`;
