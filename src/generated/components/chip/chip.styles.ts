// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const chipCss = css`.chip {
  font-size: var(--t-sm);
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-2);
  transition: var(--dur) var(--ease);
  border-radius: 999px;
  padding: 7px 13px;
  font-weight: 450;
}

.chip:hover {
  border-color: var(--border-hover);
  color: var(--text);
}

.chip[aria-pressed="true"] {
  background: var(--text);
  border-color: var(--text);
  color: var(--on-contrast);
  font-weight: 500;
}

.chip[disabled] {
  opacity: .45;
  cursor: not-allowed;
}

@media (pointer: coarse) {
  .chip {
    min-height: 44px;
    padding: 0 16px;
  }
}
`;
