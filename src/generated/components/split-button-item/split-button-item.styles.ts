// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const splitButtonItemCss = css`.item {
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

.item :where(.body) {
  flex-direction: column;
  row-gap: .25rem;
  display: flex;
}

.item :where(.body) :where(.row) {
  align-items: center;
  column-gap: .5rem;
  display: flex;
}

.item :where(.body) :where(.desc) {
  font-family: var(--acme-font-sans);
  color: var(--ds-gray-900);
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
}

.item :where(.body) :where(.row) :where(.title) {
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
}

@media not all and (width >= 601px) {
  .item {
    height: var(--ds-size-large);
    font-size: 1rem;
    line-height: 1.5;
  }
}

.item :where(.body) :where(.desc) > strong {
  color: var(--ds-gray-1000);
  font-weight: 550;
}

.item:disabled, .item[aria-disabled="true"] {
  pointer-events: none;
  cursor: default;
  color: var(--ds-gray-700);
}

.item[data-highlighted], .item[data-selected] {
  background-color: var(--ds-gray-alpha-100);
}
`;
