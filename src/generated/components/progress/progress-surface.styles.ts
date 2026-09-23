// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const progressSurfaceCss = css`:host {
  min-inline-size: 0;
  display: block;
}

[part="root"] {
  --_progress-color: var(--ds-gray-1000);
  inline-size: 100%;
  min-inline-size: 0;
  position: relative;
}

[part="label"] {
  margin-block-end: var(--acme-spacing-2);
  font-size: .875rem;
  line-height: 1.5;
  display: block;
}

[part="track"] {
  border-radius: var(--acme-radius);
  background: var(--ds-gray-200);
  block-size: 10px;
  inline-size: 100%;
  position: relative;
  overflow: hidden;
}

[part="range"] {
  background: var(--_progress-color);
  border-radius: inherit;
  block-size: 100%;
  display: block;
}

.determinate {
  inline-size: 100%;
  transform: scaleX(var(--_progress-ratio, 0));
  transform-origin: 0;
}

:host(:dir(rtl)) .determinate {
  transform-origin: 100%;
}

.indeterminate {
  inline-size: 25%;
  transform: translateX(calc(var(--_progress-direction, 1) * 150%));
  position: absolute;
  inset-block: 0;
  inset-inline-start: 0;
}

:host(:dir(rtl)) [part="track"] {
  --_progress-direction: -1;
}

[data-variant="success"] {
  --_progress-color: var(--ds-blue-700);
}

[data-variant="error"] {
  --_progress-color: var(--ds-red-700);
}

[data-variant="warning"] {
  --_progress-color: var(--ds-amber-900);
}

[data-variant="secondary"] {
  --_progress-color: var(--ds-gray-900);
}

[hidden] {
  display: none;
}

@media (forced-colors: active) {
  [part="track"] {
    background: canvas;
    outline: 1px solid canvastext;
  }

  [part="range"] {
    background: highlight;
  }
}
`;
