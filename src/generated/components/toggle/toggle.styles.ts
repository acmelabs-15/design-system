// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
import { registerProperties } from "../../../base";
registerProperties([{"name":"--acme-translate-x","syntax":"*","inherits":false,"initialValue":"0"},{"name":"--acme-translate-y","syntax":"*","inherits":false,"initialValue":"0"},{"name":"--acme-translate-z","syntax":"*","inherits":false,"initialValue":"0"},{"name":"--acme-scale-x","syntax":"*","inherits":false,"initialValue":"1"},{"name":"--acme-scale-y","syntax":"*","inherits":false,"initialValue":"1"},{"name":"--acme-scale-z","syntax":"*","inherits":false,"initialValue":"1"},{"name":"--acme-rotate-x","syntax":"*","inherits":false},{"name":"--acme-rotate-y","syntax":"*","inherits":false},{"name":"--acme-rotate-z","syntax":"*","inherits":false},{"name":"--acme-skew-x","syntax":"*","inherits":false},{"name":"--acme-skew-y","syntax":"*","inherits":false}]);
export const toggleCss = css`.toggle :where(input) {
  clip-path: inset(50%);
  white-space: nowrap;
  border-width: 0;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  position: absolute;
  overflow: hidden;
}

.toggle {
  touch-action: manipulation;
  align-items: center;
  gap: var(--acme-space-gap-half);
  white-space: nowrap;
  color: var(--acme-secondary);
  -webkit-user-select: none;
  user-select: none;
  padding-block: 3px;
  font-size: .75rem;
  font-weight: 500;
  display: inline-flex;
  position: relative;
}

.toggle :where(.track) {
  border-style: solid;
  border-width: 0;
  border-radius: 14px;
  transition-property: background, border-color;
  transition-duration: .15s;
  transition-timing-function: cubic-bezier(0, 0, .2, 1);
  animation-duration: .15s;
  animation-timing-function: cubic-bezier(0, 0, .2, 1);
  display: inline-block;
  position: relative;
}

.toggle:where(.no-margin) :where(.track) {
  margin: 0;
}

.toggle :where(.track) :where(.thumb) :where(.icon) {
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  display: flex;
}

.toggle:where(:not(.md, .lg)) :where(.track) :where(.thumb) {
  width: 11px;
  height: 11px;
}

.toggle:where(:not(.md, .lg)) :where(.track) {
  width: 28px;
  height: 14px;
}

.toggle:where(.md) :where(.track) :where(.thumb) {
  width: 17px;
  height: 17px;
}

.toggle:where(.md) :where(.track) {
  width: 36px;
  height: 20px;
}

.toggle:where(.lg) :where(.track) :where(.thumb) {
  width: 21px;
  height: 21px;
}

.toggle:where(.lg) :where(.track) {
  width: 40px;
  height: 24px;
}

.toggle:where(:not([data-checked])) :where(.track) :where(.thumb) {
  --acme-translate-x: 0rem;
  translate: var(--acme-translate-x) var(--acme-translate-y);
}

.toggle:where(:not(.md, .lg)[data-checked]) :where(.track) :where(.thumb) {
  --acme-translate-x: 14px;
  translate: var(--acme-translate-x) var(--acme-translate-y);
}

.toggle:where(:is(.md, .lg)[data-checked]) :where(.track) :where(.thumb) {
  --acme-translate-x: 16px;
  translate: var(--acme-translate-x) var(--acme-translate-y);
}

.toggle :where(.track) :where(.thumb) {
  --acme-translate-y: -50%;
  translate: var(--acme-translate-x) var(--acme-translate-y);
  border-style: solid;
  border-width: 0;
  border-radius: 50%;
  transition-property: transform, translate, scale, rotate;
  transition-duration: .15s;
  transition-timing-function: cubic-bezier(.4, 0, .2, 1);
  animation-duration: .15s;
  animation-timing-function: cubic-bezier(.4, 0, .2, 1);
  position: absolute;
  top: 50%;
  left: 1.5px;
}

.toggle:where([data-disabled]) :where(.track) {
  cursor: not-allowed;
}

.toggle:where([data-disabled]) :where(.track) :where(.thumb) {
  cursor: not-allowed;
  box-shadow: none;
  border-color: #0000;
}

.toggle:where(:not([data-disabled])) :where(.track) {
  cursor: pointer;
  border-color: var(--ds-gray-alpha-300);
}

.toggle:where(:not([data-disabled])) :where(.track) :where(.thumb) {
  cursor: pointer;
  box-shadow: 0 0 3px -1px #0000003d, 0 0 .5px #00000029, -.5px 2px 3px -2px #0000005c;
}

.toggle:where(.switch-first) {
  flex-direction: row-reverse;
}

.toggle:where(:not([data-checked])[data-disabled]) :where(.track) {
  border-color: var(--ds-gray-200);
  background-color: var(--ds-gray-200);
}

.toggle:where([data-checked][data-disabled]) :where(.track) {
  border-color: var(--ds-gray-500);
  background-color: var(--ds-gray-500);
}

.toggle:where([data-checked]:not([data-disabled])) :where(.track) :where(.thumb) {
  background-color: var(--ds-background-100) !important;
}

.toggle:where([data-checked]:not([data-disabled])) :where(.track) {
  background-color: var(--checked-bg-color-override, var(--acme-success));
}

.toggle:where([data-checked][data-disabled]) :where(.track) :where(.thumb) {
  background-color: var(--ds-gray-100);
}

.toggle:where(:not([data-checked]):not([data-disabled])) :where(.track) :where(.thumb) {
  background-color: var(--thumb-unchecked-bg-color-override, var(--ds-background-100));
}

.toggle:where(:not([data-checked])[data-disabled]) :where(.track) :where(.thumb) {
  background-color: var(--thumb-unchecked-bg-color-override, var(--ds-background-200));
}

.toggle:where(:not([data-checked]):not([data-disabled])) :where(.track) {
  background-color: var(--unchecked-bg-color-override, var(--ds-gray-400));
}

.toggle:where([data-checked]) :where(.track), .toggle:where(:not([data-checked]).colored) :where(.track) {
  background-clip: border-box;
}

.toggle:where(:not([data-checked]):not(.colored)) :where(.track) {
  background-clip: padding-box;
}

.toggle:where([data-disabled]) :where(.track) :where(.thumb) :where(.icon) {
  color: var(--ds-gray-700);
}

.toggle:where(:not([data-disabled])) :where(.track) :where(.thumb) :where(.icon) {
  color: var(--thumb-light-fg-color-override, var(--ds-gray-900));
}

.toggle:where(:not(.normal)) {
  text-transform: capitalize;
}

.toggle[data-focus] :where(.track) {
  box-shadow: 0 0 0 calc(1px + 0px) var(--ds-focus-ring);
}

:where(:host([data-dark])) .toggle :where(.track) :where(.thumb) {
  border-style: solid;
  border-width: 1px;
}

:where(:host([data-dark])) .toggle:where([data-checked][data-disabled]) :where(.track) {
  border-color: var(--ds-gray-alpha-100);
  background-color: var(--ds-gray-400);
}

:where(:host([data-dark])) .toggle:where(:not([data-disabled])) :where(.track) :where(.thumb) {
  border-color: var(--ds-gray-alpha-600);
}

:where(:host([data-dark])) .toggle:where([data-disabled]) :where(.track) :where(.thumb) {
  border-color: #0000;
}

:where(:host([data-dark])) .toggle:where([data-checked]:not([data-disabled])) :where(.track) :where(.thumb) {
  background-color: hsla(var(--ds-gray-1000-value),.84) !important;
}

:where(:host([data-dark])) .toggle:where(:not([data-checked])[data-disabled]) :where(.track) :where(.thumb) {
  background-color: var(--ds-gray-500);
}

:where(:host([data-dark])) .toggle:where([data-checked][data-disabled]) :where(.track) :where(.thumb) {
  background-color: var(--ds-gray-600);
}

:where(:host([data-dark])) .toggle:where(:not([data-checked]):not([data-disabled])) :where(.track) :where(.thumb) {
  background-color: var(--thumb-unchecked-bg-color-override, hsla(var(--ds-gray-1000-value),.84));
}

:where(:host([data-dark])) .toggle:where([data-checked]:not(.colored)) :where(.track) :where(.thumb) :where(.icon) {
  color: var(--ds-gray-700);
}

:where(:host([data-dark])) .toggle:where(:not([data-checked])[data-disabled]) :where(.track) :where(.thumb) :where(.icon) {
  color: var(--ds-gray-900);
}

:where(:host([data-dark])) .toggle:where(:not([data-disabled])) :where(.track) :where(.thumb) :where(.icon) {
  color: var(--thumb-fg-color-override, var(--ds-background-100));
}
`;
