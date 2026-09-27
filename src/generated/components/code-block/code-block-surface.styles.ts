// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const codeBlockSurfaceCss = css`:host {
  min-inline-size: 0;
  display: block;
}

.root {
  border: 1px solid var(--ds-gray-400);
  border-radius: var(--r, 8px);
  background: var(--ds-background-100);
  color: var(--ds-gray-1000);
  position: relative;
  overflow: hidden;
}

[part="header"] {
  align-items: center;
  gap: var(--acme-spacing-2);
  min-block-size: var(--acme-size-12);
  padding: var(--acme-spacing-1) var(--acme-spacing-3);
  border-block-end: 1px solid var(--ds-gray-400);
  background: var(--ds-background-200);
  display: flex;
}

.filename {
  align-items: center;
  gap: var(--acme-spacing-2);
  min-inline-size: 0;
  color: var(--ds-gray-900);
  margin-inline-end: auto;
  font-size: 13px;
  line-height: 16px;
  display: flex;
}

.filename > span {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.floating {
  z-index: 1;
  opacity: 0;
  background: var(--ds-background-200);
  border-radius: var(--r);
  position: absolute;
  inset-block-start: 8px;
  inset-inline-end: 8px;
}

.root:hover .floating, .root:focus-within .floating {
  opacity: 1;
}

@media (hover: none) {
  .floating {
    opacity: 1;
  }
}

acme-scroll-area, acme-scroll-viewport, acme-scroll-viewport::part(viewport) {
  max-block-size: var(--acme-code-block-max-height, none);
}

pre {
  box-sizing: border-box;
  inline-size: max-content;
  min-inline-size: 100%;
  margin: 0;
  padding-block: 16px;
}

[part="code"] {
  text-align: start;
  white-space: pre;
  font-family: var(--acme-font-mono);
  font-feature-settings: "liga" off;
  font-size: 13px;
  line-height: 20px;
  display: grid;
}

[part="line"] {
  min-block-size: 20px;
  padding-inline: 16px;
  display: flex;
  position: relative;
}

[part="line-number"] {
  appearance: none;
  color: var(--ds-gray-900);
  font: inherit;
  text-align: end;
  user-select: none;
  cursor: pointer;
  background: none;
  border: 0;
  flex: none;
  min-inline-size: 32px;
  padding: 0 16px 0 0;
}

[part="line-number"]:focus-visible {
  outline: 2px solid var(--ds-focus-color);
  outline-offset: -1px;
}

.tokens {
  min-inline-size: 0;
}

[data-highlighted="true"] {
  background: var(--ds-blue-300);
  box-shadow: inset 2px 0 var(--ds-blue-900);
}

[data-added="true"] {
  background: var(--ds-green-300);
  box-shadow: inset 2px 0 var(--ds-green-900);
}

[data-removed="true"] {
  background: var(--ds-red-300);
  box-shadow: inset 2px 0 var(--ds-red-900);
}

[data-active="true"] {
  background: var(--ds-amber-300);
  box-shadow: inset 2px 0 var(--ds-amber-900);
}

[data-added="true"]:before, [data-removed="true"]:before {
  user-select: none;
  pointer-events: none;
  position: absolute;
  inset-inline-start: 4px;
}

[data-added="true"]:before {
  content: "+";
  color: var(--ds-green-900);
}

[data-removed="true"]:before {
  content: "−";
  color: var(--ds-red-900);
}

[data-wrap] pre {
  inline-size: 100%;
}

[data-wrap] [part="code"] {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

[part="footer"] {
  padding: var(--acme-spacing-3);
  border-block-start: 1px solid var(--ds-gray-400);
  background: var(--ds-background-200);
}

.empty {
  padding: var(--acme-spacing-4);
  color: var(--ds-gray-900);
  font-size: .875rem;
}

[hidden] {
  display: none !important;
}
`;
