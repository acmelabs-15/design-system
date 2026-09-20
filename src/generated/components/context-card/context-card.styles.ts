// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const contextCardCss = css`.layer {
  pointer-events: none;
  z-index: 100000;
  width: 100%;
  height: 100%;
  position: fixed;
  inset: 0;
}

.layer :where(.fade) :where(.card) {
  pointer-events: none;
  z-index: 1000000;
  background-color: var(--ds-background-100);
  width: fit-content;
  box-shadow: var(--ds-shadow-tooltip), 0 0 0 1px var(--ds-background-100);
  --context-card-tip-stroke: #dbdbdb;
  background-clip: padding-box;
  border-radius: 6px;
  position: absolute;
  overflow: visible;
}

.layer :where(.fade) :where(.card) :where(.arrow) {
  z-index: 999999999;
  transform-origin: 50%;
  place-content: center;
  width: 14px;
  height: 7px;
  display: grid;
  position: absolute;
}

.layer :where(.fade) :where(.card) :where(.box) {
  will-change: transform,width,height;
  max-width: max-content;
  padding: .75rem;
  transition-property: transform, width, height;
  transition-duration: .25s;
  transition-timing-function: cubic-bezier(.29, .31, .05, .96);
  animation-duration: .25s;
  animation-timing-function: cubic-bezier(.29, .31, .05, .96);
  position: absolute;
  top: 0;
  left: 0;
}

.layer:where(.top) :where(.fade) :where(.card) :where(.arrow) {
  top: 100%;
  rotate: 0deg;
}

.layer:where(:not(.top, .bottom, .left)) :where(.fade) :where(.card) :where(.arrow) {
  margin-right: -3.5px;
  right: 100%;
  rotate: 90deg;
}

.layer:where(.bottom) :where(.fade) :where(.card) :where(.arrow) {
  bottom: 100%;
  rotate: 180deg;
}

.layer:where(.left) :where(.fade) :where(.card) :where(.arrow) {
  margin-left: -3.5px;
  left: 100%;
  rotate: 270deg;
}

.layer :where(.fade) {
  will-change: transform,width,height;
  min-width: max-content;
  transition-property: all;
  transition-duration: .15s;
  transition-timing-function: cubic-bezier(.3, .57, .07, .95);
  animation-duration: .15s;
  animation-timing-function: cubic-bezier(.3, .57, .07, .95);
}

.layer :where(.fade) :where(.card) :where(.box) :where(.body) {
  will-change: transform,width,height;
  min-width: max-content;
}

.layer:where(:is(.top, .bottom)) :where(.fade) :where(.card) :where(.arrow) {
  translate: -50%;
}

.layer:where(:not(.top, .bottom)) :where(.fade) :where(.card) :where(.arrow) {
  translate: 0 -50%;
}

.layer:where(:not(.skip)) :where(.fade) :where(.card), .layer:where(:not(.skip)) :where(.fade) :where(.card) :where(.arrow) {
  will-change: transform,width,height;
  transition-property: transform, width, height;
  transition-duration: .25s;
  transition-timing-function: cubic-bezier(.29, .31, .05, .96);
  animation-duration: .25s;
  animation-timing-function: cubic-bezier(.29, .31, .05, .96);
}

.layer:where(:not(.skip)) :where(.fade) :where(.card) :where(.box) :where(.body) {
  transition-property: transform, width, height;
  transition-duration: .25s;
  transition-timing-function: cubic-bezier(.29, .31, .05, .96);
  animation-duration: .25s;
  animation-timing-function: cubic-bezier(.29, .31, .05, .96);
}

.layer:where(.skip) :where(.fade) :where(.card), .layer:where(.skip) :where(.fade) :where(.card) :where(.arrow), .layer:where(.skip) :where(.fade) :where(.card) :where(.box) {
  transition-property: none !important;
}

.layer:where(.skip) :where(.fade) :where(.card) :where(.box) :where(.body) {
  transition-duration: .15s;
  transition-timing-function: cubic-bezier(.3, .57, .07, .95);
  animation-duration: .15s;
  animation-timing-function: cubic-bezier(.3, .57, .07, .95);
  transition-property: none !important;
}

@media (prefers-reduced-motion: reduce) {
  .layer :where(.fade), .layer:where(:not(.skip)) :where(.fade) :where(.card), .layer:where(:not(.skip)) :where(.fade) :where(.card) :where(.arrow), .layer :where(.fade) :where(.card) :where(.box), .layer :where(.fade) :where(.card) :where(.box) :where(.body) {
    transition-property: none !important;
  }
}

:where(:host([data-dark])) .layer :where(.fade) :where(.card) {
  --context-card-tip-stroke: #252525;
}
`;
