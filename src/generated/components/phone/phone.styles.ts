// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const phoneCss = css`.frame :where(.screen) :where(.content) {
  background-color: #878787;
  position: absolute;
  inset: 0;
}

.frame :where(.screen) :where(.shade) {
  background-image: linear-gradient(to bottom in oklab, transparent 0%, lab(0% 0 0 / .2) 50%, lab(0% 0 0 / .7) 100%);
  width: 100%;
  height: 18%;
  position: absolute;
  bottom: 0;
  left: 0;
}

.frame :where(.island) {
  background-color: #000;
  border-radius: 2147483647px;
  width: 30%;
  height: 4%;
  position: absolute;
  top: 2.5%;
  left: 50%;
  translate: -50%;
}

.frame :where(.home) {
  background-color: #fff;
  border-radius: 2147483647px;
  width: 34%;
  height: .6%;
  position: absolute;
  bottom: 3%;
  left: 50%;
  translate: -50%;
}

.frame :where(.bar) {
  justify-content: space-between;
  align-items: center;
  gap: .5rem;
  width: 100%;
  padding-inline: 6%;
  display: flex;
  position: absolute;
  bottom: 6%;
  left: 0;
}

.frame :where(.mute) {
  border-top-left-radius: 2147483647px;
  border-bottom-left-radius: 2147483647px;
  width: .125rem;
  height: 3.5%;
  position: absolute;
  top: 15%;
  left: -.25rem;
}

.frame :where(.vol-up) {
  border-top-left-radius: 2147483647px;
  border-bottom-left-radius: 2147483647px;
  width: .125rem;
  height: 7.1%;
  position: absolute;
  top: 23.4%;
  left: -.25rem;
}

.frame :where(.vol-down) {
  border-top-left-radius: 2147483647px;
  border-bottom-left-radius: 2147483647px;
  width: .125rem;
  height: 7.1%;
  position: absolute;
  top: 32.4%;
  left: -.25rem;
}

.frame :where(.power) {
  border-top-right-radius: 2147483647px;
  border-bottom-right-radius: 2147483647px;
  width: .125rem;
  height: 11%;
  position: absolute;
  top: 28.2%;
  right: -.25rem;
}

.frame {
  border-radius: 15cqw;
  outline-width: 2px;
  outline-style: solid;
  width: 100%;
  padding: 2.5%;
  position: relative;
}

.frame :where(.screen) {
  aspect-ratio: 9 / 19.5;
  border-radius: calc(15cqw - 6px);
  position: relative;
  overflow: hidden;
}

.frame :where(.bar) :where(.back) :where(.icon) {
  width: 5cqw;
  height: 5cqw;
  margin-left: -.125rem;
}

.frame :where(.bar) :where(.address) :where(.text) {
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
  color: #fff;
  width: 100%;
  padding-inline: 1rem;
  font-size: 4.5cqw;
  display: block;
  overflow: hidden;
}

.frame :where(.bar) :where(.back) {
  color: lab(100% -.0000298023 .0000119209 / .8);
  backdrop-filter: blur(8px);
  background-color: #0f0f0f52;
  border-radius: 2147483647px;
  justify-content: center;
  align-items: center;
  width: 12cqw;
  height: 12cqw;
  display: flex;
  box-shadow: 0 0 1.5px #0000001a, 0 .65px 5px #0000001f, inset .65px .65px 1px -.65px #fffc, inset -.65px -.65px 2px -.65px #fff6;
}

.frame :where(.bar) :where(.address) {
  width: auto;
  min-width: 0;
  height: 12cqw;
  font-family: var(--acme-font-sans);
  color: lab(100% -.0000298023 .0000119209 / .8);
  backdrop-filter: blur(8px);
  background-color: #0f0f0f52;
  border-radius: 2147483647px;
  flex: 1;
  justify-content: center;
  align-items: center;
  font-size: 13px;
  font-weight: 400;
  line-height: 16px;
  display: flex;
  box-shadow: 0 0 1.5px #0000001a, 0 .65px 5px #0000001f, inset .65px .65px 1px -.65px #fffc, inset -.65px -.65px 2px -.65px #fff6;
}

.frame :where(.bar) :where(.more) {
  color: lab(100% -.0000298023 .0000119209 / .8);
  backdrop-filter: blur(8px);
  background-color: #0f0f0f52;
  border-radius: 2147483647px;
  justify-content: center;
  align-items: center;
  width: 12cqw;
  height: 12cqw;
  display: flex;
  box-shadow: 0 0 1.5px #0000001a, 0 .65px 5px #0000001f, inset .65px .65px 1px -.65px #fffc, inset -.65px -.65px 2px -.65px #fff6;
}

.frame :where(.bar) :where(.more) :where(.icon) {
  width: 5cqw;
  height: 5cqw;
}

.frame:where(:not(.light)) {
  background-color: #000;
  outline-color: #333;
}

.frame:where(:not(.light)) :where(.mute), .frame:where(:not(.light)) :where(.vol-up), .frame:where(:not(.light)) :where(.vol-down), .frame:where(:not(.light)) :where(.power) {
  background-color: #333;
}

.frame:where(.light) {
  background-color: var(--ds-gray-100);
  outline-color: var(--ds-gray-alpha-400);
}

.frame:where(.light) :where(.mute), .frame:where(.light) :where(.vol-up), .frame:where(.light) :where(.vol-down), .frame:where(.light) :where(.power) {
  background-color: var(--ds-gray-alpha-400);
}

.frame :where(.bar) :where(.address) > strong {
  color: var(--ds-gray-1000);
  font-weight: 500;
}
`;
