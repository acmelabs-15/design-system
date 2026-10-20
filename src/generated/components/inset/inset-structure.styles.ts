// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const insetStructureCss = css`:host {
  --_inset-is: var(--_acme-inset-inline-start, 0px);
  --_inset-ie: var(--_acme-inset-inline-end, 0px);
  --_inset-bs: var(--_acme-inset-block-start, 0px);
  --_inset-be: var(--_acme-inset-block-end, 0px);
  border-radius: var(--_acme-inset-radius, 0px);
  margin-block-start: calc(-1 * var(--_inset-bs));
  margin-block-end: calc(-1 * var(--_inset-be));
  margin-inline-start: calc(-1 * var(--_inset-is));
  margin-inline-end: calc(-1 * var(--_inset-ie));
  display: block;
  overflow: clip;
}

:host([clip="false"]) {
  overflow: visible;
}

:host([side="inline"]) {
  border-radius: 0;
  margin-block: 0;
}

:host([side="block"]) {
  border-radius: 0;
  margin-inline: 0;
}

:host([side="inline-start"]) {
  border-start-end-radius: 0;
  border-end-end-radius: 0;
  margin-inline-end: 0;
}

:host([side="inline-end"]) {
  border-start-start-radius: 0;
  border-end-start-radius: 0;
  margin-inline-start: 0;
}

:host([side="block-start"]) {
  border-end-end-radius: 0;
  border-end-start-radius: 0;
  margin-block-end: 0;
}

:host([side="block-end"]) {
  border-start-start-radius: 0;
  border-start-end-radius: 0;
  margin-block-start: 0;
}

[part="root"] {
  border-radius: inherit;
  --_acme-inset-inline-start: 0px;
  --_acme-inset-inline-end: 0px;
  --_acme-inset-block-start: 0px;
  --_acme-inset-block-end: 0px;
  --_acme-inset-radius: 0px;
}
`;
