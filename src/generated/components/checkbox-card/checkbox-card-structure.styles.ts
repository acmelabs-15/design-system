// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const checkboxCardStructureCss = css`:host {
  min-inline-size: 0;
  display: inline-flex;
}

.card {
  border: 1px solid var(--border);
  border-radius: var(--r, 8px);
  background: var(--ds-background-100);
  inline-size: 100%;
  min-inline-size: 0;
  color: var(--ds-gray-1000);
  flex-direction: column;
  display: flex;
}

.activation {
  inline-size: 100%;
  padding: var(--acme-spacing-4);
  gap: var(--acme-spacing-2-5);
  border-radius: inherit;
  font-size: var(--acme-form-font, .875rem);
  line-height: var(--acme-form-line-height, 1.25rem);
  flex: 1;
}

.content {
  gap: var(--acme-spacing-1);
  flex: 1;
  min-inline-size: 0;
}

[part="label"] {
  font-weight: var(--acme-font-weight-500);
}

[part="description"] {
  font-size: var(--acme-form-small-font, .8125rem);
}

.affix {
  flex: none;
  align-items: center;
  display: inline-flex;
}

.card[data-size="small"] .activation {
  font-size: var(--acme-form-font, .875rem);
  line-height: var(--acme-form-line-height, 1.25rem);
  padding: var(--acme-spacing-3);
  gap: var(--acme-spacing-1-5);
}

.card[data-size="large"] .activation {
  gap: var(--acme-spacing-3-5);
  font-size: var(--acme-form-large-font, 1rem);
}

.card[data-variant="secondary"] {
  background: var(--comp);
}

.card:is([data-checked], [data-indeterminate]) {
  border-color: var(--accent);
  box-shadow: inset 0 0 0 1px var(--accent);
}

.card[data-variant="secondary"]:is([data-checked], [data-indeterminate]) {
  background: var(--ds-blue-100);
}

.card[data-invalid] {
  border-color: var(--warn-solid);
}

.card[data-disabled] {
  color: var(--ds-gray-700);
  background: var(--comp);
}

.card .native:focus-visible + .indicator {
  box-shadow: none;
}

.card:has(.native:focus-visible) {
  box-shadow: var(--ds-focus-ring);
}

.actions {
  align-items: center;
  gap: var(--acme-spacing-2);
  padding: var(--acme-spacing-2) var(--acme-spacing-4);
  border-block-start: 1px solid var(--border);
  display: flex;
}

[hidden] {
  display: none;
}

@media (forced-colors: active) {
  .card {
    border-color: buttontext;
  }

  .card:is([data-checked], [data-indeterminate]) {
    border-color: highlight;
  }

  .card:has(.native:focus-visible) {
    outline-offset: 2px;
    outline: 2px solid highlight;
  }
}
`;
