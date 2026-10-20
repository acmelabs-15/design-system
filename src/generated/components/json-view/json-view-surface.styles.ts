// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const jsonViewSurfaceCss = css`:host {
  vertical-align: top;
  min-inline-size: 0;
  max-inline-size: 100%;
  display: inline-block;
}

[part="root"] {
  font-family: var(--acme-font-mono);
  color: var(--ds-gray-1000);
  overflow-wrap: anywhere;
  white-space: pre-wrap;
  font-size: 13px;
  line-height: 20px;
}

[part="item"] {
  outline: none;
}

.row {
  border-radius: 4px;
  min-block-size: 20px;
  display: inline;
  position: relative;
}

.row[data-branch] {
  cursor: pointer;
}

.group {
  padding-inline-start: 16px;
}

[part="toggle"] {
  vertical-align: text-bottom;
  block-size: 16px;
  inline-size: 16px;
  color: var(--ds-gray-900);
  cursor: pointer;
  display: inline-flex;
}

[aria-expanded="true"] > .row > [part="toggle"] {
  transform: rotate(90deg);
}

[data-direction="rtl"] [aria-expanded="false"] > .row > [part="toggle"] {
  transform: rotate(180deg);
}

[part="item"]:focus-visible > .row {
  outline: 2px solid var(--ds-focus-color);
  outline-offset: 1px;
}

@media (hover: hover) {
  .row[data-branch]:hover {
    background: var(--ds-gray-200);
  }
}

[data-kind="string"] > .row > [part="value"] {
  color: var(--ds-green-900);
}

[data-kind="number"] > .row > [part="value"], [data-kind="bigint"] > .row > [part="value"] {
  color: var(--ds-blue-900);
}

[data-kind="boolean"] > .row > [part="value"] {
  color: var(--ds-purple-900);
}

[data-kind="null"] > .row > [part="value"], [data-kind="undefined"] > .row > [part="value"], [data-kind="accessor"] > .row > [part="value"], [data-kind="circular"] > .row > [part="value"], [data-kind="unsupported"] > .row > [part="value"] {
  color: var(--ds-gray-900);
}

[data-inline] > .group {
  padding-inline-start: 0;
  display: inline;
}

[data-inline] > .group > [part="item"] {
  display: inline;
}

[data-inline] > .group:before, [data-inline] > .closing:before {
  content: " ";
}

mark {
  color: var(--ds-gray-1000);
  background: var(--ds-amber-300);
  border-radius: 2px;
}

[hidden] {
  display: none !important;
}
`;
