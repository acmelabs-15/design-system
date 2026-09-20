// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const relativeTimeCardCss = css`.content {
  flex-direction: column;
  gap: .75rem;
  min-width: 300px;
  display: flex;
}

.content :where(.ago) {
  flex-direction: column;
  gap: .75rem;
  display: flex;
}

.content :where(.rows) {
  flex-direction: column;
  gap: .5rem;
  display: flex;
}

.content :where(.rows) :where(.row) {
  justify-content: space-between;
  align-items: center;
  gap: .75rem;
  display: flex;
}

.content :where(.rows) :where(.row) :where(.place) {
  align-items: center;
  gap: .375rem;
  display: flex;
}

.content :where(.rows) :where(.row) :where(.place) :where(.chip) {
  background-color: var(--ds-gray-200);
  border-radius: .125rem;
  justify-content: center;
  align-items: center;
  height: 1rem;
  padding-inline: .375rem;
  display: flex;
}

.content :where(.rows) :where(.row) :where(.place) :where(.chip) :where(.abbr) {
  font-family: var(--font-mono);
  color: var(--ds-gray-900);
  font-size: 12px;
}

.content :where(.rows) :where(.row) :where(.clock) {
  font-family: var(--font-mono);
  color: var(--ds-gray-900);
  font-variant-numeric: tabular-nums;
  font-size: 12px;
}

.content :where(.ago) :where(.age) {
  color: var(--ds-gray-900);
  font-variant-numeric: tabular-nums;
  font-size: 13px;
}

.content :where(.rows) :where(.row) :where(.place) :where(.date) {
  font-size: 13px;
}
`;
