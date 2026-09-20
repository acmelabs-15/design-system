// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const railCss = css`.with-rail {
  gap: var(--s-4);
  grid-template-columns: minmax(0, 1fr) 300px;
  align-items: start;
  display: grid;
}

.rail {
  gap: var(--s-4);
  top: calc(var(--bar-h) + 16px);
  flex-direction: column;
  display: flex;
  position: sticky;
}

@media (width <= 900px) {
  .with-rail {
    grid-template-columns: minmax(0, 1fr);
  }

  .rail {
    position: static;
  }
}
`;
