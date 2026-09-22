// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const checkboxStructureCss = css`.selection-label:is([data-checked], [data-indeterminate]) .indicator {
  background: var(--accent);
  color: var(--on-accent);
  border-color: var(--accent);
}

.selection-label[data-hover]:is([data-checked], [data-indeterminate]) .indicator {
  background: var(--accent-hover);
}

.selection-label[data-active]:is([data-checked], [data-indeterminate]) .indicator {
  background: var(--accent-active);
}

@media (forced-colors: active) {
  .selection-label:is([data-checked], [data-indeterminate]) .indicator {
    color: highlighttext;
    background: highlight;
    border-color: highlight;
  }

  .selection-label[data-disabled] .indicator {
    color: graytext;
    background: canvas;
    border-color: graytext;
  }
}
`;
