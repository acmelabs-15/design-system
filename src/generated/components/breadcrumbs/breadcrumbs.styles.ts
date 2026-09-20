// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const breadcrumbsCss = css`.list {
  display: flex;
}

.list:where(:not(.menu)) {
  gap: .375rem;
  padding: 0;
  list-style-type: none;
}

.list:where(.menu) {
  gap: .5rem;
}

@media not all and (width >= 401px) {
  .list:where(.menu) {
    overflow-x: auto;
  }
}
`;
