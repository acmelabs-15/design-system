# Project status

Updated 2026-10-22. This file is the sole current handoff for the repository.

## Current work

Phase: ready for GitHub publication of the approved maintainer workflow migration. Use the [specification](../spec/SPEC-maintainer-workflow.md), [plan](../tasks/plan.md) and [task list](../tasks/todo.md).

Tasks 1–11 are complete. The new workflow is active. All 970 original files are migrated or explicitly retired. The old notes tree, root port plan and five local skills are removed. [Evidence](verification/workflow-migration/README.md).

All authorized local implementation and checks are complete. Task 12 and Checkpoint D remain open only for the external link corrections and final acceptance. Component behavior, dependencies and package versions are unchanged.

## Next step

Local implementation and verification are complete. Ask once for the prepared GitHub publication: push this branch, open a pull request, apply the three existing release-body link corrections, and merge with a merge commit after required GitHub checks pass. [Exact proposal and evidence](verification/workflow-migration/task-12.json). No GitHub write is authorized yet.

Each release correction changes one main-branch evidence URL to the immutable pre-migration commit. Re-read the remote bodies before writing. After the actual corrections, update their evidence and run the final migration guard. Its three remaining external errors must clear before overall acceptance. Preserve published archives, signatures and tags. The existing documentation deployment follows the merge; verify its result for the actual merge commit.

The Claude root import works. Package starts use the reviewed explicit full read of the same shared instructions. The corrected package session verifies early brain consumption, all selected startup files, actual Git state, pinned Bun 1.4.2 and unchanged covered files. Native package auto-import remains a recorded consent-boundary limitation. The read-only test grants directory scope only to this repository.

One coordinator owns shared records, commits and build/browser runs. Workers own disjoint destinations and result records. Read those records before accepting their results. Keep heavy build and browser jobs serial.

## Verification and open issues

- All 970 sources and 197 batches are accounted for. The reference guard finds no local migration errors. Its only three errors are the pending external release-link corrections. Raw evidence hashes remain intact.
- All required runtime stages pass on clean revision 5f74c3a0ceb57e2c5a54afe7e23bac91b9bbebb2 through the preserved invocation and resumed stages. Coverage includes all 24 browser invocations and 1,446 component cases. No stage or assertion is waived. No single uninterrupted full-gate invocation passes.
- The later audit diagnostic correction at 4782c25980e4f77e2b1f4cfa83788748d090bfbc passes all 1,126 unit tests, strict types, focused static checks and the normal audit. All five review axes accept the migration and this correction. Product and build inputs are unchanged.
- The corrected host iteration runs all eight cases on the real Claude and Codex CLIs. Read-only snapshots preserve all 70,383 live entries and 1,510 entries in each fixture. Codex native metadata confirms the shared instruction file from root and package starts. Claude root native import and the corrected explicit package startup also pass at their recorded source identities. The last package case preserves all 70,383 covered entries. Three nonblocking report wording/order observations remain in task 12; perfect or universal model behavior is not claimed.
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

Branch: codex/maintainer-workflow-migration. Runtime acceptance uses clean revision 5f74c3a0ceb57e2c5a54afe7e23bac91b9bbebb2; final checker/unit acceptance uses 4782c25980e4f77e2b1f4cfa83788748d090bfbc. The initial corrected host matrix uses cb3d72281ea14684cbec132fabd3d3cdd27e7126 and separately recorded synthetic fixtures. Final Claude package acceptance uses clean 051f1ad9eca7e7ece8288112a946888e4101736a. Later commits save workflow instructions and evidence. Product and build inputs remain unchanged. No push, pull request, merge or release-body edit has occurred.

Peter approves this migration's specification, plan, local implementation and verified local commits. On 2026-10-22 he also explicitly approves the two remaining Claude checks and their stated data transmission to Anthropic. Publication remains a separate decision.

Three [release-body corrections](verification/workflow-migration/external-reference-audit.json) are prepared. Published archives, tags and signatures remain immutable. The pull-request text and exact release-body proposals are ready for the one scoped publication approval.

## Product checkpoint

The systematization pass is implemented and released as 0.3.2 across five packages. Its [release record](releases/0.3.2.md) preserves exact automated acceptance and its limits. The newer failing baseline above remains visible; release history does not certify the current checkout.

The [specification index](../spec/README.md) routes current contracts. [Decisions](decisions/README.md), [research](research/README.md) and [completed pass history](history/systematization/pass-history.md) provide supporting context.
