// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const middleTruncateCss = css`.truncate :where(.sizer) {
  pointer-events: none;
  visibility: hidden;
  white-space: nowrap;
  -webkit-user-select: none;
  user-select: none;
  grid-row-start: 1;
  grid-column-start: 1;
}

.truncate :where(.measure) {
  pointer-events: none;
  visibility: hidden;
  white-space: nowrap;
  -webkit-user-select: none;
  user-select: none;
  display: inline-block;
  position: absolute;
  top: 0;
  left: 0;
}

.truncate :where(.full) {
  clip-path: inset(50%);
  white-space: nowrap;
  -webkit-user-select: none;
  user-select: none;
  border-width: 0;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  position: absolute;
  overflow: hidden;
}

.truncate {
  white-space: nowrap;
  min-width: 0;
  max-width: 100%;
  display: inline-grid;
  position: relative;
  overflow: hidden;
}

.truncate :where(.text) {
  grid-row-start: 1;
  grid-column-start: 1;
  min-width: 0;
  overflow: hidden;
}
`;
