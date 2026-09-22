// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const tabsStructureCss = css`:host {
  min-inline-size: 0;
  display: block;
}

.tabs {
  gap: var(--acme-spacing-3, 12px);
  flex-direction: column;
  min-inline-size: 0;
  display: flex;
}

.viewport {
  scrollbar-width: thin;
  outline: none;
  max-inline-size: 100%;
  overflow: auto;
}

.list {
  isolation: isolate;
  border-block-end: 1px solid var(--ds-gray-300);
  inline-size: max-content;
  min-inline-size: 100%;
  display: inline-block;
  position: relative;
}

acme-group {
  vertical-align: bottom;
  align-items: stretch;
}

acme-selection-indicator {
  --acme-indicator-color: var(--ds-blue-700);
  --acme-indicator-radius: 3px 3px 0 0;
  z-index: 0;
}

.tabs[data-variant="inset"] .list {
  border: 0;
  min-inline-size: 0;
}

.tabs[data-variant="inset"] acme-group {
  --acme-group-outline-padding: 4px;
  --acme-group-outline-radius: 8px;
  --acme-group-outline-color: var(--ds-gray-300);
}

.tabs[data-variant="inset"] acme-selection-indicator {
  --acme-indicator-color: var(--ds-gray-200);
  --acme-indicator-radius: 6px;
  --acme-indicator-shadow: inset 0 0 0 1px var(--ds-gray-800);
  z-index: -1;
}

.tabs[data-orientation="vertical"] {
  flex-direction: row;
  align-items: flex-start;
}

.tabs[data-orientation="vertical"] .viewport {
  flex: none;
  max-block-size: 100%;
}

.tabs[data-orientation="vertical"] .list {
  border-block-end: 0;
  border-inline-start: 1px solid var(--ds-gray-300);
  min-inline-size: 0;
}

.tabs[data-orientation="vertical"][data-variant="primary"] acme-selection-indicator {
  --acme-indicator-radius: 0 3px 3px 0;
}

:host(:dir(rtl)) .tabs[data-orientation="vertical"][data-variant="primary"] acme-selection-indicator {
  --acme-indicator-radius: 3px 0 0 3px;
}

.tabs[data-orientation="vertical"][data-variant="inset"] .list {
  border: 0;
}

.panels {
  flex: 1;
  min-inline-size: 0;
}

@media (forced-colors: active) {
  .list {
    border-color: buttontext;
  }

  acme-selection-indicator, .tabs[data-variant="inset"] acme-selection-indicator {
    --acme-indicator-color: Highlight;
    forced-color-adjust: none;
  }

  .tabs[data-variant="inset"] acme-group {
    --acme-group-outline-color: ButtonText;
  }
}
`;
