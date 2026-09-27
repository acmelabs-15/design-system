// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const toolbarStructureCss = css`:host {
  min-inline-size: 0;
  display: block;
}

[part="content"] {
  align-items: center;
  gap: var(--acme-spacing-2);
  min-inline-size: 0;
  display: flex;
  overflow: auto;
}

[part="start"], [part="end"] {
  align-items: center;
  gap: inherit;
  flex: none;
  display: flex;
}

[part="end"] {
  margin-inline-start: auto;
}

[data-orientation="vertical"], [data-orientation="vertical"] [part="start"], [data-orientation="vertical"] [part="end"] {
  flex-direction: column;
  align-items: stretch;
}

[data-orientation="vertical"] [part="end"] {
  margin-block-start: auto;
  margin-inline-start: 0;
}

[part="root"]:focus-visible {
  outline: 2px solid var(--ds-focus-color);
  outline-offset: 2px;
}

@media (forced-colors: active) {
  [part="root"]:focus-visible {
    outline-color: highlight;
  }
}

[hidden] {
  display: none !important;
}
`;
