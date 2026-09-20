// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const modalOverlayCss = css`dialog:where(.sheet) {
  pointer-events: none;
  z-index: var(--ds-z-modal);
  align-items: flex-end;
  display: flex;
  position: fixed;
  inset: 0;
}

dialog :where(.trap) {
  outline-style: none;
}

dialog:where(:not(.sheet)) {
  width: 100vw;
  height: -webkit-fill-available;
  z-index: var(--ds-z-modal);
  flex-direction: column;
  place-content: center;
  align-items: center;
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  overflow: auto;
}
`;
