// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const messageSurfaceCss = css`:host {
  min-inline-size: 0;
  display: block;
}

[part="root"] {
  align-items: center;
  gap: var(--acme-spacing-3);
  padding: var(--acme-spacing-2) var(--acme-spacing-3);
  min-block-size: var(--ds-size-medium);
  box-sizing: border-box;
  border: 1px solid var(--ds-gray-400);
  border-radius: var(--r-sm);
  inline-size: 100%;
  color: var(--ds-gray-900);
  overflow-wrap: anywhere;
  flex-wrap: wrap;
  font-size: .875rem;
  line-height: 1.5;
  display: flex;
}

[part="root"][data-size="small"] {
  min-block-size: var(--ds-size-small);
  padding: var(--acme-spacing-1-5) var(--acme-spacing-2);
  font-size: .8125rem;
}

[part="root"][data-size="large"] {
  min-block-size: var(--ds-size-large);
  padding: var(--acme-spacing-3) var(--acme-spacing-4);
  font-size: inherit;
}

[part="root"][data-kind="banner"] {
  border-inline: 0;
  border-radius: 0;
}

[part="root"][data-variant="success"] {
  border-color: var(--ds-blue-400);
  color: var(--ds-blue-900);
}

[part="root"][data-variant="error"] {
  border-color: var(--ds-red-400);
  color: var(--ds-red-900);
}

[part="root"][data-variant="warning"] {
  border-color: var(--ds-amber-400);
  color: var(--ds-amber-900);
}

[part="root"][data-variant="secondary"] {
  border-color: var(--ds-gray-alpha-400);
  color: var(--ds-gray-alpha-900);
}

[part="root"][data-variant="violet"] {
  border-color: var(--ds-purple-400);
  color: var(--ds-purple-900);
}

[part="root"][data-variant="cyan"] {
  border-color: var(--ds-teal-400);
  color: var(--ds-teal-900);
}

[part="icon"] {
  font-size: inherit;
  flex: none;
  align-self: flex-start;
  padding-block-start: .15em;
  display: flex;
}

.body {
  flex: 1;
  min-inline-size: 8rem;
}

[part="heading"] {
  font-weight: var(--acme-font-weight-600);
  margin-block-end: var(--acme-spacing-1);
}

[part="actions"], [part="end"] {
  align-items: center;
  gap: var(--acme-spacing-2);
  flex-wrap: wrap;
  max-inline-size: 100%;
  display: flex;
}

[part="close"] {
  flex: none;
}

[hidden] {
  display: none;
}

@media (forced-colors: active) {
  [part="root"] {
    color: canvastext;
    border-color: canvastext;
  }
}
`;
