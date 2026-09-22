// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const selectionControlCss = css`:host {
  vertical-align: middle;
  display: inline-flex;
}

.selection-label {
  cursor: pointer;
  min-block-size: 24px;
  min-inline-size: 24px;
  color: var(--ds-gray-1000);
  isolation: isolate;
  align-items: flex-start;
  gap: 8px;
  padding-block: 4px;
  font-size: 13px;
  line-height: 16px;
  display: inline-flex;
  position: relative;
}

.control {
  flex: none;
  block-size: 16px;
  inline-size: 16px;
  display: inline-flex;
  position: relative;
}

.native {
  opacity: 0;
  block-size: 100%;
  inline-size: 100%;
  cursor: inherit;
  margin: 0;
  position: absolute;
  inset: 0;
}

.indicator {
  border: 1px solid var(--ds-gray-700);
  background: var(--ds-background-100);
  --acme-icon-size: 14px;
  pointer-events: none;
  border-radius: 4px;
  justify-content: center;
  align-items: center;
  block-size: 100%;
  inline-size: 100%;
  display: flex;
}

.selection-label[data-invalid] .indicator {
  border-color: var(--warn-solid);
}

.selection-label[data-disabled] {
  color: var(--ds-gray-700);
  cursor: not-allowed;
}

.selection-label[data-disabled] .indicator {
  background: var(--comp);
  color: var(--ds-gray-700);
  border-color: var(--border);
}

.native:focus-visible + .indicator {
  box-shadow: var(--ds-focus-ring);
}

.content {
  flex-direction: column;
  gap: 4px;
  display: flex;
}

[part="description"] {
  color: var(--ds-gray-900);
  font-size: 12px;
}

[hidden] {
  display: none;
}

.selection-label[data-size="small"] {
  font-size: 12px;
}

.selection-label[data-size="small"] .control {
  block-size: 14px;
  inline-size: 14px;
}

.selection-label[data-size="small"] .indicator {
  --acme-icon-size: 12px;
}

.selection-label[data-size="large"] {
  font-size: 14px;
  line-height: 20px;
}

.selection-label[data-size="large"] .control {
  block-size: 20px;
  inline-size: 20px;
}

.selection-label[data-size="large"] .indicator {
  --acme-icon-size: 18px;
}

.ripple-clip {
  pointer-events: none;
  z-index: 0;
  border-radius: 4px;
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.ripple {
  background: var(--ds-black);
  opacity: 0;
  pointer-events: none;
  border-radius: 50%;
  position: absolute;
}

.control, .content {
  z-index: 1;
  position: relative;
}

.selection-label {
  transition-property: none;
  transition-duration: var(--dur);
  transition-timing-function: var(--ease);
}

@media (forced-colors: active) {
  .indicator {
    color: canvastext;
    forced-color-adjust: none;
    background: canvas;
    border-color: buttontext;
  }

  .native:focus-visible + .indicator {
    outline-offset: 2px;
    outline: 2px solid highlight;
  }

  .ripple-clip {
    display: none;
  }
}
`;
