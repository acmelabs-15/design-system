// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const disclosureContentCss = css`:host {
  min-inline-size: 0;
  display: block;
}

:host([hidden]) {
  display: none !important;
}

[part="content"] {
  block-size: var(--_disclosure-height, 0px);
  opacity: var(--_disclosure-opacity, 0);
  overflow: hidden;
}

.body {
  padding: var(--acme-disclosure-content-padding, 0 var(--acme-spacing-4) var(--acme-spacing-4));
  display: flow-root;
}
`;
