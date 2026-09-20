// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const itemCss = css`.item {
  border-bottom: 1px solid var(--hair);
  align-items: center;
  gap: 12px;
  min-width: 0;
  padding: 10px 0;
  display: flex;
}

.item:last-child {
  border-bottom: 0;
}

.item .body {
  flex: 1;
  min-width: 0;
}

.item .title {
  color: var(--text);
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  overflow: hidden;
}

.item .meta {
  font-size: var(--t-xs);
  color: var(--text-2);
  flex-wrap: wrap;
  align-items: center;
  gap: 2px 6px;
  margin-top: 1px;
  line-height: 16px;
  display: flex;
}

.item .meta .ic {
  width: 12px;
  height: 12px;
}

.item .meta .badge {
  height: 18px;
  font-size: var(--t-2xs);
  padding: 0 7px;
}

.item .end {
  text-align: right;
  flex-direction: column;
  flex: none;
  align-items: flex-end;
  gap: 4px;
  display: flex;
}

.item .end.row {
  flex-direction: row;
  align-items: center;
  gap: 10px;
}

.item .amount {
  font-family: var(--mono);
  font-variant-numeric: tabular-nums;
  font-weight: 600;
  font-size: var(--t-sm);
  color: var(--text);
  line-height: 18px;
}

.item .actions {
  flex: none;
  gap: 2px;
  display: flex;
}

.item .title .badge {
  vertical-align: middle;
  margin-left: 6px;
}

.item .title .mono {
  font-family: var(--mono);
  font-size: var(--t-xs);
  color: var(--text-2);
  margin-left: 6px;
  font-weight: 400;
}

.item .amount.lg {
  font-size: var(--t-lg);
  line-height: 20px;
}

.item .end small {
  font-family: var(--mono);
  font-size: var(--t-xs);
  color: var(--text-2);
}

.item .end .progress {
  width: 64px;
  height: 4px;
}

.item .end .state {
  font-size: var(--t-xs);
  font-weight: 500;
}

.item .chev {
  color: var(--text-2);
  flex: none;
}

.item a.title {
  text-decoration: none;
}

.item a.title:hover {
  text-decoration: underline;
}

@media (width <= 560px) {
  .item {
    flex-wrap: wrap;
  }

  .item .end {
    flex-direction: row;
    flex: 100%;
    justify-content: space-between;
    align-items: center;
    padding-left: 44px;
  }

  .item .actions {
    margin-left: auto;
  }
}

.item .lead-chev {
  width: 16px;
  height: 16px;
  color: var(--text-2);
  transition: transform var(--dur) var(--ease);
  flex: none;
}

.item[aria-expanded="true"] .lead-chev {
  transform: rotate(90deg);
}

.accordion {
  border-radius: var(--r-sm);
  box-shadow: var(--ds-shadow-border-small);
  background: var(--surface);
  overflow: hidden;
}

.accordion .item {
  border-bottom: 1px solid var(--ds-gray-alpha-200);
  gap: 12px;
  min-height: 56px;
  padding: 0 16px;
}

.accordion .item:last-child {
  border-bottom: 0;
}

.accordion .sub {
  background: var(--surface-2);
  border-bottom: 1px solid var(--ds-gray-alpha-200);
}

.accordion .sub .item {
  padding-left: 16px;
}

.accordion .item .title {
  font-weight: 500;
}

.accordion .item .end .when {
  font-family: var(--sans);
  color: var(--text-2);
  font-size: 14px;
}

.acc-bar {
  border-top: 1px solid var(--ds-gray-alpha-200);
  text-align: left;
  width: 100%;
  height: 48px;
  color: var(--text);
  cursor: pointer;
  background: none;
  border-bottom: 0;
  border-left: 0;
  border-right: 0;
  align-items: center;
  gap: 8px;
  padding: 0 16px;
  font-size: 14px;
  font-weight: 500;
  display: flex;
}

.acc-bar .lead-chev {
  width: 16px;
  height: 16px;
  color: var(--text-2);
  transition: transform var(--dur) var(--ease);
}

.acc-bar[aria-expanded="true"] .lead-chev {
  transform: rotate(90deg);
}

.acc-body {
  border-top: 1px solid var(--ds-gray-alpha-200);
  flex-direction: column;
  gap: 12px;
  padding: 16px 40px;
  display: flex;
}

.acc-body.tinted {
  background: var(--surface-2);
}

.acc-body h3 {
  letter-spacing: -.28px;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
}

.select-list {
  border-radius: var(--r-sm);
  box-shadow: var(--ds-shadow-border);
  background: var(--surface);
  overflow: hidden;
}

.select-list .head {
  background: var(--surface-2);
  border-bottom: 1px solid var(--border);
  align-items: center;
  gap: 12px;
  height: 64px;
  padding: 0 24px;
  font-size: 14px;
  display: flex;
}

.select-list .head .actions {
  margin-left: auto;
}

.select-list .item {
  border-bottom: 1px solid var(--border);
  gap: 12px;
  min-height: 88px;
  padding: 0 24px;
}

.select-list .item:last-child {
  border-bottom: 0;
}

.select-list .item .title {
  text-underline-offset: 2px;
  text-decoration: underline;
}

.select-list .item .meta .check-circle {
  width: 16px;
  height: 16px;
}

.select-list .item .meta .check-circle .ic {
  width: 10px;
  height: 10px;
}
`;
