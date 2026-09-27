// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const tocCss = css`:host {
  min-inline-size: 0;
  display: block;
}

ol {
  margin: 0;
  padding: 0;
  list-style: none;
}

a {
  align-items: baseline;
  gap: var(--acme-spacing-2);
  padding: var(--acme-spacing-1-5) var(--acme-spacing-3);
  color: var(--ds-gray-900);
  overflow-wrap: anywhere;
  font-size: .875rem;
  line-height: 1.5;
  text-decoration: none;
  display: flex;
  position: relative;
}

li[data-level="1"] a {
  padding-inline-start: var(--acme-spacing-6);
}

li[data-level="2"] a {
  padding-inline-start: var(--acme-spacing-9);
}

li[data-level="3"] a {
  padding-inline-start: var(--acme-spacing-12);
}

li[data-level="4"] a {
  padding-inline-start: var(--acme-spacing-16);
}

li[data-level="5"] a {
  padding-inline-start: var(--acme-spacing-20);
}

[data-variant="line"] a {
  border-inline-start: 1px solid var(--ds-gray-alpha-400);
}

[part="indicator"] {
  background: var(--accent);
  inline-size: 2px;
  display: none;
  position: absolute;
  inset-block: 0;
  inset-inline-start: -1px;
}

[data-variant="line"] [aria-current="location"] [part="indicator"] {
  display: block;
}

[aria-current="location"] {
  color: var(--accent-ink, var(--accent));
  font-weight: var(--acme-font-weight-500);
}

a:hover {
  color: var(--ds-gray-1000);
}

a:focus-visible {
  outline: 2px solid var(--ds-focus-color);
  outline-offset: -2px;
}

[data-offset] {
  top: var(--_toc-offset, 0px);
  visibility: hidden;
  pointer-events: none;
  block-size: 0;
  inline-size: 0;
  position: fixed;
}

@media (forced-colors: active) {
  a:focus-visible {
    outline-color: highlight;
  }

  [aria-current="location"] {
    color: linktext;
  }

  [part="indicator"] {
    background: highlight;
  }
}
`;
