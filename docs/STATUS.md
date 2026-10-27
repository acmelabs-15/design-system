# Project status

Updated 2026-10-27. This file is the sole current handoff for the repository.

## Current work

[Issue #9](https://github.com/acmelabs-15/design-system/issues/9): the published MCP package 0.3.2 pins `zod` at exactly 4.6.5, which has a high advisory. The fix releases 0.3.3 of all five packages. [Plan](../tasks/plan.md), [tasks](../tasks/todo.md), [release record](releases/0.3.3.md).

Tasks 1 to 4 are complete on branch claude/issue-9-mcp-dependencies. The MCP package declares `zod ^4.6.7` and `@modelcontextprotocol/sdk ^1.32.0`, as Peter selected in [decision 0116](decisions/0116-mcp-dependency-ranges.md). The four high audit findings are fixed by upgrade, and all five packages are at 0.3.3. The complete gate passes on a clean checkout of f9dc599c8, and the five-axis review approves.

## Next step

Task 5, publication, is in progress. Peter approves the held-Pages plan on 2026-10-27. The order:

1. Set the repository variable `ACME_PAGES_ENABLED` to false.
2. Push the branch and open a PR to main.
3. Pass the Linux quality checks on the PR head, then merge with a merge commit.
4. Tag v0.3.3 on the merge commit and pass the publish workflow.
5. Verify the five public npm versions, their provenance and latest tags, and a fresh consumer's `zod` resolution.
6. Set `ACME_PAGES_ENABLED` to true, rerun the documentation deploy for the merge commit, and verify the site.
7. Publish the GitHub release, then comment on and close issue #9.
8. Land the final records through a records-only PR.

If this session stops, check the GitHub state of each step before repeating it. `ACME_PAGES_ENABLED` must return to true.

## Red checks

None locally. The Linux quality workflow has not run on this branch yet. Main's last quality run, 39784095475 on 76acca900, is cancelled. The local audit on main's lockfile fails with four high findings, as the [plan baseline](../tasks/plan.md#baseline) records.

## Working tree

Branch claude/issue-9-mcp-dependencies holds the committed work; nothing is pushed. Another session owns uncommitted changes from 2026-10-22 and 2026-10-23: `.vscode/settings.json`, `src/components/checkbox-card/checkbox-card.ts`, `AGENTS_proposal.md`, `CLAUDE_proposal.md` and `README_proposal.md`. They stay in the working tree and are never staged with this work.

The maintainer workflow migration is complete. Its plan and tasks are in [tasks/done/maintainer-workflow](../tasks/done/maintainer-workflow/plan.md).

## Open follow-ups

These maintenance issues do not become resolved merely because later checks pass:

- [Earlier Hover Card activation failure](../.scratch/maintenance/issues/001-hover-card-activation.md): its cause remains unverified.
- [Earlier registration-test timeout](../.scratch/maintenance/issues/005-registration-test-timeout.md): its cause remains unverified. No assertion or timeout is relaxed.
- [Actual-platform verification](../.scratch/maintenance/issues/002-actual-platform-verification.md): actual Safari, assistive technology, operating-system input/autofill and background-window checks remain unperformed.
- [Owner-controlled token rotation](../.scratch/maintenance/issues/003-npm-token-rotation.md): rotation is unconfirmed. Release authentication is complete.
- [Dependency disposition review](../.scratch/maintenance/issues/004-advisory-review-deadline.md): review is due 2026-11-20.
- [Bun lockfile entries for bundled dependencies](../.scratch/maintenance/issues/006-bun-bundled-dependency-lock.md): Bun records versions it never installs; revisit with issue 004.

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

Plan approval authorizes local implementation and verified local commits on the work branch. On 2026-10-27 Peter approves the task 5 outward actions in the held-Pages order above: the two variable changes, push, PR, merge with a merge commit after passing checks, tag v0.3.3, npm publication, deploy rerun, GitHub release, the issue #9 comment and closure, and the final records PR. This approval covers release 0.3.3 only. The earlier migration approvals do not cover this work.

## Product checkpoint

Version 0.3.2 is the latest public release across five packages. Version 0.3.3 is prepared and verified locally; it is not published. [Release 0.3.2](releases/0.3.2.md), [release 0.3.3](releases/0.3.3.md).

The [specification index](../spec/README.md) routes current contracts. [Decisions](decisions/README.md), [research](research/README.md) and [completed pass history](history/systematization/pass-history.md) provide supporting context.
