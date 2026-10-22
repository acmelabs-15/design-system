# Project status

Updated 2026-10-22. This file is the sole current handoff for the repository.

## Current work

The maintainer workflow migration is implemented and published through [PR #7](https://github.com/acmelabs-15/design-system/pull/7). Its merge commit is 5488580a6aec0abac16470656aecb38f6f9c4840. All twelve tasks and Checkpoint D are complete. [Specification](../spec/SPEC-maintainer-workflow.md), [plan](../tasks/plan.md), [task list](../tasks/todo.md), [evidence](verification/workflow-migration/README.md).

Brain and agent-skills now provide one shared workflow for all five packages. All 970 original files are migrated or explicitly retired. The old notes tree, root port plan and five local skills are removed. Component behavior, dependencies and package versions are unchanged.

## Next step

Only delivery of the final records can remain. Check the GitHub PR for the branch codex/workflow-publication-receipt. If it is open, finish its checks and merge with a merge commit under Peter's existing full-publication approval. Once that PR is merged, no migration work or pending decision remains. Await Peter's next request.

This receipt certifies the implementation merge and deployment above. GitHub records the receipt PR's own checks and merge, so another receipt commit is unnecessary. Inspect local Git status before resuming and preserve unrelated work. [Publication receipt and authorization](verification/workflow-migration/task-12.json).

## Verification

- The complete [PR quality run](https://github.com/acmelabs-15/design-system/actions/runs/39765513004) passes on reviewed head 9fa57f8287bf151f7de53bb64e8f5597110220ff. The merge has both expected parents and an identical source tree.
- The complete [main quality run](https://github.com/acmelabs-15/design-system/actions/runs/39771017002) and [documentation workflow](https://github.com/acmelabs-15/design-system/actions/runs/39771017203) pass on the merge commit. GitHub Pages deploys the verified artifact.
- The [live documentation](https://acmelabs-15.github.io/design-system/) passes the isolated browser check. Home-to-Button navigation, native link naming and component rendering work. No console error, warning or network failure occurs. The index, application script, documentation stylesheet and Button page match the deployed artifact byte for byte.
- The migration guard accounts for 970 sources, 980 destinations and 197 batches, with zero errors or pending references. All 728 original raw files retain their bytes. Three release-body evidence links now use the immutable pre-migration commit. Tag objects and all eight release assets remain unchanged.
- Earlier local attempts, resumed stages, host checks and five-axis reviews remain in [task 12](verification/workflow-migration/task-12.json). A complete local full-gate invocation did not pass uninterrupted; the later complete GitHub runs do. Fresh-host checks are bounded samples. They do not certify compaction, process cancellation or write-time handoff. Native Claude package imports retain their recorded consent limitation; the explicit shared-file read passes.

## Open follow-ups

These existing maintenance issues do not become resolved merely because later checks pass:

- [Earlier Hover Card activation failure](../.scratch/maintenance/issues/001-hover-card-activation.md): its cause remains unverified.
- [Earlier registration-test timeout](../.scratch/maintenance/issues/005-registration-test-timeout.md): its cause remains unverified. No assertion or timeout is relaxed.
- [Actual-platform verification](../.scratch/maintenance/issues/002-actual-platform-verification.md): actual Safari, assistive technology, operating-system input/autofill and background-window checks remain unperformed.
- [Owner-controlled token rotation](../.scratch/maintenance/issues/003-npm-token-rotation.md): rotation is unconfirmed. Release authentication is complete.
- [Dependency disposition review](../.scratch/maintenance/issues/004-advisory-review-deadline.md): review is due 2026-11-20.

## Runtime and authorization

Use Bun 1.4.2. The verified local executable is:

```text
.artifacts/runtime/bun-1.4.2/bun-darwin-aarch64/bun
```

The verified local browser runtime is:

```text
/Users/peterkloss/Library/Caches/acme-design-system/browser-checks
```

These paths are machine-specific. Verify them before use. The [verification guide](agents/verification.md) owns check policy and dependency order.

Peter approves this migration's local work and commits. His explicit 2026-10-22 full-publication approval covers its push, PR, three link-only release edits, merge after passing checks, normal documentation deployment and final records. The earlier Claude verification approval covers its recorded transmissions. Neither approval grants permission for a new feature or unrelated publication.

## Product checkpoint

The systematization pass is implemented and released as 0.3.2 across five packages. Its [release record](releases/0.3.2.md) preserves that release's acceptance and limits. This maintainer migration creates no new package release.

The [specification index](../spec/README.md) routes current contracts. [Decisions](decisions/README.md), [research](research/README.md) and [completed pass history](history/systematization/pass-history.md) provide supporting context.
