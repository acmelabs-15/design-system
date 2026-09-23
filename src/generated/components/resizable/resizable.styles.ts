// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const resizableCss = css`:host {
  min-block-size: 0;
  min-inline-size: 0;
  display: block;
}

[part="root"] {
  block-size: 100%;
  min-block-size: 0;
  inline-size: 100%;
  min-inline-size: 0;
  display: flex;
  overflow: hidden;
}

[data-axis="vertical"] {
  flex-direction: column;
}

[data-resizing][data-axis="horizontal"] {
  cursor: col-resize;
}

[data-resizing][data-axis="vertical"] {
  cursor: row-resize;
}

[part="root"]:focus-visible {
  outline: 2px solid var(--acme-accent);
  outline-offset: 2px;
}
`;
