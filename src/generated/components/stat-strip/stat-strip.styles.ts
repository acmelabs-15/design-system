// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const statStripCss = css`.stat-strip {
  background: var(--surface-2);
  border-radius: 10px 10px 0 0;
  margin: -12px -12px 12px;
  display: flex;
  overflow-x: auto;
}

.stat-strip button {
  text-align: left;
  border: 0;
  border-right: 1px solid var(--hair);
  cursor: pointer;
  min-width: 130px;
  color: var(--text);
  font: inherit;
  background: none;
  flex: none;
  padding: 16px;
}

.stat-strip button:hover {
  background: var(--comp);
}

.stat-strip button[aria-selected="true"] {
  background: var(--surface);
}

.stat-strip .label {
  color: var(--text-2);
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  display: block;
}

.stat-strip .value {
  letter-spacing: -.79px;
  font-variant-numeric: tabular-nums;
  align-items: center;
  gap: 8px;
  font-size: 32px;
  font-weight: 600;
  line-height: 40px;
  display: flex;
}

.stat-strip .value .badge {
  font-size: 12px;
}
`;
