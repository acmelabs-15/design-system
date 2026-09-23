// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const statusCss = css`:host {
  min-inline-size: 0;
  display: inline-flex;
}

[part="root"] {
  align-items: center;
  gap: var(--acme-spacing-2);
  min-inline-size: 0;
  color: var(--ds-gray-1000);
  font-size: .875rem;
  line-height: 1.5;
  display: inline-flex;
}

[part="indicator"] {
  background: var(--ds-gray-700);
  border-radius: 50%;
  flex: none;
  block-size: .625rem;
  inline-size: .625rem;
  display: inline-block;
}

[data-variant="info"] [part="indicator"] {
  background: var(--ds-blue-700);
}

[data-variant="success"] [part="indicator"] {
  background: var(--ds-green-700);
}

[data-variant="warning"] [part="indicator"] {
  background: var(--ds-amber-700);
}

[data-variant="error"] [part="indicator"] {
  background: var(--ds-red-700);
}

[part="label"] {
  overflow-wrap: anywhere;
  min-inline-size: 0;
}

@media (forced-colors: active) {
  [part="indicator"] {
    background: canvastext;
  }
}
`;
