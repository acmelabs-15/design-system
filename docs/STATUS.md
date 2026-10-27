# Project status

Updated 2026-10-27. This file is the sole current handoff for the repository.

## Current work

[Issue #9](https://github.com/acmelabs-15/design-system/issues/9): the published MCP package 0.3.2 pins `zod` at exactly 4.6.5, which has a high advisory. The fix releases 0.3.3 of all five packages. [Plan](../tasks/plan.md), [tasks](../tasks/todo.md).

Peter approves the plan on 2026-10-27. He selects caret ranges for both MCP runtime dependencies: `zod ^4.6.7` and `@modelcontextprotocol/sdk ^1.32.0`. Work happens on branch claude/issue-9-mcp-dependencies.

## Next step

Start task 1, MCP runtime dependencies. Tasks 1 and 2 are independent; task 3 waits for both.

## Red checks

The dependency audit fails with four unresolved high findings: `zod`, `body-parser`, `happy-dom` and `undici`. Tasks 1 and 2 own them. The quality workflow runs the audit stage, so every PR fails until they are fixed. [Baseline](../tasks/plan.md#baseline).

## Working tree

Another session owns uncommitted changes from 2026-10-22 and 2026-10-23: `.vscode/settings.json`, `src/components/checkbox-card/checkbox-card.ts`, `AGENTS_proposal.md`, `CLAUDE_proposal.md` and `README_proposal.md`. They stay in the working tree and are never staged with this work.

The maintainer workflow migration is complete. Its plan and tasks are in [tasks/done/maintainer-workflow](../tasks/done/maintainer-workflow/plan.md). PR #8 merges its publication receipt as 76acca900.

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

Plan approval authorizes local implementation and verified local commits on the work branch. No push, PR, merge, tag, release or publication is authorized. Task 5 needs Peter's separate approval, asked once at checkpoint 2. The earlier migration approvals do not cover this work.

## Product checkpoint

Version 0.3.2 is the latest release across five packages. Its [release record](releases/0.3.2.md) preserves that release's acceptance and limits.

The [specification index](../spec/README.md) routes current contracts. [Decisions](decisions/README.md), [research](research/README.md) and [completed pass history](history/systematization/pass-history.md) provide supporting context.
