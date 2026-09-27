// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const sidebarCss = css`:host {
  min-inline-size: 0;
  display: block;
}

[part="root"] {
  min-inline-size: 0;
}

aside {
  inline-size: var(--_sidebar-width, 16rem);
  background: var(--ds-background-100);
  min-inline-size: 0;
  max-inline-size: 100%;
  color: var(--ds-gray-1000);
}

aside[data-placement="start"] {
  border-inline-end: 1px solid var(--ds-gray-alpha-400);
}

aside[data-placement="end"] {
  border-inline-start: 1px solid var(--ds-gray-alpha-400);
}

aside[hidden] {
  display: none;
}

[part="trigger"]:has(slot:empty) {
  min-inline-size: 0;
}

acme-drawer::part(body) {
  padding: 0;
}
`;
