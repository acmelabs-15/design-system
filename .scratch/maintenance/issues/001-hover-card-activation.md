# Hover Card destination activation in CI

Status: needs-triage
Type: task
Owner: maintainer investigation

## Evidence

Main revision 1b5d08a420f7f916b0c87b166527c60985937f4d has passing quality run 39516728235 and failing documentation run 39516728504. Deployment is skipped.

The failing Chromium Tooltip-suite case is “Hover Card preserves native destination activation and never focuses its preview.” It expects the location fragment #profile and observes an empty fragment. The cause remains unverified.

The migration's local run passes this case and all 1,446 component cases. That pass does not identify the earlier CI failure's cause. [Original capture](../../../docs/verification/workflow-migration/initial-research.json), [local relocation acceptance](../../../docs/verification/workflow-migration/task-08.json), [test source](../../../src/components/tooltip/__tests__/tooltip.browser.ts).

## Scope and completion

Investigate with brain's debugging workflow using the exact archive, browser and host conditions. Preserve the destination-activation assertion. A component change requires its own scope unless the approved migration's final gate demonstrates a blocking prerequisite.

Completion needs a supported cause, a verification case that detects it, and passing affected browser checks in the relevant environment. Record the old failure and the correction separately. A passing rerun alone does not close the issue.

## Comments

2026-10-21: carried into the new tracker. No product behavior changes are made by this migration.
