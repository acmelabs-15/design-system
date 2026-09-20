// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const drawerOverlayCss = css`dialog {
  pointer-events: none;
  align-items: flex-end;
  display: flex;
  position: fixed;
  inset: 0;
}

dialog:where(.nested) {
  z-index: calc(var(--ds-z-modal) + 1);
}

dialog:where(:not(.nested)) {
  z-index: var(--ds-z-drawer);
}
`;
