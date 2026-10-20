// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const avatarStructureCss = css`:host {
  --avatar-size: 32px;
  inline-size: var(--avatar-size);
  aspect-ratio: 1;
  vertical-align: middle;
  flex-shrink: 0;
  display: inline-flex;
  position: relative;
}

:host([data-avatar-size="tiny"]) {
  --avatar-size: 16px;
}

:host([data-avatar-size="small"]) {
  --avatar-size: 24px;
}

:host([data-avatar-size="large"]) {
  --avatar-size: 48px;
}

.avatar {
  aspect-ratio: 1;
  background: var(--ds-gray-200);
  inline-size: 100%;
  color: var(--ds-gray-1000);
  box-shadow: inset 0 0 0 1px var(--ds-gray-alpha-400);
  font-family: var(--acme-font-sans);
  font-size: calc(var(--avatar-size)*.4);
  font-weight: var(--acme-font-weight-500);
  border-radius: 50%;
  place-items: center;
  line-height: 1;
  display: grid;
  position: relative;
  overflow: hidden;
}

.avatar[data-shape="square"] {
  border-radius: var(--r-sm, 6px);
}

img {
  object-fit: cover;
  block-size: 100%;
  inline-size: 100%;
  display: block;
}

.fallback {
  --acme-icon-size: calc(var(--avatar-size)*.65);
  justify-content: center;
  align-items: center;
  block-size: 100%;
  inline-size: 100%;
  display: flex;
}

[hidden] {
  display: none;
}

.badge {
  border-radius: 50%;
  display: flex;
  position: absolute;
  inset-block-end: -5px;
  inset-inline-start: -3px;
}
`;
