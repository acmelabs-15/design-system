// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const severityCss = css`.severity {
  gap: 8px;
  height: 8px;
  margin-bottom: 16px;
  display: flex;
}

.severity i {
  background: var(--ds-gray-300);
  border-radius: 999px;
  height: 100%;
  display: block;
}

.severity i.high {
  background: var(--ds-red-700);
}

.severity i.medium {
  background: var(--ds-amber-700);
}

.severity i.ok {
  background: var(--ds-blue-700);
}

.issue {
  flex-direction: column;
  gap: 12px;
  min-height: 300px;
  display: flex;
}

.issue .top {
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
  display: flex;
}

.issue .title {
  letter-spacing: -.32px;
  font-size: 16px;
  line-height: 24px;
  font-weight: var(--acme-font-weight-600);
  margin: 0;
}

.issue .desc {
  color: var(--text-2);
  margin: 0;
  font-size: 14px;
  line-height: 20px;
}

.issue .who {
  background: var(--comp);
  height: 24px;
  color: var(--ds-gray-800);
  border-radius: 999px;
  align-items: center;
  gap: 6px;
  width: fit-content;
  padding: 2px 10px 2px 4px;
  font-size: 13px;
  display: inline-flex;
}

.issue .who .avatar {
  width: 16px;
  height: 16px;
  font-size: 8px;
}

.issue .actions {
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-top: auto;
  display: flex;
}
`;
