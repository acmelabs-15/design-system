// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const singleLineControlCss = css`.root {
  align-items: stretch;
}

.entry {
  border-radius: inherit;
  flex: 1;
  align-items: center;
  min-inline-size: 0;
  display: flex;
}

.entry:has(.native:focus-visible) {
  box-shadow: var(--ds-focus-ring);
  z-index: 1;
  position: relative;
}

.root:has(.native:focus-visible) {
  box-shadow: none;
}

.native {
  block-size: calc(var(--acme-control-height) - 2px);
  padding-block: 0;
}

.native::-webkit-search-cancel-button {
  appearance: none;
}

.native::-webkit-search-decoration {
  appearance: none;
}

.affix, .addon {
  padding-inline: var(--acme-control-padding);
  font-size: var(--acme-control-font);
  line-height: var(--acme-control-line);
  flex-shrink: 0;
  align-items: center;
  display: flex;
}

.affix {
  color: var(--ds-gray-900);
}

.entry:has([part="start"]:not([hidden])) .native {
  padding-inline-start: 0;
}

.entry:has([part="end"]:not([hidden]), [part="clear"]:not([hidden]), [part="reveal"]:not([hidden])) .native {
  padding-inline-end: 0;
}

.addon {
  background: var(--ds-gray-100);
  color: var(--ds-gray-900);
}

.start-addon {
  border-inline-end: 1px solid var(--ds-gray-400);
  border-start-start-radius: inherit;
  border-end-start-radius: inherit;
}

.end-addon {
  border-inline-start: 1px solid var(--ds-gray-400);
  border-start-end-radius: inherit;
  border-end-end-radius: inherit;
}

.root:has(.start-addon:not([hidden])) .entry {
  border-start-start-radius: 0;
  border-end-start-radius: 0;
}

.root:has(.end-addon:not([hidden])) .entry {
  border-start-end-radius: 0;
  border-end-end-radius: 0;
}

[part="clear"], [part="reveal"] {
  flex-shrink: 0;
  margin-inline: 2px;
}
`;
