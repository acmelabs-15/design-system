// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const emptyStateCss = css`.empty-state :where(.text) :where(.description) {
  text-align: center;
  max-width: 340px;
  font-family: var(--acme-font-sans);
  text-wrap: balance;
  color: var(--ds-gray-900);
  margin-inline: auto;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
}

.empty-state {
  border-style: solid;
  border-width: 1px;
  border-radius: .5rem;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  width: 100%;
  padding-block: 3rem;
  padding-inline: 70px;
  display: flex;
}

.empty-state :where(.text) {
  flex-direction: column;
  gap: .5rem;
  display: flex;
}

.empty-state:where(:not(.no-border)) {
  border-color: var(--ds-gray-200);
}

.empty-state:where(.no-border) {
  border-color: #0000;
}

.empty-state:where(:not(.secondary)) {
  background-color: var(--ds-background-100);
}

.empty-state:where(.secondary) {
  background-color: var(--ds-background-200);
}

.empty-state:where(:not(.secondary)) :where(.text) :where(.title) {
  font-family: var(--acme-font-sans);
  letter-spacing: -.32px;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
}

.empty-state:where(.secondary) :where(.text) :where(.title) {
  font-family: var(--acme-font-sans);
  letter-spacing: -.28px;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
}

.empty-state :where(.text) :where(.title) {
  text-align: center;
  text-wrap: balance;
  max-width: 340px;
  color: var(--ds-gray-1000);
  margin-inline: auto;
  font-weight: 500;
}

.empty-state:where(:not(.secondary)) :where(.text) :where(.title) > strong {
  color: var(--ds-gray-900);
  font-weight: 500;
}

.empty-state :where(.text) :where(.description) > strong {
  color: var(--ds-gray-1000);
  font-weight: 550;
}

.empty-state > slot::slotted(a), .empty-state > slot > a {
  font-size: .875rem !important;
  line-height: calc(1.25 / .875) !important;
}
`;
