// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const segmentedControlStructureCss = css`:host {
  vertical-align: middle;
  display: inline-block;
}

.segmented {
  isolation: isolate;
  outline: none;
  display: inline-block;
  position: relative;
}

acme-group {
  --acme-group-outline-padding: 4px;
  --acme-group-outline-radius: 8px;
  --acme-group-outline-color: var(--ds-gray-300);
  gap: 0;
  position: relative;
}

acme-selection-indicator {
  --acme-indicator-color: var(--ds-gray-200);
  --acme-indicator-radius: 6px;
  --acme-indicator-shadow: inset 0 0 0 1px var(--ds-gray-800);
  z-index: -1;
}

@media (forced-colors: active) {
  acme-group {
    --acme-group-outline-color: ButtonText;
  }

  acme-selection-indicator {
    --acme-indicator-color: Highlight;
    forced-color-adjust: none;
  }
}
`;
