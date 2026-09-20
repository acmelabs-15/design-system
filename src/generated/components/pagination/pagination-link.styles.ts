// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const paginationLinkCss = css`.link :where(.row) :where(.chev) {
  color: var(--ds-gray-900);
  margin-top: .125rem;
  transition-property: color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --acme-gradient-from, --acme-gradient-via, --acme-gradient-to;
  transition-duration: .2s;
  transition-timing-function: cubic-bezier(.4, 0, .2, 1);
  animation-duration: .2s;
  animation-timing-function: cubic-bezier(.4, 0, .2, 1);
  position: absolute;
}

.link :where(.row) {
  display: flex;
  position: relative;
}

.link:where(.next) :where(.row) :where(.chev) {
  right: -26px;
}

.link:where(:not(.next)) :where(.row) :where(.chev) {
  left: -26px;
}

.link :where(.label) {
  font-family: var(--acme-font-sans);
  margin-bottom: .125rem;
  font-size: 13px;
  font-weight: 400;
  line-height: 18px;
  transition-property: color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --acme-gradient-from, --acme-gradient-via, --acme-gradient-to;
  transition-duration: .2s;
  transition-timing-function: cubic-bezier(.4, 0, .2, 1);
  animation-duration: .2s;
  animation-timing-function: cubic-bezier(.4, 0, .2, 1);
  color: var(--ds-gray-900) !important;
}

.link {
  border-radius: .375rem;
  padding: .25rem;
}

.link:where(.next) {
  margin-left: auto;
  padding-left: .5rem;
  padding-right: 1.75rem;
}

.link:where(:not(.next)) {
  padding-left: 1.75rem;
  padding-right: .5rem;
}

.link :where(.row) :where(.title) {
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
}

.link :where(.label) > strong {
  color: var(--ds-gray-1000);
  font-weight: 550;
}

.link :where(.row) > span {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow-wrap: break-word;
  max-width: 20em;
  display: inline-block;
  overflow: hidden;
}

@media (hover: hover) {
  .link[data-hover] :where(.label) {
    color: var(--acme-foreground) !important;
  }

  .link[data-hover] :where(.row) :where(.chev) {
    color: var(--acme-foreground);
  }
}

.link[data-focus] :where(.row) {
  box-shadow: var(--ds-focus-ring);
  outline-style: none;
}
`;
