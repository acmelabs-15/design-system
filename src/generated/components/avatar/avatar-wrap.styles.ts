// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const avatarWrapCss = css`.avatar-wrap :where(.service) {
  aspect-ratio: 1;
  border-style: solid;
  border-width: 1px;
  border-color: var(--ds-white);
  background-color: var(--ds-white);
  border-radius: 2147483647px;
  justify-content: center;
  align-items: center;
  width: fit-content;
  height: fit-content;
  line-height: 1;
  display: inline-flex;
  position: absolute;
  overflow: hidden;
}

.avatar-wrap {
  height: var(--size);
  width: var(--size);
  flex-shrink: 0;
  position: relative;
}

.avatar-wrap:where(.github) :where(.service) :where(svg) {
  color: #000;
  width: .875rem;
  height: .875rem;
}

:where(:host([data-dark])) .avatar-wrap :where(.service) {
  border-color: var(--ds-black);
  background-color: var(--ds-black);
}

.avatar-wrap :where(.service) > slot::slotted(svg), .avatar-wrap :where(.service) > slot > svg {
  display: block !important;
}

.avatar-wrap :where(.service)[data-git-type="bitbucket"] {
  color: var(--ds-white);
  background-color: #0052cc;
}

.avatar-wrap :where(.service)[data-git-type="gitlab"] {
  background-color: #6b4fbb;
}

:where(:host([data-dark])) .avatar-wrap :where(.service)[data-git-type="github"] {
  background-color: var(--ds-black);
}

.avatar-wrap :where(.service)[data-git-type="bitbucket"] slot::slotted(svg), .avatar-wrap :where(.service)[data-git-type="bitbucket"] slot > svg {
  scale: .65 !important;
}

.avatar-wrap :where(.service)[data-git-type="github"] slot::slotted(svg), .avatar-wrap :where(.service)[data-git-type="github"] slot > svg {
  fill: var(--ds-black) !important;
}

.avatar-wrap :where(.service)[data-git-type="gitlab"] slot::slotted(svg), .avatar-wrap :where(.service)[data-git-type="gitlab"] slot > svg {
  scale: .75 !important;
}
`;
