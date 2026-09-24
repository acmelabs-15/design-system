// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const browserCss = css`.frame :where(.header) {
  background-color: var(--ds-background-100);
  justify-content: space-between;
  gap: 1rem;
  padding-block: .5rem;
  padding-inline: 1rem;
  display: flex;
}

.frame :where(.header) :where(.section) {
  flex: 1;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  min-width: 0;
  display: flex;
}

.frame :where(.header) :where(.section) :where(.dots) {
  align-items: center;
  gap: .5rem;
  display: flex;
}

.frame :where(.header) :where(.section) :where(.controls) {
  align-items: center;
  gap: 1rem;
  display: flex;
}

.frame :where(.header) :where(.section) :where(.address) {
  border-style: solid;
  border-width: 1px;
  border-color: var(--ds-gray-400);
  background-color: var(--ds-background-200);
  padding-block: .25rem;
  border-radius: 2147483647px;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-left: 1rem;
  padding-right: .25rem;
  display: flex;
}

.frame :where(.header) :where(.spacer) {
  flex: 1;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  min-width: 0;
  display: flex;
}

.frame :where(.header) :where(.section) :where(.dots) :where(.dot-close) {
  background-color: #fe5f57;
  border-radius: 2147483647px;
  width: .75rem;
  height: .75rem;
}

.frame :where(.header) :where(.section) :where(.dots) :where(.dot-min) {
  background-color: #febb2e;
  border-radius: 2147483647px;
  width: .75rem;
  height: .75rem;
}

.frame :where(.header) :where(.section) :where(.dots) :where(.dot-zoom) {
  background-color: #26c941;
  border-radius: 2147483647px;
  width: .75rem;
  height: .75rem;
}

.frame :where(.header) :where(.section) :where(.address) :where(.text) {
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
  min-width: 0;
  font-family: var(--acme-font-sans);
  font-size: 13px;
  line-height: 18px;
  font-weight: var(--acme-font-weight-400);
  color: var(--ds-gray-1000);
  flex: 1;
  overflow: hidden;
}

.frame {
  background-color: var(--ds-background-200);
  box-shadow: var(--ds-shadow-border-small);
  border-radius: .375rem;
  overflow: hidden;
}

@media not all and (width >= 961px) {
  .frame :where(.header) :where(.spacer) {
    display: none;
  }
}

@media not all and (width >= 601px) {
  .frame :where(.header) :where(.section) :where(.controls) {
    display: none;
  }
}

@media (width >= 601px) {
  .frame :where(.header) {
    gap: 1.5rem;
    padding-block: .625rem;
    padding-inline: 1.25rem;
  }
}

@media (width >= 961px) {
  .frame :where(.header) :where(.section) :where(.address) {
    max-width: 20rem;
  }
}

@media (width >= 601px) {
  .frame {
    border-radius: 1.5cqw;
  }
}

.frame :where(.header) :where(.section) :where(.address) :where(.text) > strong {
  color: var(--ds-gray-1000);
  font-weight: var(--acme-font-weight-550);
}

.frame :where(.header) :where(.section):first-child, .frame :where(.header) :where(.spacer):first-child {
  justify-content: flex-start;
}

.frame :where(.header) :where(.section):last-child, .frame :where(.header) :where(.spacer):last-child {
  justify-content: flex-end;
}

@media not all and (width >= 601px) {
  .frame :where(.header) :where(.section):first-child, .frame :where(.header) :where(.spacer):first-child {
    flex: none;
  }
}

@media (width >= 601px) {
  .frame :where(.header) :where(.section):first-child, .frame :where(.header) :where(.spacer):first-child, .frame :where(.header) :where(.section):last-child, .frame :where(.header) :where(.spacer):last-child {
    max-width: 140px;
  }
}
`;
