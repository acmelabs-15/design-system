// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const spinnerStructureCss = css`:host {
  color: var(--ds-gray-700);
  display: inline-flex;
}

.spinner {
  aspect-ratio: 1;
  color: inherit;
  display: inline-block;
  position: relative;
}

.blade {
  opacity: .65;
  transform-origin: 50%;
  background: currentColor;
  border-radius: 9999px;
  position: absolute;
  top: 50%;
  left: 50%;
  translate: -50% -50%;
}

.spinner[data-size="small"] {
  width: .75rem;
  height: .75rem;
}

.spinner[data-size="small"] .blade {
  width: 3px;
  height: 1.5px;
}

.spinner[data-size="small"] .blade:first-child {
  transform: rotate(0) translate(146%);
}

.spinner[data-size="small"] .blade:nth-child(2) {
  transform: rotate(45deg) translate(146%);
}

.spinner[data-size="small"] .blade:nth-child(3) {
  transform: rotate(90deg) translate(146%);
}

.spinner[data-size="small"] .blade:nth-child(4) {
  transform: rotate(135deg) translate(146%);
}

.spinner[data-size="small"] .blade:nth-child(5) {
  transform: rotate(180deg) translate(146%);
}

.spinner[data-size="small"] .blade:nth-child(6) {
  transform: rotate(225deg) translate(146%);
}

.spinner[data-size="small"] .blade:nth-child(7) {
  transform: rotate(270deg) translate(146%);
}

.spinner[data-size="small"] .blade:nth-child(8) {
  transform: rotate(315deg) translate(146%);
}

.spinner[data-size="medium"] {
  width: 1rem;
  height: 1rem;
}

.spinner[data-size="medium"] .blade {
  width: .25rem;
  height: 1.5px;
}

.spinner[data-size="medium"] .blade:first-child {
  transform: rotate(0) translate(146%);
}

.spinner[data-size="medium"] .blade:nth-child(2) {
  transform: rotate(36deg) translate(146%);
}

.spinner[data-size="medium"] .blade:nth-child(3) {
  transform: rotate(72deg) translate(146%);
}

.spinner[data-size="medium"] .blade:nth-child(4) {
  transform: rotate(108deg) translate(146%);
}

.spinner[data-size="medium"] .blade:nth-child(5) {
  transform: rotate(144deg) translate(146%);
}

.spinner[data-size="medium"] .blade:nth-child(6) {
  transform: rotate(180deg) translate(146%);
}

.spinner[data-size="medium"] .blade:nth-child(7) {
  transform: rotate(216deg) translate(146%);
}

.spinner[data-size="medium"] .blade:nth-child(8) {
  transform: rotate(252deg) translate(146%);
}

.spinner[data-size="medium"] .blade:nth-child(9) {
  transform: rotate(288deg) translate(146%);
}

.spinner[data-size="medium"] .blade:nth-child(10) {
  transform: rotate(324deg) translate(146%);
}

.spinner[data-size="large"] {
  width: 1.25rem;
  height: 1.25rem;
}

.spinner[data-size="large"] .blade {
  width: 5px;
  height: 2px;
}

.spinner[data-size="large"] .blade:first-child {
  transform: rotate(0) translate(146%);
}

.spinner[data-size="large"] .blade:nth-child(2) {
  transform: rotate(30deg) translate(146%);
}

.spinner[data-size="large"] .blade:nth-child(3) {
  transform: rotate(60deg) translate(146%);
}

.spinner[data-size="large"] .blade:nth-child(4) {
  transform: rotate(90deg) translate(146%);
}

.spinner[data-size="large"] .blade:nth-child(5) {
  transform: rotate(120deg) translate(146%);
}

.spinner[data-size="large"] .blade:nth-child(6) {
  transform: rotate(150deg) translate(146%);
}

.spinner[data-size="large"] .blade:nth-child(7) {
  transform: rotate(180deg) translate(146%);
}

.spinner[data-size="large"] .blade:nth-child(8) {
  transform: rotate(210deg) translate(146%);
}

.spinner[data-size="large"] .blade:nth-child(9) {
  transform: rotate(240deg) translate(146%);
}

.spinner[data-size="large"] .blade:nth-child(10) {
  transform: rotate(270deg) translate(146%);
}

