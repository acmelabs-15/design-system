// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const scrollViewportCss = css`:host {
  block-size: 100%;
  min-block-size: 0;
  min-inline-size: 0;
  display: block;
}

[part~="viewport"] {
  scrollbar-width: none;
  scroll-behavior: auto;
  block-size: 100%;
  inline-size: 100%;
  overflow: auto;
}

[part~="viewport"]::-webkit-scrollbar {
  display: none;
}

[data-orientation="vertical"] {
  overflow-x: hidden;
}

[data-orientation="horizontal"] {
  overflow-y: hidden;
}

[part~="viewport"]:focus-visible {
  outline: 2px solid var(--ds-focus-color);
  outline-offset: -2px;
}

[part="content"] {
  min-inline-size: 100%;
  display: flow-root;
}

@media (forced-colors: active) {
  [part~="viewport"]:focus-visible {
    outline-color: highlight;
  }
}

[part~="viewport"] {
  scroll-padding: var(--_scroll-thickness);
}
`;
