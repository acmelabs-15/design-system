// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const sideNavStructureCss = css`:host {
  flex: 1;
  display: block;
}

::slotted(a) {
  border-radius: var(--r-sm);
  height: 36px;
  color: var(--text-2);
  letter-spacing: -.28px;
  white-space: nowrap;
  align-items: center;
  gap: 6px;
  padding: 0 8px 0 10px;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  text-decoration: none;
  display: flex;
}

::slotted(a:hover) {
  background: var(--comp);
  color: var(--text);
}

::slotted(a[aria-current="true"]) {
  background: var(--ds-gray-200);
  color: var(--text);
}

::slotted(.group) {
  text-transform: uppercase;
  color: var(--ds-gray-800);
  padding: 12px 8px 2px;
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
}
`;
