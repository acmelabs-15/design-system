// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const separatorStructureCss = css`:host {
  flex-shrink: 0;
  display: block;
}

:host([orientation="vertical"]) {
  vertical-align: top;
  align-self: stretch;
  display: inline-flex;
}

.separator {
  background-color: var(--acme-separator-color, var(--ds-gray-200));
  height: max(0px, var(--acme-separator-width, 1px));
  width: 100%;
}

.separator.vertical {
  height: auto;
  width: max(0px, var(--acme-separator-width, 1px));
  align-self: stretch;
}

@media (forced-colors: active) {
  .separator {
    forced-color-adjust: none;
    background-color: canvastext;
  }
}
`;
