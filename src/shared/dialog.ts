import { css } from "lit";

/**
 * The dialog element's own box (a canvas fill, a text color, a fit-content size with a size cap,
 * insets to every edge, a scrolling overflow, selectable text) gives way to a plain block's, so an
 * element's derived rules lay the dialog out as they would any fixed box. A closed dialog keeps the
 * platform's own absence: it is not laid out, whatever the derived rules say about the box. Every
 * element built on a native dialog (modal, drawer, sheet, command menu) puts this before its modules.
 */
export const dialogResetCss = css`
  dialog:not([open]) {
    display: none;
  }
  dialog {
    width: auto;
    height: auto;
    inset: auto;
    overflow: visible;
    background: transparent;
    color: inherit;
    max-width: none;
    max-height: none;
    user-select: auto;
  }
`;
