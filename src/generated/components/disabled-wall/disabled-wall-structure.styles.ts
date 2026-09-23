// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const disabledWallStructureCss = css`:host {
  min-inline-size: 0;
  display: block;
}

[part="root"] {
  position: relative;
}

[part="content"] {
  min-inline-size: 0;
}

[part="content"][inert] {
  opacity: var(--acme-disabled-wall-opacity, .5);
}

[part="explanation"] {
  color: var(--ds-gray-900);
  font: inherit;
  margin-block-start: var(--acme-spacing-2);
  font-size: 13px;
  line-height: 1.5;
}

[part="explanation"]:focus-visible {
  outline: 2px solid var(--ds-focus-color);
  outline-offset: 2px;
  border-radius: 4px;
}

[hidden] {
  display: none !important;
}

@media (forced-colors: active) {
  [part="explanation"] {
    color: canvastext;
  }

  [part="explanation"]:focus-visible {
    outline-color: highlight;
  }
}
`;
