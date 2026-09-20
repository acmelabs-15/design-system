// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const destructiveModalCss = css`.stack > :not(:last-child) {
  margin-block: 0 1.5rem;
}

.stack :where(.field) {
  flex-direction: column;
  align-items: stretch;
  gap: .5rem;
  display: flex;
}

.stack :where(.field) :where(.prompt) {
  color: var(--ds-gray-1000);
  font-size: .875rem;
  line-height: 1.25rem;
}

.stack :where(.field) :where(.prompt) :where(.phrase) {
  overflow-wrap: anywhere;
  font-weight: 600;
}

.stack :where(acme-note) code {
  border-color: var(--ds-red-400) !important;
  background-color: var(--ds-red-300) !important;
  color: var(--ds-red-1000) !important;
}
`;
