// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const subnavStructureCss = css`:host {
  display: block;
}

::slotted(a) {
  border-radius: var(--r-sm);
  height: 32px;
  color: var(--ds-gray-800);
  align-items: center;
  padding: 6px 12px;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  text-decoration: none;
  display: inline-flex;
}

::slotted(a:hover) {
  color: var(--text);
}

::slotted(a[aria-current="true"]) {
  background: var(--ds-gray-200);
  color: var(--text);
}
`;
