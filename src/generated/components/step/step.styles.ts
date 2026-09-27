// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const stepCss = css`:host {
  flex: 1;
  min-inline-size: 0;
  display: block;
}

[part="item"] {
  align-items: center;
  gap: var(--acme-spacing-3);
  display: flex;
  position: relative;
}

[part="separator"] {
  min-inline-size: var(--acme-spacing-4);
  background: var(--ds-gray-alpha-400);
  flex: 1;
  block-size: 1px;
  display: block;
}

[data-complete] [part="separator"] {
  background: var(--accent);
}

[hidden] {
  display: none !important;
}

[data-orientation="vertical"] [part="separator"] {
  inline-size: 1px;
  min-inline-size: 0;
  block-size: var(--acme-spacing-3);
  position: absolute;
  inset-block-start: 100%;
  inset-inline-start: 12px;
}
`;
