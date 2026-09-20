// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
import { withStyleProperties } from "../../../shared/style-properties";
export const projectBannerCss = /* @__PURE__ */ withStyleProperties(css`.project-banner {
  z-index: 30;
  border-top-style: solid;
  border-top-width: 1px;
  border-bottom-style: solid;
  border-bottom-width: 1px;
  justify-content: center;
  align-items: center;
  column-gap: .5rem;
  min-height: 40px;
  padding-block: .5rem;
  font-size: 14px;
  line-height: 1.25rem;
  display: flex;
  translate: 0 -1px;
}

.project-banner :where(.inner) :where(.cta) :where(.action) {
  cursor: pointer;
  height: 1.5rem;
  font-family: var(--acme-font-sans);
  text-underline-offset: 5px;
  background-color: #0000;
  border-style: none;
  border-radius: .125rem;
  outline-style: none;
  margin-block: -1px;
  padding-block: .25rem;
  padding-inline: 0;
  font-weight: 500;
  text-decoration-line: underline;
}

.project-banner :where(.inner) :where(.cta) {
  margin-left: 1.5rem;
}

.project-banner :where(.inner) {
  flex-direction: column;
  gap: .5rem;
  width: 100%;
  padding-inline: 1.5rem;
  display: flex;
}

.project-banner :where(.inner) :where(.message) {
  align-items: center;
  gap: .5rem;
  display: flex;
}

.project-banner :where(.inner) :where(.message) :where(.icon) {
  flex-shrink: 0;
}

.project-banner:where(.warning) {
  border-color: var(--ds-amber-400);
  background-color: var(--ds-amber-100);
  color: var(--ds-amber-900);
}

.project-banner:where(.success) {
  border-color: var(--ds-blue-400);
  background-color: var(--ds-blue-100);
  color: var(--ds-blue-900);
}

.project-banner:where(:not(.success, .warning, .error)) {
  border-color: var(--ds-gray-400);
  background-color: var(--ds-gray-100);
  color: var(--ds-gray-900);
}

.project-banner:where(.error) {
  border-color: var(--ds-red-400);
  background-color: var(--ds-red-100);
  color: var(--ds-red-900);
}

.project-banner:where(.warning) :where(.inner) :where(.cta) :where(.action) {
  color: var(--ds-amber-1000);
  -webkit-text-decoration-color: var(--ds-amber-400);
  text-decoration-color: var(--ds-amber-400);
}

.project-banner:where(.success) :where(.inner) :where(.cta) :where(.action) {
  color: var(--ds-blue-1000);
  -webkit-text-decoration-color: var(--ds-blue-400);
  text-decoration-color: var(--ds-blue-400);
}

.project-banner:where(:not(.success, .warning, .error)) :where(.inner) :where(.cta) :where(.action) {
  color: var(--ds-gray-1000);
  -webkit-text-decoration-color: var(--ds-gray-500);
  text-decoration-color: var(--ds-gray-500);
}

.project-banner:where(.error) :where(.inner) :where(.cta) :where(.action) {
  color: var(--ds-red-1000);
  -webkit-text-decoration-color: var(--ds-red-400);
  text-decoration-color: var(--ds-red-400);
}

@media (width >= 601px) {
  .project-banner :where(.inner) :where(.cta) {
    margin-left: 0;
  }

  .project-banner :where(.inner) {
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
}

@media (hover: hover) {
  .project-banner:where(.warning) :where(.inner) :where(.cta) :where(.action)[data-hover] {
    color: var(--ds-amber-900);
    -webkit-text-decoration-color: var(--ds-amber-500);
    text-decoration-color: var(--ds-amber-500);
  }

  .project-banner:where(.success) :where(.inner) :where(.cta) :where(.action)[data-hover] {
    color: var(--ds-blue-900);
    -webkit-text-decoration-color: var(--ds-blue-500);
    text-decoration-color: var(--ds-blue-500);
  }

  .project-banner:where(:not(.success, .warning, .error)) :where(.inner) :where(.cta) :where(.action)[data-hover] {
    color: var(--ds-gray-900);
    -webkit-text-decoration-color: var(--ds-gray-500);
    text-decoration-color: var(--ds-gray-500);
  }

  .project-banner:where(.error) :where(.inner) :where(.cta) :where(.action)[data-hover] {
    color: var(--ds-red-900);
    -webkit-text-decoration-color: var(--ds-red-500);
    text-decoration-color: var(--ds-red-500);
  }
}

.project-banner :where(.inner) :where(.cta) :where(.action)[data-focus] {
  --acme-shadow: var(--banner-focus-color) !important;
  box-shadow: var(--acme-inset-shadow), var(--acme-inset-ring-shadow), var(--acme-ring-offset-shadow), var(--acme-ring-shadow), var(--acme-shadow) !important;
}
`, [{"name":"--acme-shadow","syntax":"*","inherits":false,"initialValue":"0 0 #0000"},{"name":"--acme-inset-shadow","syntax":"*","inherits":false,"initialValue":"0 0 #0000"},{"name":"--acme-ring-shadow","syntax":"*","inherits":false,"initialValue":"0 0 #0000"},{"name":"--acme-inset-ring-shadow","syntax":"*","inherits":false,"initialValue":"0 0 #0000"},{"name":"--acme-ring-offset-shadow","syntax":"*","inherits":false,"initialValue":"0 0 #0000"}]);
