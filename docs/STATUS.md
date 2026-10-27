# Project status

Updated 2026-10-27. This file is the sole current handoff for the repository.

## Current work

No approved task is in progress. [Issue #9](https://github.com/acmelabs-15/design-system/issues/9) is fixed and closed: release 0.3.3 is public across all five packages, and the MCP package declares `zod ^4.6.7` and `@modelcontextprotocol/sdk ^1.32.0` ([decision 0116](decisions/0116-mcp-dependency-ranges.md)). The completed [plan](../tasks/plan.md) and [tasks](../tasks/todo.md) stay in `tasks/` until the next plan archives them to `tasks/done/`. [Release record](releases/0.3.3.md).

## Next step

Peter asked for faster CI. [Research 22](research/22-ci-duration.md) measures where the time goes and records his selections:

- Verify each commit once, then split the browser stage into parallel jobs.
- Aim at about 5–5.5 minutes for a code change, with a task-level build cache through `actions/cache`, one key per build step. Turborepo is not used.
- Still open for the plan: TypeScript 7 against decision 0053, the Firefox per-route isolation in the documentation check, and the trust check in the publish path.

The next action is a specification and plan for that work, through `/brain:spec`, then Peter's plan approval. Nothing about it is approved for implementation yet.

## Red checks

None. The PR, main and tag quality runs for 0.3.3 pass on Linux, and the dependency audit has no unresolved high or critical finding.

## Working tree

Another session owns uncommitted changes from 2026-10-22 and 2026-10-23: `.vscode/settings.json`, `src/components/checkbox-card/checkbox-card.ts`, `AGENTS_proposal.md`, `CLAUDE_proposal.md` and `README_proposal.md`. They stay in the working tree and are never staged with other work.

## Pending for Peter

- On 2026-10-27 Peter asks that questions use the `ask-user-question:ask-user-question` skill. [AGENTS.md](../AGENTS.md) still names `brain:ask-user-question`; changing that file is his decision.
- On 2026-10-27, with Peter's approval, `Bash(gh release:*)` moves from `deny` to `ask` in his global `~/.claude/settings.json`, so each `gh release` command now asks first.

## Open follow-ups

These maintenance issues do not become resolved merely because later checks pass:

- [Earlier Hover Card activation failure](../.scratch/maintenance/issues/001-hover-card-activation.md): its cause remains unverified.
- [Earlier registration-test timeout](../.scratch/maintenance/issues/005-registration-test-timeout.md): its cause remains unverified. No assertion or timeout is relaxed.
- [Actual-platform verification](../.scratch/maintenance/issues/002-actual-platform-verification.md): actual Safari, assistive technology, operating-system input/autofill and background-window checks remain unperformed.
- [Owner-controlled token rotation](../.scratch/maintenance/issues/003-npm-token-rotation.md): rotation is unconfirmed. Release authentication is complete.
- [Dependency disposition review](../.scratch/maintenance/issues/004-advisory-review-deadline.md): review is due 2026-11-20.
- [Bun lockfile entries for bundled dependencies](../.scratch/maintenance/issues/006-bun-bundled-dependency-lock.md): Bun records versions it never installs; revisit with issue 004.
- [Publication confirmation wait](../.scratch/maintenance/issues/007-publication-confirmation-wait.md): each release needs publish-job reruns while npm reviews uploads.

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

Peter's 2026-10-27 approvals covered release 0.3.3 only: its local work, the held-Pages publication order and the final records PR. They grant nothing for the CI work or any other publication.

## Product checkpoint

Version 0.3.3 is the latest release across five packages. [Release 0.3.3](releases/0.3.3.md), [release 0.3.2](releases/0.3.2.md).

The [specification index](../spec/README.md) routes current contracts. [Decisions](decisions/README.md), [research](research/README.md) and [completed pass history](history/systematization/pass-history.md) provide supporting context.
