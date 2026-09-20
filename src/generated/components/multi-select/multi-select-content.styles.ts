// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
import { withStyleProperties } from "../../../shared/style-properties";
export const multiSelectContentCss = /* @__PURE__ */ withStyleProperties(css`.content {
  max-height: min(calc(var(--acme-popover-content-available-height) - 16px), 384px);
  min-width: var(--acme-popover-trigger-width);
  background-color: var(--ds-background-100);
  box-shadow: var(--ds-shadow-menu);
  border-radius: 12px;
  outline-style: none;
  padding: .5rem;
  overflow-y: scroll;
}

.content[data-state="closed"] {
  --acme-exit-opacity: 0;
  --acme-exit-scale: initial;
  --acme-exit-rotate: initial;
  --acme-exit-translate-x: initial;
  --acme-exit-translate-y: initial;
  transition-duration: .2s;
  animation: .2s exit;
}

@keyframes exit {
  to {
    opacity: var(--acme-exit-opacity, 1);
    transform: translate3d(var(--acme-exit-translate-x, 0), var(--acme-exit-translate-y, 0), 0) scale3d(var(--acme-exit-scale, 1), var(--acme-exit-scale, 1), var(--acme-exit-scale, 1)) rotate(var(--acme-exit-rotate, 0));
  }
}
`, [{"name":"--acme-exit-opacity","syntax":"*","inherits":false,"initialValue":"1"},{"name":"--acme-exit-translate-x","syntax":"*","inherits":false,"initialValue":"0"},{"name":"--acme-exit-translate-y","syntax":"*","inherits":false,"initialValue":"0"},{"name":"--acme-exit-scale","syntax":"*","inherits":false,"initialValue":"1"},{"name":"--acme-exit-rotate","syntax":"*","inherits":false,"initialValue":"0"}]);
