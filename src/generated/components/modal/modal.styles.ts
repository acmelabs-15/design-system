// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const modalCss = css`.modal:where(.sheet) {
  pointer-events: auto;
  width: 100%;
  max-height: 90dvh;
  translate: 0 var(--drawer-swipe-movement-y, 0px);
  border-top-style: solid;
  border-top-width: 1px;
  border-color: var(--ds-gray-alpha-400);
  background-color: var(--ds-background-100);
  border-top-left-radius: .75rem;
  border-top-right-radius: .75rem;
  outline-style: none;
  transition-property: transform, translate, scale, rotate;
  transition-duration: .4s;
  transition-timing-function: cubic-bezier(.32, .72, 0, 1);
  animation-duration: .4s;
  animation-timing-function: cubic-bezier(.32, .72, 0, 1);
}

.modal :where(.body) :where(.probe-top) {
  pointer-events: none;
  width: 100%;
  height: 1px;
  position: absolute;
  top: 0;
}

.modal :where(.body) :where(.probe-bottom) {
  pointer-events: none;
  width: 100%;
  height: 1px;
}

.modal:where(:not(.sticky)) :where(.fade-wrap) :where(.fade) {
  pointer-events: none;
  background-image: linear-gradient(180deg,var(--ds-background-100) 25%,#fff0 100%);
  border-top-left-radius: .75rem;
  border-top-right-radius: .75rem;
  width: 100%;
  height: 1.5rem;
  position: absolute;
  top: 0;
  left: 0;
}

.modal :where(.body) {
  border-top-left-radius: var(--modal-radius);
  border-top-right-radius: var(--modal-radius);
  font-family: var(--acme-font-sans);
  font-size: 14px;
  line-height: 20px;
  font-weight: var(--acme-font-weight-400);
  color: var(--ds-gray-900);
  padding: 0;
  position: relative;
  overflow-x: hidden;
}

.modal:where(.sticky) {
  position: sticky;
}

.modal :where(.actions) {
  flex-shrink: 0;
  justify-content: space-between;
  padding: .75rem;
  display: flex;
  position: sticky;
  bottom: 0;
}

.modal :where(.body) :where(.content) :where(.header) {
  z-index: 10;
  color: var(--ds-gray-1000);
  margin-bottom: 1.25rem;
}

.modal :where(.body) :where(.content) :where(.header) :where(.subtitle) {
  font-family: var(--acme-font-sans);
  font-size: 14px;
  line-height: 20px;
  font-weight: var(--acme-font-weight-400);
  color: var(--ds-gray-900);
  margin-top: .5rem;
  margin-bottom: .25rem;
}

.modal:where(:not(.sheet)) {
  background-color: var(--ds-background-100);
  max-width: 100%;
  max-height: min(800px, 80vh);
  color: var(--ds-gray-1000);
  box-shadow: var(--ds-shadow-modal-elevated);
  transition-property: opacity, transform;
  transition-timing-function: var(--ds-motion-overlay-timing);
  transition-duration: var(--ds-motion-overlay-duration);
  --modal-padding: 24px;
  animation-duration: var(--ds-motion-overlay-duration);
  animation-timing-function: var(--ds-motion-overlay-timing);
  border-radius: .75rem;
  flex-direction: column;
  display: flex;
}

.modal:where(.sticky) :where(.fade-wrap) :where(.fade) {
  display: none;
}

.modal:where(.noscroll) {
  overflow: hidden;
}

.modal:where(.overflow) {
  overflow: visible;
}

.modal:where(:not(.noscroll)) {
  overflow-y: auto;
}

.modal:where(:not(.unpadded)) :where(.body) {
  padding: var(--modal-padding);
  --modal-padding: 20px;
  padding-top: 1.25rem;
}

.modal:where(.center) :where(.body) :where(.content) :where(.header) :where(.title) {
  text-align: center;
}

.modal:where(:not(.center)) :where(.body) :where(.content) :where(.header) :where(.title) {
  text-align: left;
}

.modal :where(.body) :where(.content) :where(.header) :where(.title) {
  font-family: var(--acme-font-sans);
  font-size: 20px;
  line-height: 26px;
  font-weight: var(--acme-font-weight-600);
  letter-spacing: -.4px;
  color: var(--ds-gray-1000);
}

@media not all and (width >= 540px) {
  .modal:where(:not(.sheet)) {
    max-width: calc(100vw - 20px);
  }
}

@media (width >= 401px) {
  .modal:where(:not(.sheet)) {
    overflow: hidden;
  }

  .modal :where(.body) {
    overflow-y: auto;
  }
}

:where(:host([data-dark])) .modal:where(:not(.unpadded)) :where(.body) {
  background-color: var(--ds-background-200);
}

.modal :where(.body) :where(.content) :where(.header) :where(.title) > strong {
  font-weight: var(--acme-font-weight-500);
  color: var(--ds-gray-900);
}

.modal :where(.body) > strong, .modal :where(.body) :where(.content) :where(.header) :where(.subtitle) > strong {
  color: var(--ds-gray-1000);
  font-weight: var(--acme-font-weight-550);
}

.modal :where(.actions) > slot::slotted(div), .modal :where(.actions) > slot > div {
  gap: 1rem !important;
  display: flex !important;
}

.modal:where(:not(.sheet)) > form {
  border-radius: .75rem;
  overflow: hidden auto;
}

.modal :where(.actions):before {
  content: "";
  z-index: calc(10 * -1);
  background-color: var(--ds-black);
  filter: blur(3px);
  width: 100%;
  height: .75rem;
  transition-property: transform, translate, scale, rotate;
  transition-duration: .2s;
  transition-timing-function: cubic-bezier(.4, 0, .2, 1);
  animation-duration: .2s;
  position: absolute;
  bottom: 100%;
  left: 0;
  translate: 0 275%;
}

@supports (color: color-mix(in lab, red, red)) {
  .modal :where(.actions):before {
    background-color: color-mix(in oklab, var(--ds-black) 7.5%, transparent);
  }
}

.modal[data-bottom-hidden] :where(.actions):before {
  content: "";
  translate: 0 75%;
}

.modal :where(.actions):after {
  content: "";
  z-index: calc(10 * -1);
  background-color: var(--ds-background-200);
  box-shadow: 0 -1px 0 0 var(--ds-gray-alpha-400);
  border-radius: 0;
  position: absolute;
  inset: 0;
}

.modal :where(.body) :where(.content) :where(.header)[data-last] {
  margin-bottom: 0;
}

.modal:where(.sheet)[data-ending-style], .modal:where(.sheet)[data-starting-style] {
  translate: 0 100%;
}

@media (width >= 401px) {
  .modal :where(.actions):after {
    border-bottom-right-radius: .75rem;
    border-bottom-left-radius: .75rem;
  }
}

:where(:host([data-dark])) .modal :where(.actions):before {
  content: "";
  background-color: var(--ds-white);
}

@supports (color: color-mix(in lab, red, red)) {
  :where(:host([data-dark])) .modal :where(.actions):before {
    background-color: color-mix(in oklab, var(--ds-white) 10%, transparent);
  }
}

.modal:where(.sticky) :where(.body) :where(.content) :where(.header) {
  margin-right: calc(calc(var(--modal-padding)) * -1);
  margin-left: calc(calc(var(--modal-padding)) * -1);
  justify-content: flex-start;
  align-items: center;
  gap: .625rem;
  padding-block: 1rem;
  padding-inline: 1.5rem;
  display: flex;
  position: sticky;
  top: 0;
}

.modal:where(.sticky) :where(.body) :where(.content) :where(.header) :where(.title) {
  padding-bottom: 0;
  font-size: 1rem;
  line-height: 1.5rem;
  display: block;
}

@media not all and (width >= 401px) {
  .modal:where(.sticky) :where(.body) :where(.content) :where(.header) {
    font-size: 1rem;
    line-height: 1.5;
  }
}

@media (width >= 401px) {
  .modal:where(.sticky) :where(.body) :where(.content) :where(.header) {
    padding-inline: var(--modal-padding);
    padding-block: 1.25rem;
  }

  .modal:where(.sticky) :where(.body) {
    padding-top: 0 !important;
  }

  .modal:where(.sticky) :where(.body) :where(.content) :where(.header) :where(.title) {
    font-size: 1.25rem !important;
    line-height: 1.5rem !important;
  }
}

.modal:where(.sticky) :where(.body) :where(.content) :where(.header):before {
  content: "";
  z-index: calc(10 * -1);
  background-color: var(--ds-black);
  opacity: 0;
  filter: blur(3px);
  width: 100%;
  height: .75rem;
  transition-property: opacity;
  transition-duration: .2s;
  transition-timing-function: cubic-bezier(.4, 0, .2, 1);
  animation-duration: .2s;
  position: absolute;
  top: 100%;
  left: 0;
  translate: 0 -75%;
}

@supports (color: color-mix(in lab, red, red)) {
  .modal:where(.sticky) :where(.body) :where(.content) :where(.header):before {
    background-color: color-mix(in oklab, var(--ds-black) 7.5%, transparent);
  }
}

.modal:where(.sticky)[data-top-hidden] :where(.body) :where(.content) :where(.header):before {
  content: "";
  opacity: 1;
}

.modal:where(.sticky) :where(.body) :where(.content) :where(.header):after {
  content: "";
  z-index: calc(1 * -1);
  background-color: var(--ds-background-200);
  box-shadow: 0 0 0 1px var(--ds-gray-alpha-400);
  position: absolute;
  inset: 0;
}

:where(:host([data-dark])) .modal:where(.sticky) :where(.body) :where(.content) :where(.header):before {
  content: "";
  background-color: var(--ds-white);
}

@supports (color: color-mix(in lab, red, red)) {
  :where(:host([data-dark])) .modal:where(.sticky) :where(.body) :where(.content) :where(.header):before {
    background-color: color-mix(in oklab, var(--ds-white) 10%, transparent);
  }
}

:where(:host([data-dark])) .modal:where(.sticky) :where(.body) :where(.content) :where(.header):after {
  content: "";
  background-color: var(--ds-background-100);
}
`;
