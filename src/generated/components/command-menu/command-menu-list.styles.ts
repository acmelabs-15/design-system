// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const commandMenuListCss = css`.list {
  background-color: var(--ds-background-100);
  max-height: none;
  padding: .5rem;
  transition-property: height;
  transition-duration: .1s;
  transition-timing-function: cubic-bezier(.4, 0, .2, 1);
  animation-duration: .1s;
  display: flex;
  overflow-y: auto;
}

.list :where(.sizer) :where(.empty) {
  padding-block: 30px;
  padding-inline: 0;
}

.list :where(.sizer) :where(.empty) :where(.empty-text) {
  text-align: center;
  font-family: var(--acme-font-sans);
  font-size: 14px;
  line-height: 20px;
  font-weight: var(--acme-font-weight-400);
  color: var(--ds-gray-900);
}

.list :where(.sizer) :where(.empty) :where(.empty-text) :where(.query) {
  color: var(--ds-gray-1000);
}

@media (width >= 401px) {
  .list {
    max-height: 436px;
    display: block;
  }
}

.list :where(.sizer) :where(.empty) :where(.empty-text) > strong {
  color: var(--ds-gray-1000);
  font-weight: var(--acme-font-weight-550);
}

.list .sizer {
  width: 100%;
}
`;
