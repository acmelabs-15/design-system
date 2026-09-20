// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const commandMenuCss = css`dialog :where(.title), dialog :where(.desc) {
  clip-path: inset(50%);
  white-space: nowrap;
  border-width: 0;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  position: absolute;
  overflow: hidden;
}

dialog {
  z-index: 100;
  transform-origin: 50%;
  background-color: var(--ds-background-100);
  width: 640px;
  box-shadow: var(--ds-shadow-modal);
  border-radius: .75rem;
  outline-style: none;
  transition-property: transform, translate, scale, rotate;
  transition-duration: .1s;
  transition-timing-function: cubic-bezier(.4, 0, .2, 1);
  animation-duration: .1s;
  animation-timing-function: cubic-bezier(.4, 0, .2, 1);
  position: fixed;
  top: 15%;
  left: 50%;
  overflow: hidden;
  translate: -50%;
}

@media (forced-colors: active) {
  dialog {
    outline-offset: 2px;
    outline: 2px solid #0000;
  }
}

dialog[data-state="closed"] {
  animation: cmdkScaleOut var(--ds-motion-overlay-duration) var(--ds-motion-overlay-timing);
}

dialog[data-state="open"] {
  animation: cmdkScaleIn var(--ds-motion-overlay-duration) var(--ds-motion-overlay-timing);
}

@keyframes cmdkScaleOut {
  0% {
    opacity: 1;
    transform: scale(1);
  }

  to {
    transform: scale(var(--ds-motion-overlay-scale));
    opacity: 0;
  }
}

@keyframes cmdkScaleIn {
  0% {
    transform: scale(var(--ds-motion-overlay-scale));
    opacity: 0;
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}
`;