.spinner[data-size="large"] .blade:nth-child(11) {
  transform: rotate(300deg) translate(146%);
}

.spinner[data-size="large"] .blade:nth-child(12) {
  transform: rotate(330deg) translate(146%);
}

.spinner[data-size="extraLarge"] {
  width: 1.5rem;
  height: 1.5rem;
}

.spinner[data-size="extraLarge"] .blade {
  width: .375rem;
  height: 2.5px;
}

.spinner[data-size="extraLarge"] .blade:first-child {
  transform: rotate(0) translate(146%);
}

.spinner[data-size="extraLarge"] .blade:nth-child(2) {
  transform: rotate(30deg) translate(146%);
}

.spinner[data-size="extraLarge"] .blade:nth-child(3) {
  transform: rotate(60deg) translate(146%);
}

.spinner[data-size="extraLarge"] .blade:nth-child(4) {
  transform: rotate(90deg) translate(146%);
}

.spinner[data-size="extraLarge"] .blade:nth-child(5) {
  transform: rotate(120deg) translate(146%);
}

.spinner[data-size="extraLarge"] .blade:nth-child(6) {
  transform: rotate(150deg) translate(146%);
}

.spinner[data-size="extraLarge"] .blade:nth-child(7) {
  transform: rotate(180deg) translate(146%);
}

.spinner[data-size="extraLarge"] .blade:nth-child(8) {
  transform: rotate(210deg) translate(146%);
}

.spinner[data-size="extraLarge"] .blade:nth-child(9) {
  transform: rotate(240deg) translate(146%);
}

.spinner[data-size="extraLarge"] .blade:nth-child(10) {
  transform: rotate(270deg) translate(146%);
}

.spinner[data-size="extraLarge"] .blade:nth-child(11) {
  transform: rotate(300deg) translate(146%);
}

.spinner[data-size="extraLarge"] .blade:nth-child(12) {
  transform: rotate(330deg) translate(146%);
}

.spinner[data-size="extraExtraLarge"] {
  width: 2rem;
  height: 2rem;
}

.spinner[data-size="extraExtraLarge"] .blade {
  width: .5rem;
  height: 2.5px;
}

.spinner[data-size="extraExtraLarge"] .blade:first-child {
  transform: rotate(0) translate(146%);
}

.spinner[data-size="extraExtraLarge"] .blade:nth-child(2) {
  transform: rotate(24deg) translate(146%);
}

.spinner[data-size="extraExtraLarge"] .blade:nth-child(3) {
  transform: rotate(48deg) translate(146%);
}

.spinner[data-size="extraExtraLarge"] .blade:nth-child(4) {
  transform: rotate(72deg) translate(146%);
}

.spinner[data-size="extraExtraLarge"] .blade:nth-child(5) {
  transform: rotate(96deg) translate(146%);
}

.spinner[data-size="extraExtraLarge"] .blade:nth-child(6) {
  transform: rotate(120deg) translate(146%);
}

.spinner[data-size="extraExtraLarge"] .blade:nth-child(7) {
  transform: rotate(144deg) translate(146%);
}

.spinner[data-size="extraExtraLarge"] .blade:nth-child(8) {
  transform: rotate(168deg) translate(146%);
}

.spinner[data-size="extraExtraLarge"] .blade:nth-child(9) {
  transform: rotate(192deg) translate(146%);
}

.spinner[data-size="extraExtraLarge"] .blade:nth-child(10) {
  transform: rotate(216deg) translate(146%);
}

.spinner[data-size="extraExtraLarge"] .blade:nth-child(11) {
  transform: rotate(240deg) translate(146%);
}

.spinner[data-size="extraExtraLarge"] .blade:nth-child(12) {
  transform: rotate(264deg) translate(146%);
}

.spinner[data-size="extraExtraLarge"] .blade:nth-child(13) {
  transform: rotate(288deg) translate(146%);
}

.spinner[data-size="extraExtraLarge"] .blade:nth-child(14) {
  transform: rotate(312deg) translate(146%);
}

.spinner[data-size="extraExtraLarge"] .blade:nth-child(15) {
  transform: rotate(336deg) translate(146%);
}
`;
