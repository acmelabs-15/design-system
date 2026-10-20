// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const emptyStateSurfaceCss = css`:host {
  min-inline-size: 0;
  display: block;
}

[data-kind="root"] {
  align-items: center;
  gap: var(--acme-spacing-6);
  box-sizing: border-box;
  inline-size: 100%;
  padding: var(--acme-spacing-12) var(--acme-spacing-6);
  border-radius: var(--r);
  background: var(--ds-background-100);
  text-align: center;
  overflow-wrap: anywhere;
  border: 1px solid #0000;
  flex-direction: column;
  display: flex;
}

[data-kind="root"][data-size="small"] {
  padding: var(--acme-spacing-6) var(--acme-spacing-4);
  gap: var(--acme-spacing-4);
}

[data-kind="root"][data-size="large"] {
  padding: var(--acme-spacing-16) var(--acme-spacing-8);
  gap: var(--acme-spacing-8);
}

[data-kind="root"][data-variant="outline"] {
  border-color: var(--ds-gray-200);
}

[data-kind="root"][data-variant="subtle"] {
  background: var(--ds-background-200);
}

[part="content"], [data-kind="content"] {
  align-items: center;
  gap: var(--acme-spacing-2);
  text-align: center;
  flex-direction: column;
  min-inline-size: 0;
  max-inline-size: 100%;
  display: flex;
}

[data-kind="content"] slot {
  align-items: center;
  gap: var(--acme-spacing-2);
  flex-direction: column;
  max-inline-size: 100%;
  display: flex;
}

[part="heading"], [part="description"] {
  text-wrap: balance;
  max-inline-size: min(100%, 340px);
}

[part="description"] {
  color: var(--ds-gray-900);
  font-size: .875rem;
  line-height: 1.5;
}

[part="actions"] {
  justify-content: center;
  align-items: center;
  gap: var(--acme-spacing-3);
  flex-wrap: wrap;
  max-inline-size: 100%;
  display: flex;
}

[data-kind="indicator"], [part="indicator"] {
  color: var(--ds-gray-900);
  justify-content: center;
  align-items: center;
  max-inline-size: 100%;
  display: flex;
}

[hidden] {
  display: none;
}

@media (forced-colors: active) {
  [data-variant="outline"] {
    border-color: canvastext;
  }
}
`;
