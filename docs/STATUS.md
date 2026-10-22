# Project status

Updated 2026-10-21. This file is the sole current handoff for the repository.

## Current work

Phase: verify the approved maintainer workflow migration. Use the [specification](../spec/SPEC-maintainer-workflow.md), [plan](../tasks/plan.md) and [task list](../tasks/todo.md).

Tasks 1–11 are complete. The new workflow is active. All 970 original files are migrated or explicitly retired. The old notes tree, root port plan and five local skills are removed. [Evidence](verification/workflow-migration/README.md).

The task-8 preparation passes all 24 required runtime checks, seven manual commands and 1,446 component cases. All contracts, history and 22 verification summaries pass semantic review. The clean cutover candidate still needs task 12. Original paths remain in Git history and immutable provenance only.

## Next step

Run task 12 on the clean cutover candidate: the complete repository gate, actual fresh Claude/Codex sessions and final independent review. No further routine implementation approval is pending.

One coordinator owns shared records, commits and build/browser runs. Workers own disjoint destinations and batch reports. Read those reports before accepting their results. Keep heavy build and browser jobs serial.

## Verification and open issues

- The migration guard passes 94 focused tests. The runner retains all 24 ordered invocations. The moved helper, npm-cache proof, Table declaration control, React type fixture and removal audit pass their focused checks.
- Baseline main 1b5d08a420f7f916b0c87b166527c60985937f4d has a passing quality run 39516728235 and a failing documentation run 39516728504. One Chromium Hover Card activation case fails; deployment is skipped. [Issue](../.scratch/maintenance/issues/001-hover-card-activation.md).
- Actual Safari, assistive technology, operating-system input/autofill and background-window behavior remain unperformed. [Platform follow-up](../.scratch/maintenance/issues/002-actual-platform-verification.md).
- The earlier npm-token rotation is owner-controlled and unconfirmed. Release authentication is complete. [Security follow-up](../.scratch/maintenance/issues/003-npm-token-rotation.md).
- Reviewed dependency dispositions expire 2026-11-20. [Review deadline](../.scratch/maintenance/issues/004-advisory-review-deadline.md).

Use Bun 1.4.2. This machine's verified executable is:

```text
.artifacts/runtime/bun-1.4.2/bun-darwin-aarch64/bun
```

The current browser runtime is:

```text
/Users/peterkloss/Library/Caches/acme-design-system/browser-checks
```

These are local paths, not portable dependencies. Verify they exist before use. The [verification guide](agents/verification.md) owns check policy and dependency order.

## Git and permissions

Branch: codex/maintainer-workflow-migration. The reviewed cutover is saved with this handoff. Inspect Git for the exact clean candidate identity before task 12. No push or external write has occurred.

Peter approves this migration's specification, plan, local implementation and verified local commits. Push, pull request, merge, release and external release-body edits remain unapproved. Prepare their concrete result before asking once. Three [release-body corrections](verification/workflow-migration/external-reference-audit.json) are prepared; published archives, tags and signatures stay immutable.

## Product checkpoint

The systematization pass is implemented and released as 0.3.2 across five packages. Its [release record](releases/0.3.2.md) preserves the exact automated acceptance and its limits. The newer failing baseline above remains visible; release history does not certify the current checkout.

The [specification index](../spec/README.md) routes current contracts. [Decisions](decisions/README.md), [research](research/README.md) and [completed pass history](history/systematization/pass-history.md) provide supporting context.
