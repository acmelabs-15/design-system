// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const appBarCss = css`:host {
  min-inline-size: 0;
  display: block;
}

:host([placement="sticky"]) {
  z-index: 100;
  position: sticky;
  inset-block-start: var(--acme-app-bar-offset, 0px);
}

header {
  align-items: center;
  gap: var(--acme-spacing-4);
  min-inline-size: 0;
  min-block-size: var(--bar-h, 52px);
  padding-inline: var(--acme-spacing-6);
  border-block-end: 1px solid var(--ds-gray-alpha-400);
  background: var(--ds-background-100);
  color: var(--ds-gray-1000);
  display: flex;
}

header[data-size="small"] {
  min-block-size: calc(var(--bar-h, 52px) - var(--acme-spacing-2));
}

header[data-size="large"] {
  min-block-size: calc(var(--bar-h, 52px) + var(--acme-spacing-2));
}

[part="start"], [part="end"] {
  align-items: center;
  gap: var(--acme-spacing-3);
  flex: none;
  min-inline-size: 0;
  display: flex;
}

[part="content"] {
  align-items: center;
  gap: var(--acme-spacing-3);
  flex: 1;
  min-inline-size: 0;
  display: flex;
  overflow: auto;
}

@media (width < 40rem) {
  header {
    padding-inline: var(--acme-spacing-3);
    gap: var(--acme-spacing-2);
  }
}

[hidden] {
  display: none !important;
}
`;
