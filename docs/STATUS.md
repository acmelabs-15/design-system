# Project status

Updated 2026-10-21. Prepared handoff for the workflow migration; the [existing entry point](../notes/alignment/README.md#where-we-are) remains authoritative until task 11 activates this file.

## Current work

Phase: build the approved maintainer workflow migration. Use the [specification](../spec/SPEC-maintainer-workflow.md), [plan](../tasks/plan.md) and [task list](../tasks/todo.md).

Tasks 1–6 are complete: runner safety, full source/rule audit, migration guard, 690 exact evidence copies, 115 decisions and 20 research records. Their [verification records](verification/workflow-migration/README.md) distinguish semantic review from byte checks.

Tasks 7–8 are in progress. Current specifications and completed history are being reconciled. Verification drivers and fixtures are relocated; runtime acceptance against freshly built packages remains pending. The old source files remain until the coordinated cutover.

## Next step

Finish task 7 record review and task 8 runtime checks. Then prepare shared guidance, update live references and activate the new startup files. Follow the approved task dependencies. No further routine implementation approval is pending.

One coordinator owns shared records, commits and build/browser runs. Workers own disjoint destinations and batch reports. Read those reports before accepting their results. Keep heavy build and browser jobs serial.

## Verification and open issues

- The migration guard passes 53 focused tests. The runner retains all 24 ordered invocations. The moved helper, npm-cache proof, Table declaration control, React type fixture and removal audit pass their focused checks.
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

Branch: codex/maintainer-workflow-migration. Latest checkpoint: dff4a7fa4, “docs: close record conversion and save verification preparation.” Subsequent task 7 and task 8 preparation remains uncommitted. Inspect Git for exact ownership and current files.

Peter approves this migration's specification, plan, local implementation and verified local commits. Push, pull request, merge, release and external release-body edits remain unapproved. Prepare their concrete result before asking once. Three [release-body corrections](verification/workflow-migration/external-reference-audit.json) are prepared; published archives, tags and signatures stay immutable.

## Product checkpoint

The systematization pass is implemented and released as 0.3.2 across five packages. Its [release record](releases/0.3.2.md) preserves the exact automated acceptance and its limits. The newer failing baseline above remains visible; release history does not certify the current checkout.

The [specification index](../spec/README.md) routes current contracts. [Decisions](decisions/README.md), [research](research/README.md) and [completed pass history](history/systematization/pass-history.md) provide supporting context.
