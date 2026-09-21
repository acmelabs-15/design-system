// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const tableCss = css`.root {
  width: 100%;
  position: relative;
  overflow-x: auto;
}

.root :where(table) :where(.spacer) {
  height: .75rem;
  display: block;
}

.root :where(table) :where(thead) :where(tr) :where(th) {
  height: var(--ds-size-medium);
  border-color: var(--ds-gray-400);
  text-align: left;
  vertical-align: middle;
  font-weight: var(--acme-font-weight-500);
  white-space: nowrap;
  color: var(--ds-gray-900);
  padding-inline: .5rem;
}

.root :where(table) {
  caption-side: bottom;
  width: 100%;
  font-size: .875rem;
  line-height: calc(1.25 / .875);
  color: var(--ds-gray-900);
}

.root :where(table) :where(tfoot) {
  border-top-style: solid;
  border-top-width: 1px;
  border-color: var(--ds-gray-400);
  font-weight: var(--acme-font-weight-500);
}

.root :where(table) :where(.body) :where(tr) :where(td) {
  vertical-align: middle;
  white-space: nowrap;
  padding-block: .625rem;
  padding-inline: .5rem;
}

.root :where(table) :where(tfoot) :where(tr) :where(td) {
  vertical-align: middle;
  font-weight: var(--acme-font-weight-500);
  white-space: nowrap;
  color: var(--ds-gray-1000);
  padding-block: .625rem;
  padding-inline: .5rem;
}

.root :where(table) :where(thead) :where(tr), .root :where(table) :where(.body) :where(tr), .root :where(table) :where(tfoot) :where(tr) {
  transition-property: color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --acme-gradient-from, --acme-gradient-via, --acme-gradient-to;
  transition-duration: .15s;
  transition-timing-function: cubic-bezier(.4, 0, .2, 1);
}

.root:where(.compact) :where(table) :where(.body) td {
  padding-block: 5px;
}

.root :where(table) :where(thead) tr {
  border-bottom-style: solid;
  border-bottom-width: 1px;
  border-color: var(--ds-gray-400);
}

.root:where(.striped) :where(table) :where(.body) tr:where(:nth-child(odd)) {
  background-color: var(--ds-background-200);
}

.root :where(table) :where(thead) :where(tr) :where(th):last-child, .root :where(table) :where(.body) :where(tr) :where(td):last-child, .root :where(table) :where(tfoot) :where(tr) :where(td):last-child {
  text-align: right;
}

.root:where(.compact) :where(table) :where(.body) [data-cell-link="true"] {
  padding-block: 5px;
}

.root :where(table) :where(.body) :where(tr) :where(td):has([data-cell-link="true"]), .root :where(table) :where(tfoot) :where(tr) :where(td):has([data-cell-link="true"]) {
  padding: 0;
}

.root :where(table) :where(thead) :where(tr) :where(th):has(acme-checkbox), .root :where(table) :where(.body) :where(tr) :where(td):has(acme-checkbox), .root :where(table) :where(tfoot) :where(tr) :where(td):has(acme-checkbox) {
  padding-right: 0;
}

.root :where(table) :where(thead) :where(tr) :where(th) > acme-checkbox, .root :where(table) :where(.body) :where(tr) :where(td) > acme-checkbox, .root :where(table) :where(tfoot) :where(tr) :where(td) > acme-checkbox {
  translate: 0 2px;
}

.root :where(table) :where(.body) td:first-child {
  border-top-left-radius: .375rem;
  border-bottom-left-radius: .375rem;
}

.root :where(table) :where(.body) td:last-child {
  border-top-right-radius: .375rem;
  border-bottom-right-radius: .375rem;
}

.root:where(.interactive) :where(table) :where(.body) tr[data-hover] {
  background-color: var(--ds-gray-100);
}

.root:where(.bordered) :where(table) :where(.body) tr:not(:last-child) {
  border-bottom-style: solid;
  border-bottom-width: 1px;
  border-color: var(--ds-gray-400);
}

.root :where(table) :where(tfoot) > tr:last-child {
  border-bottom-style: solid;
  border-bottom-width: 0;
}
`;
