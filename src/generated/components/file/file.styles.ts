// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const fileCss = css`.file :where(.link) :where(.icon) {
  text-align: center;
  color: var(--ds-gray-900);
  margin-left: .125rem;
  margin-right: .5rem;
  display: inline-block;
}

.file :where(.link) {
  padding-inline: .5rem;
  white-space: nowrap;
  width: 100%;
  height: 1.75rem;
  color: var(--accents-8);
  -webkit-user-select: none;
  user-select: none;
  border-radius: .25rem;
  align-items: center;
  margin-left: -.5rem;
  padding-right: 1em;
  line-height: 1;
  text-decoration-line: none;
  overflow: hidden;
  display: flex !important;
}

.file :where(.link) :where(.name) {
  font-family: var(--acme-font-mono);
  text-overflow: ellipsis;
  display: block;
  overflow: hidden;
}

.file {
  white-space: nowrap;
  color: var(--accents-8);
  -webkit-user-select: none;
  user-select: none;
  flex-grow: 1;
  align-items: center;
  line-height: 1.75rem;
  list-style-type: none;
  display: flex;
}

.file:where(.active) :where(.link) {
  font-weight: var(--acme-font-weight-600);
}

.file:where(.active) :where(.link) :where(.icon) {
  color: var(--ds-gray-1000);
}

.file :where(.link) :where(.name) slot::slotted(a), .file :where(.link) :where(.name) slot > a {
  vertical-align: text-bottom !important;
  transition-property: opacity !important;
  transition-duration: .1s !important;
  transition-timing-function: cubic-bezier(.4, 0, .2, 1) !important;
  animation-duration: .1s !important;
  animation-timing-function: cubic-bezier(.4, 0, .2, 1) !important;
}

.file :where(.link) :where(.icon) svg {
  vertical-align: middle;
}

@media (hover: hover) {
  .file :where(.link)[data-hover] {
    background-color: var(--ds-gray-200);
  }
}

.file .indent {
  background-image: linear-gradient(to right,transparent 11.5px,var(--indent-color) 11.5px,var(--indent-color) 12.5px,transparent 12.5px);
  vertical-align: top;
  --indent-color: var(--ds-gray-400);
  background-repeat: no-repeat;
  flex-shrink: 0;
  width: 23px;
  height: 1.75rem;
  display: inline-block;
  translate: -.25rem;
}
`;
