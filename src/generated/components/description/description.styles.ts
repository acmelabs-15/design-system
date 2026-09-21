// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const descriptionCss = css`.description {
  margin: 0;
}

.description :where(.title) {
  white-space: nowrap;
  min-height: 14px;
  color: var(--ds-gray-900);
  text-transform: capitalize;
  margin-bottom: .5rem;
  font-size: .875rem;
  line-height: 14px !important;
}

.description :where(.title) :where(.info) {
  vertical-align: -2px;
  margin-left: .25rem;
  display: inline-block;
}

.description :where(.title) :where(.info) :where(.trigger) {
  align-items: center;
  height: fit-content;
  display: inline-flex;
}

.description:where(.ellipsis) {
  width: 100%;
}

.description:where(.right) {
  text-align: right;
}

.description :where(.content) {
  font-size: .875rem;
  font-weight: var(--acme-font-weight-500);
  color: var(--ds-gray-1000);
  line-height: 1rem !important;
}

.description:where(.ellipsis) > dd, .description:where(.ellipsis) > dt {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
`;
