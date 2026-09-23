// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const toastViewportCss = css`:host {
  display: block;
}

[part="viewport"] {
  inset: auto;
  color: inherit;
  inline-size: min(420px,calc(100vw - 2 * var(--acme-spacing-6)));
  block-size: var(--_toast-viewport-height, 0px);
  max-block-size: calc(100dvh - 2 * var(--acme-spacing-6));
  pointer-events: none;
  background: none;
  border: 0;
  margin: 0;
  padding: 0;
  position: fixed;
  inset-block-end: calc(var(--acme-spacing-6) + var(--_toast-keyboard-offset, 0px));
  inset-inline-end: var(--acme-spacing-6);
  overflow: visible;
}

[part="viewport"][data-placement$="start"] {
  inset-inline-start: var(--acme-spacing-6);
  inset-inline-end: auto;
}

[part="viewport"][data-placement^="top"] {
  inset-block-start: var(--acme-spacing-6);
  inset-block-end: auto;
}

[part="viewport"][data-expanded="true"] {
  pointer-events: auto;
  overscroll-behavior: contain;
  overflow: auto;
}

[part="list"] {
  block-size: var(--_toast-viewport-height, 0px);
  inline-size: 100%;
  position: relative;
}

slot {
  display: block;
}

.gap-measure {
  visibility: hidden;
  pointer-events: none;
  block-size: 0;
  inline-size: 0;
  padding-block-start: var(--acme-spacing-3);
  position: absolute;
}
`;
