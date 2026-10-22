# Project status

Updated 2026-10-22. This file is the sole current handoff for the repository.

## Current work

Phase: verify the approved maintainer workflow migration. Use the [specification](../spec/SPEC-maintainer-workflow.md), [plan](../tasks/plan.md) and [task list](../tasks/todo.md).

Tasks 1–11 are complete. The new workflow is active. All 970 original files are migrated or explicitly retired. The old notes tree, root port plan and five local skills are removed. [Evidence](verification/workflow-migration/README.md).

All required runtime stages pass. Task 12 remains open for the remaining Claude verification and three external release-link corrections. No product behavior, dependency or package version changes belong to this migration.

## Next step

Obtain explicit authorization for the remaining read-only Claude verification. Automatic approval review rejects both the native loaded-context listing and a focused package-session retry because the authenticated CLI can send repository context to an external service. Do not retry either through another execution route. The exact actions, prepared commands, data scope and retained results are in [task 12](verification/workflow-migration/task-12.json).

After authorization, finish the remaining Claude checks with the existing subscription and installed plugins. Preserve earlier attempts. Re-run only a case invalidated by a reviewed instruction or harness correction. Record actual source revisions and file preservation. The package retry adds only the two exact read-only directory listings that the prior harness denied.

Finish local verification and records before requesting outward-action approval. Push, pull request, merge and release-body edits remain unapproved. Three prepared release-link corrections keep the final migration guard pending; they do not block the remaining local work. Overall acceptance requires those corrections and a passing final guard. No waiver is approved.

One coordinator owns shared records, commits and build/browser runs. Workers own disjoint destinations and result records. Read those records before accepting their results. Keep heavy build and browser jobs serial.

## Verification and open issues

- All 970 sources and 197 batches are accounted for. The reference guard finds no local migration errors. Its only three errors are the pending external release-link corrections. Raw evidence hashes remain intact.
- All required runtime stages pass on clean revision 5f74c3a0ceb57e2c5a54afe7e23bac91b9bbebb2 through the preserved invocation and resumed stages. Coverage includes all 24 browser invocations and 1,446 component cases. No stage or assertion is waived. No single uninterrupted full-gate invocation passes.
- The later audit diagnostic correction at 4782c25980e4f77e2b1f4cfa83788748d090bfbc passes all 1,126 unit tests, strict types, focused static checks and the normal audit. All five review axes accept the migration and this correction. Product and build inputs are unchanged.
- The corrected host iteration runs all eight cases on the real Claude and Codex CLIs. Read-only snapshots preserve all 70,383 live entries and 1,510 entries in each fixture. Codex native metadata confirms the shared instruction file from root and package starts. Claude still has explicit verification gaps; the detailed grading owns those limits.
- The first clean gate records one registration-test timeout. Focused and later complete tests pass unchanged; the cause remains unverified. [Timeout issue](../.scratch/maintenance/issues/005-registration-test-timeout.md).
- Two native audit requests return HTTP 503; later original-configuration requests pass the unchanged classification gate with two verified dispositions. No credential cause is established. The wrapper now preserves native diagnostics for empty or malformed output.
- Baseline main 1b5d08a420f7f916b0c87b166527c60985937f4d has a passing quality run 39516728235 and a failing documentation run 39516728504. One Chromium Hover Card activation case fails; deployment is skipped. A later local pass does not explain that cause. [Issue](../.scratch/maintenance/issues/001-hover-card-activation.md).
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

Branch: codex/maintainer-workflow-migration. Runtime acceptance uses clean revision 5f74c3a0ceb57e2c5a54afe7e23bac91b9bbebb2; final checker/unit acceptance uses 4782c25980e4f77e2b1f4cfa83788748d090bfbc. Corrected behavioral probes use cb3d72281ea14684cbec132fabd3d3cdd27e7126 and separately recorded synthetic fixture revisions. Later commits save evidence and handoff records only. No push, pull request, merge or release-body edit has occurred.

Peter approves this migration's specification, plan, local implementation and verified local commits. Automatic approval review now requires explicit data-transmission authorization for the remaining Claude checks. That authorization would cover those checks only. It would not authorize publication.

Three [release-body corrections](verification/workflow-migration/external-reference-audit.json) are prepared. Published archives, tags and signatures remain immutable. After local acceptance, prepare the final pull-request text and ask once for the concrete outward actions.

## Product checkpoint

The systematization pass is implemented and released as 0.3.2 across five packages. Its [release record](releases/0.3.2.md) preserves exact automated acceptance and its limits. The newer failing baseline above remains visible; release history does not certify the current checkout.

The [specification index](../spec/README.md) routes current contracts. [Decisions](decisions/README.md), [research](research/README.md) and [completed pass history](history/systematization/pass-history.md) provide supporting context.
