# Investigate the isolated registration-test timeout

Status: needs-triage
Type: task
Owner: maintainer investigation

## Observed result

The first clean workflow-migration gate runs on revision 632a392291a6761ea7f8f2460a7cac05ff2bc4ec with Bun 1.4.2. Static checks, build and strict types pass. Unit results are 1,117 passed and one timeout.

The failing case is “optional icon definitions stay selective while owned icon dependencies load.” It measures 55,072 milliseconds against the unchanged 5,000-millisecond limit. The registration source, test, preload, runtime configuration, package manifest and lockfile are unchanged from main.

The same isolated case passes in 499 milliseconds. All 27 tests in its file pass. All 121 tests in the migration-guard-plus-registration sequence pass. The power-event window contains no actual sleep or wake transition. These observations do not establish the timeout's cause.

[Task-12 evidence](../../../docs/verification/workflow-migration/task-12.json) preserves the original run and follow-up commands. No timeout, assertion or implementation is changed to obtain a pass.

## Completion

Reproduce the timing failure and identify its cause. Distinguish test state, registration work and host scheduling or resource conditions. A passing rerun alone does not close this issue. Record any corrective change separately from the maintainer migration.

## Comments

2026-10-22: recorded after the first full gate. Local retests pass; the original failure remains visible.
