// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
import { withStyleProperties } from "../../../shared/style-properties";
export const videoCss = /* @__PURE__ */ withStyleProperties(css`.video :where(.box) :where(.frame) :where(.controls) :where(.track) :where(progress) {
  pointer-events: none;
  background-color: var(--ds-gray-1000);
  border-radius: 5px;
  width: 100%;
  height: .25rem;
  position: absolute;
  top: calc(50% - 1px);
  left: 0;
  overflow: hidden;
}

.video :where(.box) :where(.frame) :where(.controls) :where(.track) :where(.handle) {
  pointer-events: none;
  background-color: var(--acme-foreground);
  border-radius: 50%;
  width: .625rem;
  height: .625rem;
  transition-property: width, height, border-radius, transform, background-color;
  transition-duration: .1s;
  transition-timing-function: cubic-bezier(.4, 0, .2, 1);
  animation-duration: .1s;
  animation-timing-function: cubic-bezier(.4, 0, .2, 1);
  position: absolute;
  top: calc(50% - 5px);
  translate: .25rem 1px;
  scale: 0;
}

.video :where(.box) :where(.frame) :where(video) {
  cursor: pointer;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.video :where(.box) :where(.frame) :where(.controls) {
  background-color: var(--acme-background);
  opacity: 0;
  width: 85%;
  height: 3rem;
  box-shadow: var(--ds-shadow-tooltip);
  border-radius: .375rem;
  align-items: center;
  padding-block: 0;
  padding-inline: .5rem;
  transition-property: all;
  transition-duration: .15s;
  transition-timing-function: cubic-bezier(.4, 0, .2, 1);
  display: flex;
  position: absolute;
  bottom: 5%;
}

.video :where(.box) {
  width: var(--video-width);
  max-width: 100%;
  margin-block: 0;
  margin-inline: auto;
  position: relative;
}

.video :where(.box) :where(.frame) {
  justify-content: center;
  display: flex;
  position: relative;
}

.video :where(.box) :where(.frame) :where(.controls) :where(.track) {
  flex: 1 0 auto;
  align-items: center;
  margin-top: -1px;
  display: flex;
  position: relative;
}

.video {
  margin-inline: 0;
  margin-block: var(--video-margin);
  text-align: center;
  display: block;
}

.video :where(.box) :where(.frame) :where(.controls) :where(.play) {
  cursor: pointer;
  background-color: #0000;
  border-style: solid;
  border-width: 0;
  outline-style: none;
  flex: 0 0 40px;
  justify-content: center;
  align-items: center;
  width: 2.5rem;
  height: 2.5rem;
  padding: 0;
  display: flex;
}

.video :where(.box) :where(.frame) :where(.controls) :where(.track) :where(.scrub) {
  cursor: pointer;
  -webkit-tap-highlight-color: #0000;
  background-color: #0000;
  width: 100%;
  height: 18px;
}

.video :where(.box) :where(.frame) :where(.controls) :where(.current) {
  padding-block: 0;
  padding-inline: .75rem;
  font-variant-numeric: tabular-nums;
  flex: none;
  width: 60px;
  padding-left: 0;
  font-size: 13px;
  line-height: 2.5rem;
}

.video :where(.box) :where(.frame) :where(.controls) :where(.total) {
  font-variant-numeric: tabular-nums;
  flex: none;
  width: 60px;
  padding-block: 0;
  padding-inline: .75rem;
  font-size: 13px;
  line-height: 2.5rem;
}

.video:where(.visible) :where(.box) :where(.frame) :where(.controls) {
  --acme-translate-x: 0rem;
  translate: var(--acme-translate-x) var(--acme-translate-y);
  --acme-translate-y: -6px;
  opacity: 1;
  transition-duration: .2s;
  transition-timing-function: cubic-bezier(.25, .57, .45, .94);
  animation-duration: .2s;
  animation-timing-function: cubic-bezier(.25, .57, .45, .94);
}

.video:where(.round) :where(.box) :where(.frame) :where(video) {
  border-radius: var(--acme-radius);
}

@media not all and (width >= 992px) {
  .video :where(.box) :where(.frame) :where(.controls) :where(.track) :where(.scrub) {
    height: 18px;
  }

  .video :where(.box) :where(.frame) :where(.controls) {
    --acme-translate-x: 0rem;
    translate: var(--acme-translate-x) var(--acme-translate-y);
    --acme-translate-y: 0rem;
    --acme-scale-x: 100%;
    scale: var(--acme-scale-x) var(--acme-scale-y);
    --acme-scale-y: 0%;
    opacity: 1;
  }
}

.video :where(.box) :where(.frame) :where(.controls) :where(.track) :where(progress)::-webkit-progress-bar {
  background-color: var(--ds-gray-200);
}

.video :where(.box) :where(.frame) :where(.controls) :where(.track) :where(progress)::-webkit-progress-value {
  background-color: var(--acme-foreground);
}

.video :where(.box) :where(.frame) :where(.controls) :where(.play)[data-focus] {
  box-shadow: var(--ds-focus-ring);
  border-radius: .25rem;
}
`, [{"name":"--acme-translate-x","syntax":"*","inherits":false,"initialValue":"0"},{"name":"--acme-translate-y","syntax":"*","inherits":false,"initialValue":"0"},{"name":"--acme-translate-z","syntax":"*","inherits":false,"initialValue":"0"},{"name":"--acme-scale-x","syntax":"*","inherits":false,"initialValue":"1"},{"name":"--acme-scale-y","syntax":"*","inherits":false,"initialValue":"1"},{"name":"--acme-scale-z","syntax":"*","inherits":false,"initialValue":"1"},{"name":"--acme-rotate-x","syntax":"*","inherits":false},{"name":"--acme-rotate-y","syntax":"*","inherits":false},{"name":"--acme-rotate-z","syntax":"*","inherits":false},{"name":"--acme-skew-x","syntax":"*","inherits":false},{"name":"--acme-skew-y","syntax":"*","inherits":false}]);
