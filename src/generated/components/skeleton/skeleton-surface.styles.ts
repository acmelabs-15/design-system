// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const skeletonSurfaceCss = css`:host {
  min-inline-size: 0;
  display: block;
}

[part="root"] {
  inline-size: var(--_skeleton-width, auto);
  block-size: var(--_skeleton-height, auto);
  border-radius: 5px;
  min-inline-size: 0;
  position: relative;
}

[part="root"][data-loading="true"] {
  min-block-size: var(--_skeleton-height, 24px);
  overflow: hidden;
}

[part="root"][data-shape="circle"] {
  border-radius: 50%;
}

[part="root"][data-loading="true"] [part="content"] {
  visibility: hidden;
}

[part="content"] {
  min-inline-size: 0;
}

.paint {
  border-radius: inherit;
  pointer-events: none;
  background: var(--ds-gray-100);
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.sweep {
  background-image: linear-gradient(to right in oklab,var(--ds-gray-100),var(--ds-gray-200),var(--ds-gray-100));
  background-size: 50% 100%;
  inline-size: 300%;
  position: absolute;
  inset-block: 0;
  inset-inline-start: 0;
}

@media (forced-colors: active) {
  .paint {
    outline-offset: -1px;
    background: canvas;
    outline: 1px solid canvastext;
  }

  .sweep {
    display: none;
  }
}
`;
