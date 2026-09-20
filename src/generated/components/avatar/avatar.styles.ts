// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const avatarCss = css`.avatar {
  height: var(--size);
  width: var(--size);
  vertical-align: top;
  border-radius: 2147483647px;
  flex-shrink: 0;
  line-height: 0;
  transition-property: background;
  transition-duration: .2s;
  transition-timing-function: cubic-bezier(.4, 0, .2, 1);
  animation-duration: .2s;
  animation-timing-function: cubic-bezier(.4, 0, .2, 1);
  display: inline-block;
  position: relative;
  overflow: hidden;
  -webkit-mask-image: radial-gradient(circle, #fff, #000);
  mask-image: radial-gradient(circle, #fff, #000);
}

.avatar :where(img) {
  width: 100%;
  max-width: 100%;
  height: 100%;
  position: relative;
}

.avatar :where(.letter) {
  background-color: var(--accents-6);
  height: 100%;
  color: var(--ds-white);
  opacity: .5;
  justify-content: center;
  align-items: center;
  font-weight: 500;
  display: flex;
}

.avatar:after {
  content: "";
  border-style: solid;
  border-width: 1px;
  border-color: var(--ds-gray-alpha-400);
  border-radius: 2147483647px;
  width: 100%;
  height: 100%;
  position: absolute;
  inset: 0;
}

.avatar[data-mask="false"] {
  border-radius: .375rem;
}

.avatar[data-mask="false"]:before, .avatar[data-mask="false"]:after {
  content: "";
  display: none;
}

.avatar[data-resolved="false"]:before {
  content: "";
  background-image: linear-gradient(to right in oklab, var(--accents-1) 0%, var(--accents-2) 50%, var(--accents-1) 100%);
  background-size: 400% 100%;
  border-radius: 2147483647px;
  width: 100%;
  height: 100%;
  animation: 8s ease-in-out infinite loading;
  position: absolute;
  inset: 0;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }

  to {
    background-position: -200% 0;
  }
}
`;
