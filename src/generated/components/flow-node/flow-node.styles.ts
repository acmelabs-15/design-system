// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const flowNodeCss = css`:host {
  left: var(--_flow-x, 0px);
  top: var(--_flow-y, 0px);
  inline-size: var(--_flow-width, max-content);
  block-size: var(--_flow-height, auto);
  min-inline-size: var(--_flow-width, 140px);
  max-inline-size: var(--_flow-width, 360px);
  box-sizing: border-box;
  visibility: hidden;
  display: block;
  position: absolute;
}

:host([data-flow-ready]) {
  visibility: visible;
}

:host(:not([data-flow-owned])) {
  display: none;
}

[part="node"] {
  box-sizing: border-box;
  gap: var(--acme-spacing-3);
  block-size: 100%;
  inline-size: 100%;
  padding: var(--acme-spacing-4);
  border: 1px solid var(--ds-gray-400);
  border-radius: var(--r);
  background: var(--ds-background-100);
  color: var(--ds-gray-1000);
  flex-direction: column;
  font-size: .875rem;
  line-height: 1.5;
  display: flex;
  overflow: auto;
}

[part="label"] {
  font: inherit;
  font-weight: var(--acme-font-weight-600);
  color: inherit;
  text-align: start;
  cursor: pointer;
  background: none;
  border: 0;
  padding: 0;
}

[part="label"]:focus-visible {
  outline: 2px solid var(--ds-focus-color);
  outline-offset: 3px;
  border-radius: 2px;
}
`;
