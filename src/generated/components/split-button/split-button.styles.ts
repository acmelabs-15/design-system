// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const splitButtonCss = css`.split {
  display: flex;
  position: relative;
}

.split :where(acme-button.main)::part(root) {
  z-index: 1;
  border-style: solid !important;
  border-width: 1px 0 1px 1px !important;
  border-color: var(--ds-gray-400) !important;
  box-shadow: none !important;
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}

.split :where(acme-icon-button.trigger)::part(root) {
  z-index: 1;
  border-style: solid !important;
  border-width: 1px 1px 1px 0 !important;
  border-color: var(--ds-gray-400) !important;
  box-shadow: none !important;
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
}

.split :where(acme-icon-button.trigger)::part(icon) {
  text-overflow: ellipsis;
  white-space: nowrap;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  padding-inline: .375rem;
  display: flex;
  overflow: hidden;
}

.split :where(acme-icon-button.trigger) :where(.inner) {
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  gap: .25rem;
  width: 100%;
  display: flex;
}

.split :where(acme-button.main) svg, .split :where(acme-icon-button.trigger) svg {
  flex-shrink: 0;
}

.split:where(.secondary) :where(acme-icon-button.trigger)::part(root):before {
  content: "";
  background-color: var(--divider-color);
}

.split :where(acme-icon-button.trigger)::part(root):before {
  content: "";
  width: 1px;
  height: 100%;
  position: absolute;
  top: 0;
  left: -1px;
}

:host(:not([data-dark])) .split:where(:not(.secondary)) :where(acme-icon-button.trigger)::part(root):before {
  content: "";
  background-color: #404040;
}

.split :where(acme-button.main)::part(root):focus, .split :where(acme-icon-button.trigger)::part(root):focus {
  z-index: 2;
  box-shadow: var(--ds-focus-ring);
}

.split :where(acme-icon-button.trigger)::part(root):disabled {
  background-color: var(--ds-gray-100);
  box-shadow: 0 0 0 1px var(--themed-border, transparent);
}

.split :where(acme-button.main)::part(root):disabled {
  box-shadow: 0 0 0 1px var(--themed-border, transparent);
}

.split :where(acme-icon-button.trigger)[aria-disabled="true"]::part(root) {
  background-color: var(--ds-gray-100);
  box-shadow: 0 0 0 1px var(--themed-border, transparent);
}

.split :where(acme-button.main)[aria-disabled="true"]::part(root) {
  box-shadow: 0 0 0 1px var(--themed-border, transparent);
}

.split:where(.secondary) :where(acme-icon-button.trigger)[data-hover]::part(root) {
  box-shadow: 0 0 0 1px var(--ds-gray-alpha-500);
  background-color: var(--ds-background-100) !important;
}

.split:where(:not(.secondary)) :where(acme-icon-button.trigger)[data-hover]::part(root) {
  background-color: var(--themed-hover-bg, #383838);
}

.split:where(.secondary) :where(acme-button.main)[data-focus]::part(root), .split:where(.secondary) :where(acme-icon-button.trigger)[data-focus]::part(root) {
  box-shadow: 0 0 0 1px var(--themed-border, transparent), 0 0 0 2px var(--ds-background-100), 0 0 0 4px var(--ds-focus-color);
}

.split :where(acme-button.main)[data-focus]::part(root), .split :where(acme-icon-button.trigger)[data-focus]::part(root) {
  box-shadow: var(--ds-focus-ring);
}

:where(:host([data-dark])) .split:where(:not(.secondary)) :where(acme-icon-button.trigger)::part(root):before {
  content: "";
  background-color: #cdcdcd;
}

:where(:host([data-dark])) .split:where(.secondary) :where(acme-icon-button.trigger)[data-hover]::part(root) {
  background-color: var(--ds-gray-200);
}

:where(:host([data-dark])) .split:where(:not(.secondary)) :where(acme-icon-button.trigger)[data-hover]::part(root) {
  background-color: var(--themed-hover-bg, #ccc);
}

.split :where(acme-icon-button.trigger)::part(root):disabled:before {
  content: "";
  opacity: .1;
}

.split :where(acme-icon-button.trigger)[data-hover]::part(root):disabled {
  background-color: var(--ds-gray-100);
}
`;
