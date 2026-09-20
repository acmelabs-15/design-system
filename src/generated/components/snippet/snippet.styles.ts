// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const snippetCss = css`.snippet :where(.action) {
  cursor: pointer;
  border-radius: var(--acme-radius) var(--acme-radius);
  width: 2rem;
  height: 2rem;
  color: inherit;
  outline-style: none;
  align-items: center;
  transition-property: opacity;
  transition-duration: .15s;
  transition-timing-function: cubic-bezier(.4, 0, .2, 1);
  animation-duration: .15s;
  animation-timing-function: cubic-bezier(.4, 0, .2, 1);
  display: flex;
  position: absolute;
  top: 50%;
  right: .25rem;
  translate: 0 -50%;
}

.snippet {
  border-style: solid;
  border-width: 1px;
  border-color: var(--themed-border, var(--ds-gray-alpha-400));
  background-color: var(--themed-bg, var(--ds-background-100));
  padding-block: .625rem;
  width: fit-content;
  max-width: 100%;
  color: var(--themed-fg);
  --themed-fg: var(--ds-gray-1000);
  border-radius: 6px;
  padding-left: .75rem;
  padding-right: 3rem;
  position: relative;
}

.snippet:where(.dark) {
  background-color: var(--ds-gray-1000) !important;
  color: var(--ds-gray-100) !important;
}

.snippet :where(.action) :where(acme-copy-button)::part(button) {
  color: inherit;
  box-shadow: none !important;
  background-color: #0000 !important;
}

.snippet:where(.placeholder) {
  opacity: .5;
}

.snippet pre {
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  text-align: left;
  font-family: var(--font-mono);
  margin: 0;
  font-size: 13px;
  line-height: 20px;
}

.snippet :where(.action) :where(acme-copy-button) svg {
  flex-shrink: 0;
}

.snippet pre::-webkit-scrollbar {
  display: none;
}

.snippet pre ::selection, .snippet pre::selection {
  background-color: var(--acme-selection);
}

@media (hover: hover) {
  .snippet :where(.action)[data-hover] {
    opacity: .8;
  }

  .snippet :where(.action) :where(acme-copy-button)::part(button):hover {
    box-shadow: 0 0 0 1px var(--themed-border) !important;
  }
}

.snippet :where(.action) :where(acme-copy-button)::part(button):disabled, .snippet :where(.action) :where(acme-copy-button)[aria-disabled="true"]::part(button) {
  color: var(--ds-gray-700);
}

.snippet :where(.action) :where(acme-copy-button)[data-hover]::part(button) {
  color: var(--themed-fg);
}

.snippet:where(:not(.no-prompt)) pre:before {
  content: "$ ";
  -webkit-user-select: none;
  user-select: none;
}

.snippet :where(pre) {
  -webkit-overflow-scrolling: touch;
  overflow-y: auto;
}

.snippet:where(.success) {
  --themed-fg: var(--ds-blue-900);
  --themed-bg: var(--ds-blue-100);
  --themed-border: var(--ds-blue-400);
}

.snippet:where(.success.fill) {
  --themed-fg: var(--ds-contrast-fg);
  --themed-bg: var(--acme-success);
  --themed-border: var(--acme-success);
}

.snippet:where(.error) {
  --themed-fg: var(--ds-red-900);
  --themed-bg: var(--ds-red-100);
  --themed-border: var(--ds-red-400);
}

.snippet:where(.error.fill) {
  --themed-fg: var(--ds-contrast-fg);
  --themed-bg: var(--ds-red-800);
  --themed-hover-bg: var(--ds-red-900);
  --themed-press-bg: #ffaba3;
  --themed-border: var(--themed-bg);
  --themed-focus-ring: #ffaba3;
}

.snippet:where(.warning) {
  --themed-fg: var(--ds-amber-900);
  --themed-bg: var(--ds-amber-100);
  --themed-border: var(--ds-amber-400);
}

.snippet:where(.warning.fill) {
  --themed-fg: #0a0a0a;
  --themed-bg: var(--ds-amber-800);
  --themed-hover-bg: #d27504;
  --themed-border: var(--themed-bg);
  --themed-press-bg: #a35200;
  --themed-focus-ring: #a35200;
}

:host(:not([data-dark])) .snippet:where(.error.fill) {
  --themed-fg: #f5f5f5;
  --themed-hover-bg: #ae292f;
  --themed-press-bg: #7c1316;
  --themed-focus-ring: #7c1316;
}
`;
