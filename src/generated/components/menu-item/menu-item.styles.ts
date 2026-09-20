// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const menuItemCss = css`.item :where(.start) {
  margin-right: var(--acme-gap-quarter);
  display: flex;
}

.item :where(.end) {
  padding-left: var(--acme-gap-half);
  margin-left: auto;
  display: flex;
}

.item {
  height: var(--ds-popover-row-height);
  cursor: pointer;
  border-radius: var(--ds-popover-row-radius);
  width: 100%;
  padding: var(--ds-popover-row-padding);
  color: var(--ds-gray-1000);
  outline-style: none;
  align-items: center;
  display: flex;
}

.item:where(.error) {
  color: var(--ds-red-900) !important;
}

@media not all and (width >= 601px) {
  .item {
    height: var(--ds-size-large);
    font-size: 1rem;
    line-height: 1.5;
  }
}

.item[aria-disabled="true"] {
  pointer-events: none;
  cursor: default;
  color: var(--ds-gray-700);
}

.item:where(.error)[aria-disabled="true"] {
  color: var(--ds-gray-700) !important;
}

.item:where(:not(.error))[data-highlighted] {
  background-color: var(--ds-gray-alpha-100);
}

.item:where(.error)[data-highlighted] {
  background-color: var(--ds-red-100);
}

.item:where(:not(.error))[data-selected] {
  background-color: var(--ds-gray-alpha-100);
}

.item:where(.error)[data-selected] {
  background-color: var(--ds-red-100);
}
`;
