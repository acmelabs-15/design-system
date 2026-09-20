// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const drawerBackdropCss = css`dialog::backdrop {
  background-color: var(--ds-black);
  transition-property: opacity;
  transition-duration: .3s;
  transition-timing-function: cubic-bezier(.32, .72, 0, 1);
  animation-duration: .3s;
  animation-timing-function: cubic-bezier(.32, .72, 0, 1);
  position: fixed;
  inset: 0;
}

dialog:where(.nested)::backdrop {
  z-index: calc(var(--ds-z-modal) + 1);
}

dialog:where(:not(.nested))::backdrop {
  z-index: var(--ds-z-drawer);
}

@supports (color: color-mix(in lab, red, red)) {
  dialog::backdrop {
    background-color: color-mix(in oklab, var(--ds-black) 40%, transparent);
  }
}

dialog[data-ending-style]::backdrop, dialog[data-starting-style]::backdrop {
  opacity: 0;
}
`;
