// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const stepsCss = css`:host {
  min-inline-size: 0;
  display: block;
}

[part="root"] {
  gap: var(--acme-spacing-4);
  flex-direction: column;
  display: flex;
}

[part="list"] {
  gap: var(--acme-spacing-3);
  min-inline-size: 0;
  display: flex;
  overflow-x: auto;
}

[data-orientation="vertical"] [part="list"] {
  flex-direction: column;
}

[part="actions"] {
  gap: var(--acme-spacing-2);
  display: flex;
}

[hidden] {
  display: none !important;
}

[part="list"]:focus-visible, [part="completed"]:focus-visible {
  outline: 2px solid var(--ds-focus-color);
  outline-offset: 2px;
}

@media (forced-colors: active) {
  [part="list"]:focus-visible, [part="completed"]:focus-visible {
    outline-color: highlight;
  }
}
`;
