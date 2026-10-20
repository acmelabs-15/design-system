// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const menuContentStructureCss = css`:host {
  inset: auto;
  left: var(--menu-x, 0px);
  top: var(--menu-y, 0px);
  padding: var(--ds-popover-padding, 8px);
  background: var(--ds-background-100);
  color: var(--ds-gray-1000);
  box-shadow: var(--acme-shadow-5);
  min-inline-size: 150px;
  max-inline-size: var(--menu-available-width, calc(100vw - 16px));
  max-block-size: var(--menu-available-height, calc(100vh - 16px));
  overscroll-behavior: contain;
  inline-size: max-content;
  font: inherit;
  opacity: var(--menu-opacity, 1);
  border: 0;
  border-radius: 12px;
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  position: fixed;
  overflow: auto;
}

:host(:not(:popover-open)) {
  display: none;
}

[part="root"] {
  outline: none;
}
`;
