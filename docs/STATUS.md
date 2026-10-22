# Project status

Updated 2026-10-22. This file is the sole current handoff for the repository.

## Current work

Phase: verify the approved maintainer workflow migration. Use the [specification](../spec/SPEC-maintainer-workflow.md), [plan](../tasks/plan.md) and [task list](../tasks/todo.md).

Tasks 1–11 are complete. The new workflow is active. All 970 original files are migrated or explicitly retired. The old notes tree, root port plan and five local skills are removed. [Evidence](verification/workflow-migration/README.md).

The task-8 preparation passes all 24 required runtime checks, seven manual commands and 1,446 component cases. All contracts, history and 22 verification summaries pass semantic review. The clean cutover candidate still needs task 12. Original paths remain in Git history and immutable provenance only.

## Next step

Finish the diagnostic correction's full unit check, then run the eight corrected fresh-host probes. All required runtime stages pass on clean revision 5f74c3a0ceb57e2c5a54afe7e23bac91b9bbebb2 through the preserved invocation and resumed stages. The later correction affects only private audit error reporting. No further routine implementation approval is pending.

Finish all authorized local verification and corrections before requesting the outward-action approval. The three external link corrections keep the final migration guard pending; they do not block local checks. Overall migration acceptance remains pending until those approved corrections are applied. Local verification completion and the final migration verdict have separate evidence.

One coordinator owns shared records, commits and build/browser runs. Workers own disjoint destinations and batch reports. Read those reports before accepting their results. Keep heavy build and browser jobs serial.

## Verification and open issues

- The migration guard passes 94 focused tests. The runner retains all 24 ordered invocations. The moved helper, npm-cache proof, Table declaration control, React type fixture and removal audit pass their focused checks.
- The first clean gate passes static checks, build and strict types, then records 1,117 unit passes and one 55-second timeout. The isolated case passes in 0.5 seconds; its 27-test file and the 121-test guard-plus-registration sequence pass unchanged. The cause remains unverified. [Timeout record](../.scratch/maintenance/issues/005-registration-test-timeout.md).
- The corrected candidate passes all 1,118 unit tests, all 24 browser invocations and 1,446 component cases. Package, browser-installation and release checks pass. Two native audit requests return HTTP 503; later original-configuration requests pass the unchanged audit gate with two verified dispositions. No credential cause is established. [Preserved runs and scope](verification/workflow-migration/task-12.json).
- The audit wrapper now preserves native diagnostics when JSON output is empty or malformed. All five review axes accept the narrow fix. Its 13 focused tests, strict types and focused static checks pass. Full unit closure remains next.
- The first host iteration has seven graded probes. It finds two Claude failures: skipped mandatory startup reads and an unsupported guard-waiver proposal. Reviewed pointers and status wording address both. The corrected eight-probe iteration remains required; earlier outcomes are retained.
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

Branch: codex/maintainer-workflow-migration. Runtime acceptance uses clean revision 5f74c3a0ceb57e2c5a54afe7e23bac91b9bbebb2. The narrow audit diagnostic correction and its evidence are saved with this handoff. Inspect Git for its exact identity before full unit closure. Product sources, dependencies and versions remain unchanged. No push or external write has occurred.

Peter approves this migration's specification, plan, local implementation and verified local commits. Push, pull request, merge, release and external release-body edits remain unapproved. Prepare their concrete result before asking once. Three [release-body corrections](verification/workflow-migration/external-reference-audit.json) are prepared; published archives, tags and signatures stay immutable.

## Product checkpoint

The systematization pass is implemented and released as 0.3.2 across five packages. Its [release record](releases/0.3.2.md) preserves the exact automated acceptance and its limits. The newer failing baseline above remains visible; release history does not certify the current checkout.

The [specification index](../spec/README.md) routes current contracts. [Decisions](decisions/README.md), [research](research/README.md) and [completed pass history](history/systematization/pass-history.md) provide supporting context.
