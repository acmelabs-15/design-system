// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const flowDiagramCss = css`:host {
  min-inline-size: 0;
  display: block;
}

[part="root"] {
  gap: var(--acme-spacing-3);
  flex-direction: column;
  display: flex;
}

[part="viewport"] {
  block-size: var(--acme-flow-height, 480px);
  border: 1px solid var(--ds-gray-400);
  border-radius: var(--r);
  background: var(--ds-background-200);
  isolation: isolate;
  min-block-size: 180px;
  position: relative;
  overflow: hidden;
}

[part="background"] {
  touch-action: none;
  cursor: grab;
  background-image: linear-gradient(var(--ds-gray-200) 1px,transparent 1px),linear-gradient(90deg,var(--ds-gray-200) 1px,transparent 1px);
  background-size: 20px 20px;
  position: absolute;
  inset: 0;
}

[part="background"]:active {
  cursor: grabbing;
}

[part="background"]:focus-visible {
  outline: 2px solid var(--ds-focus-color);
  outline-offset: -3px;
}

.scene {
  transform-origin: 0 0;
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
}

.scene > svg {
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
  overflow: visible;
}

::slotted(*) {
  pointer-events: auto;
}

[part="edge"] {
  fill: none;
  stroke: var(--ds-blue-900);
  stroke-width: 1.5px;
}

.arrow {
  fill: var(--ds-blue-900);
}

[part="edge-label"] {
  color: var(--ds-gray-1000);
  background: var(--ds-background-200);
  white-space: pre;
  border-radius: 3px;
  padding: 2px 4px;
  font-size: .75rem;
  line-height: 1.5;
  position: absolute;
}

.measure {
  visibility: hidden;
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
}

.fallback {
  box-sizing: border-box;
  inline-size: max-content;
  min-inline-size: 140px;
  max-inline-size: 360px;
  padding: var(--acme-spacing-4);
  border: 1px solid var(--ds-gray-400);
  border-radius: var(--r);
  background: var(--ds-background-100);
  color: var(--ds-gray-1000);
  pointer-events: auto;
  font-size: .875rem;
  line-height: 1.5;
  position: absolute;
  overflow: auto;
}

.fallback button {
  font: inherit;
  font-weight: var(--acme-font-weight-600);
  color: inherit;
  text-align: start;
  cursor: pointer;
  background: none;
  border: 0;
  padding: 0;
}

.fallback button:focus-visible {
  outline: 2px solid var(--ds-focus-color);
  outline-offset: 3px;
}

[part="controls"] {
  align-items: center;
  gap: var(--acme-spacing-2);
  flex-wrap: wrap;
  display: flex;
}

.empty {
  color: var(--ds-gray-900);
  pointer-events: none;
  place-items: center;
  display: grid;
  position: absolute;
  inset: 0;
}

.status {
  color: var(--ds-gray-900);
  font-size: .875rem;
}

[hidden] {
  display: none !important;
}
`;
