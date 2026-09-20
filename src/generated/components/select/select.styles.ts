// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const selectCss = css`.wrap :where(.start) {
  pointer-events: none;
  transition-property: color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --acme-gradient-from, --acme-gradient-via, --acme-gradient-to;
  transition-duration: .15s;
  transition-timing-function: cubic-bezier(.4, 0, 1, 1);
  animation-duration: .15s;
  animation-timing-function: cubic-bezier(.4, 0, 1, 1);
  display: inline-flex;
  position: absolute;
  left: .75rem;
}

.wrap :where(.end) {
  pointer-events: none;
  color: var(--ds-gray-700);
  transition-property: color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --acme-gradient-from, --acme-gradient-via, --acme-gradient-to;
  transition-duration: .15s;
  transition-timing-function: cubic-bezier(.4, 0, 1, 1);
  animation-duration: .15s;
  animation-timing-function: cubic-bezier(.4, 0, 1, 1);
  display: inline-flex;
  position: absolute;
  right: .75rem;
}

.wrap :where(.end) :where(.chevron) {
  width: var(--ds-control-decoration-size);
  height: var(--ds-control-decoration-size);
}

.wrap:where(:not(.sm, .lg)) :where(select) {
  height: var(--acme-form-height);
  font-size: var(--acme-form-font);
  line-height: var(--acme-form-line-height);
}

.wrap:where(.lg) :where(select) {
  height: var(--acme-form-large-height);
  font-size: var(--acme-form-large-font);
  line-height: var(--acme-form-large-line-height);
  border-radius: .5rem;
}

.wrap:where(.sm) :where(select) {
  height: var(--acme-form-small-height);
  font-size: var(--acme-form-small-font);
}

.wrap :where(select) {
  cursor: pointer;
  appearance: none;
  text-overflow: ellipsis;
  white-space: nowrap;
  background-color: var(--ds-background-100);
  padding-inline: .75rem;
  border-style: none;
  width: 100%;
  padding-right: 2.25rem;
  transition-property: box-shadow, color;
  transition-duration: .2s;
  transition-timing-function: cubic-bezier(.4, 0, .2, 1);
  animation-duration: .2s;
  overflow: hidden;
}

.wrap:where(.disabled) {
  cursor: not-allowed;
  border-radius: var(--acme-radius);
  background-color: var(--ds-gray-100);
  color: var(--ds-gray-700);
}

.wrap {
  color: var(--themed-fg);
  align-items: center;
  display: flex;
  position: relative;
}

.wrap:where(:not(.lg)) :where(select) {
  border-radius: var(--acme-radius);
}

.wrap:where(.has-start) :where(select) {
  padding-left: 2.5rem;
}

.wrap:where(.disabled) :where(.start) {
  color: var(--accents-3);
}

.wrap:where(.empty) :where(select) {
  color: var(--ds-gray-700);
}

.wrap:where(.secondary) :where(select) {
  color: var(--ds-gray-900);
  box-shadow: none;
  translate: -.75rem;
}

.wrap:where(:not(.disabled)) :where(.start) {
  color: var(--ds-gray-900);
}

.wrap:where(:not(.secondary):not(.empty)) :where(select) {
  color: var(--ds-gray-1000);
}

.wrap :where(select) :where(.ph) {
  color: var(--ds-gray-800);
}

.wrap:where(:not(.secondary)) :where(select) {
  box-shadow: 0 0 0 1px var(--themed-border, var(--ds-gray-alpha-400));
}

@media not all and (width >= 401px) {
  .wrap :where(select) {
    font-size: 1rem;
    line-height: 1.5;
  }
}

.wrap:where(.empty) :where(select)::placeholder {
  color: var(--ds-gray-700);
}

.wrap :where(select) option {
  color: var(--ds-gray-1000);
}

@media (hover: hover) {
  .wrap:where(:not(.disabled))[data-hover] :where(.start), .wrap:where(:not(.disabled))[data-hover] :where(.end) {
    color: var(--acme-foreground);
  }

  .wrap:where(:not(.disabled).secondary)[data-hover] :where(select) {
    color: var(--ds-gray-1000);
  }

  .wrap:where(:not(.disabled))[data-hover] :where(select) {
    box-shadow: 0 0 0 1px var(--ds-gray-alpha-500);
  }
}

.wrap[data-focus] :where(select) {
  box-shadow: var(--ds-focus-border);
  outline-style: none;
}

@media (forced-colors: active) {
  .wrap[data-focus] :where(select) {
    outline-offset: 2px;
    outline: 2px solid #0000;
  }
}

.wrap :where(select):disabled {
  cursor: not-allowed;
  background-color: var(--ds-gray-100);
  color: var(--ds-gray-700);
  opacity: 1;
  box-shadow: 0 0 0 1px var(--ds-gray-alpha-400);
  -webkit-text-fill-color: var(--accents-3);
}

.wrap :where(select)[aria-invalid="true"] {
  box-shadow: 0 0 0 1px var(--themed-border), 0 0 0 4px hsla(var(--ds-red-900-value), .16);
  outline-style: none;
}

.wrap:where(.error) {
  --themed-fg: var(--acme-error);
  --themed-bg: var(--acme-background);
  --themed-border: var(--themed-fg);
}

.wrap:where(.secondary) {
  --themed-fg: var(--acme-secondary);
  --themed-bg: var(--acme-background);
  --themed-border: var(--themed-fg);
}
`;
