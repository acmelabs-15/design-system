// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
import { withStyleProperties } from "../../../shared/style-properties";
export const sheetCss = /* @__PURE__ */ withStyleProperties(css`dialog {
  z-index: var(--ds-z-drawer);
  background-color: var(--ds-background-100);
  box-shadow: var(--ds-shadow-modal-elevated);
  gap: 1rem;
  transition-property: color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --acme-gradient-from, --acme-gradient-via, --acme-gradient-to, opacity, box-shadow, transform, translate, scale, rotate, filter, -webkit-backdrop-filter, backdrop-filter, display, content-visibility, overlay, pointer-events;
  transition-duration: .15s;
  transition-timing-function: cubic-bezier(.4, 0, .2, 1);
  animation-timing-function: cubic-bezier(.4, 0, .2, 1);
  position: fixed;
}

dialog:where(:is(.top, .bottom)) {
  inset-inline: 0;
}

dialog:where(:not(.top, .bottom)) {
  inset-block: 0;
}

dialog:where(.top) {
  top: 0;
}

dialog:where(:not(.top, .bottom, .left)) {
  right: 0;
}

dialog:where(.bottom) {
  bottom: 0;
}

dialog:where(.left) {
  left: 0;
}

dialog:where(.inset) {
  border-radius: 1rem;
  flex-direction: column;
  width: calc(100% - 1.5rem);
  height: calc(100% - 1.5rem);
  margin: .75rem;
  padding: 0;
  display: flex;
}

dialog :where(.footer) {
  flex-direction: row;
  justify-content: flex-end;
  gap: .5rem;
  margin-top: auto;
  padding: 1.5rem;
  display: flex;
}

dialog :where(.header) {
  flex-direction: column;
  display: flex;
}

dialog:where(:not(.top, .bottom):not(.inset)) {
  width: 75%;
  height: 100%;
}

dialog:where(:not(.inset)) {
  padding: 1.5rem;
}

dialog:where(.inset) :where(.header) {
  text-align: left;
  padding: 1.5rem;
}

dialog :where(.body) {
  font-family: var(--acme-font-sans);
  font-size: .875rem;
  line-height: 20px;
  font-weight: var(--acme-font-weight-400);
  color: var(--ds-gray-900);
  padding-block: 1rem;
  padding-inline: 1.5rem;
}

dialog:where(:not(.inset)) :where(.header) {
  text-align: center;
}

dialog :where(.header) :where(.title) {
  font-size: 1.125rem;
  line-height: calc(1.75 / 1.125);
  font-weight: var(--acme-font-weight-600);
  color: var(--ds-gray-1000);
}

@media (width >= 401px) {
  dialog:where(.inset) {
    max-width: auto;
  }

  dialog:where(:not(.top, .bottom):not(.inset)) {
    max-width: 24rem;
  }

  dialog :where(.footer) {
    flex-direction: row;
    justify-content: flex-end;
  }

  dialog :where(.header) {
    text-align: left;
  }
}

@media (width >= 961px) {
  dialog:where(.inset) {
    width: 512px;
  }
}

dialog :where(.body) > slot::slotted(strong), dialog :where(.body) > slot > strong {
  color: var(--ds-gray-1000) !important;
  font-weight: var(--acme-font-weight-550) !important;
}

dialog[data-focus] {
  outline-style: none;
}

dialog[data-state="closed"] {
  --acme-exit-opacity: 0;
  --acme-exit-scale: initial;
  --acme-exit-rotate: initial;
  --acme-exit-translate-x: initial;
  --acme-exit-translate-y: initial;
  transition-duration: .2s;
  animation: .2s cubic-bezier(.4, 0, .2, 1) exit;
}

dialog:where(.bottom)[data-state="closed"] {
  --acme-exit-translate-y: calc(.1 * 100%);
}

dialog:where(.left)[data-state="closed"] {
  --acme-exit-translate-x: calc(.1 * -100%);
}

dialog:where(:not(.top, .bottom, .left))[data-state="closed"] {
  --acme-exit-translate-x: calc(.1 * 100%);
}

dialog:where(.top)[data-state="closed"] {
  --acme-exit-translate-y: calc(.1 * -100%);
}

dialog[data-state="open"] {
  --acme-enter-opacity: 0;
  --acme-enter-scale: initial;
  --acme-enter-rotate: initial;
  --acme-enter-translate-x: initial;
  --acme-enter-translate-y: initial;
  transition-duration: .2s;
  animation: .2s cubic-bezier(.4, 0, .2, 1) enter;
}

dialog:where(.bottom)[data-state="open"] {
  --acme-enter-translate-y: e;
}

dialog:where(.left)[data-state="open"] {
  --acme-enter-translate-x: -e;
}

dialog:where(:not(.top, .bottom, .left))[data-state="open"] {
  --acme-enter-translate-x: e;
}

dialog:where(.top)[data-state="open"] {
  --acme-enter-translate-y: -e;
}

@keyframes exit {
  to {
    opacity: var(--acme-exit-opacity, 1);
    transform: translate3d(var(--acme-exit-translate-x, 0), var(--acme-exit-translate-y, 0), 0) scale3d(var(--acme-exit-scale, 1), var(--acme-exit-scale, 1), var(--acme-exit-scale, 1)) rotate(var(--acme-exit-rotate, 0));
  }
}

@keyframes enter {
  0% {
    opacity: var(--acme-enter-opacity, 1);
    transform: translate3d(var(--acme-enter-translate-x, 0), var(--acme-enter-translate-y, 0), 0) scale3d(var(--acme-enter-scale, 1), var(--acme-enter-scale, 1), var(--acme-enter-scale, 1)) rotate(var(--acme-enter-rotate, 0));
  }
}
`, [{"name":"--acme-exit-opacity","syntax":"*","inherits":false,"initialValue":"1"},{"name":"--acme-exit-translate-x","syntax":"*","inherits":false,"initialValue":"0"},{"name":"--acme-exit-translate-y","syntax":"*","inherits":false,"initialValue":"0"},{"name":"--acme-exit-scale","syntax":"*","inherits":false,"initialValue":"1"},{"name":"--acme-exit-rotate","syntax":"*","inherits":false,"initialValue":"0"},{"name":"--acme-enter-opacity","syntax":"*","inherits":false,"initialValue":"1"},{"name":"--acme-enter-translate-x","syntax":"*","inherits":false,"initialValue":"0"},{"name":"--acme-enter-translate-y","syntax":"*","inherits":false,"initialValue":"0"},{"name":"--acme-enter-scale","syntax":"*","inherits":false,"initialValue":"1"},{"name":"--acme-enter-rotate","syntax":"*","inherits":false,"initialValue":"0"}]);
