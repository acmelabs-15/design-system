// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const treeViewCss = css`:host {
  min-inline-size: 0;
  display: block;
}

[part="root"] {
  min-inline-size: 0;
}

[part~="content"] {
  align-items: center;
  gap: var(--acme-spacing-1-5);
  padding: var(--acme-spacing-1-5) var(--acme-spacing-2);
  min-block-size: var(--acme-spacing-8);
  box-sizing: border-box;
  border-radius: var(--r-sm);
  color: var(--ds-gray-1000);
  cursor: pointer;
  overflow-wrap: anywhere;
  font-size: .875rem;
  line-height: 1.5;
  text-decoration: none;
  display: flex;
}

[part~="content"]:hover {
  background: var(--ds-gray-100);
}

[part~="content"][data-selected="true"] {
  background: var(--accent-weak);
  color: var(--accent-ink);
}

[part~="content"]:focus-visible, [part="root"]:focus-visible {
  outline: 2px solid var(--ds-focus-color);
  outline-offset: -2px;
}

[part~="content"][aria-disabled="true"] {
  color: var(--ds-gray-700);
  cursor: not-allowed;
}

[part="children"] {
  padding-inline-start: var(--acme-spacing-5);
}

[part="children"][hidden] {
  display: none;
}

[part="indicator"] {
  inline-size: var(--acme-spacing-4);
  flex: none;
  justify-content: center;
  align-items: center;
  display: flex;
}

[data-expanded="true"] > [part="indicator"] {
  transform: rotate(90deg);
}

:host(:dir(rtl)) [data-expanded="false"] > [part="indicator"] {
  transform: rotate(180deg);
}

slot {
  flex: 1;
  min-inline-size: 0;
  display: block;
}

@media (forced-colors: active) {
  [part~="content"][data-selected="true"] {
    color: highlight;
    outline: 1px solid highlight;
  }

  [part~="content"]:focus-visible {
    outline: 2px solid highlight;
  }

  [part~="content"][aria-disabled="true"] {
    color: graytext;
  }
}
`;
