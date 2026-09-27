// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const videoSurfaceCss = css`:host {
  inline-size: 600px;
  min-inline-size: 0;
  max-inline-size: 100%;
  display: block;
}

[part="root"] {
  block-size: 100%;
  inline-size: 100%;
  min-inline-size: 0;
  position: relative;
}

[part="video"] {
  object-fit: contain;
  block-size: 100%;
  inline-size: 100%;
  display: block;
}

.fallback {
  padding: var(--acme-spacing-4);
  font-family: var(--acme-font-sans);
  color: var(--ds-gray-900);
  background: var(--ds-background-200);
  font-size: .875rem;
  line-height: 1.5;
}

[part="video"]:focus-visible {
  outline: 2px solid var(--ds-focus-color);
  outline-offset: 2px;
}

[hidden] {
  display: none !important;
}
`;
