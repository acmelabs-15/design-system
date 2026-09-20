// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const tileCss = css`.tiles {
  grid-template-columns: repeat(auto-fit, minmax(104px, 1fr));
  gap: 8px;
  display: grid;
}

.tile {
  background: var(--surface-2);
  border: 1px solid var(--hair);
  border-radius: var(--r);
  min-width: 0;
  padding: 10px 12px;
}

.tile .label {
  font-family: var(--mono);
  font-size: var(--t-3xs);
  text-transform: uppercase;
  letter-spacing: .09em;
  color: var(--text-2);
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-bottom: 4px;
  line-height: 14px;
  display: block;
  overflow: hidden;
}

.tile .value {
  font-family: var(--mono);
  font-size: var(--t-md);
  color: var(--text);
  font-variant-numeric: tabular-nums;
  font-weight: 600;
  line-height: 20px;
  display: block;
}

.tile.lg .value {
  font-size: var(--t-xl);
  line-height: 26px;
}

.tile.plain .label {
  font-family: var(--sans);
  text-transform: none;
  letter-spacing: 0;
  white-space: nowrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 2px;
  font-size: 14px;
  line-height: 20px;
  display: flex;
  overflow: visible;
}

.tile.plain .label .q {
  flex: none;
}

.tiles:has(.tile.plain) {
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
}

.tile.plain .label .q {
  font-size: var(--t-xs);
  color: var(--text-2);
  margin-left: auto;
}

.tile.plain .value {
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
}

.tile.plain {
  background: var(--surface);
  box-shadow: var(--ds-shadow-border);
  border: 0;
}
`;
