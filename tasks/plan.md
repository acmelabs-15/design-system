# Implementation plan: MCP dependency advisory

Status: approved by Peter on 2026-10-27 through the task-size, dependency-order and task-boundary questions. Current execution state belongs in [STATUS](../docs/STATUS.md). Task state belongs in [todo.md](todo.md).

## Outcome

[Issue #9](https://github.com/acmelabs-15/design-system/issues/9) reports that `@acmelabs/design-system-mcp` 0.3.2 pins `zod` at exactly 4.6.5. Every `zod` version below 4.6.6 has a high advisory, [GHSA-mrhx-c7xc-m3w5](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5). The exact pin stops consumers from getting the fix without a new release.

This work releases 0.3.3 of all five packages. The MCP package declares `zod ^4.6.7` and `@modelcontextprotocol/sdk ^1.32.0`. The dependency audit reports no unresolved high or critical finding. Issue #9 closes with evidence.

## Baseline

Recorded 2026-10-27 on main 76acca900, with Bun 1.4.2 from the verified local runtime.

- The last complete quality run, [39771017002](https://github.com/acmelabs-15/design-system/actions/runs/39771017002) on 5488580a6, passes. Run 39784095475 on 76acca900 is cancelled.
- `bun scripts/dependency-audit.ts` fails with four unresolved high findings. The two existing reviewed dispositions still verify.

| Package | Locked version | Advisory | First fix | Reaches |
|---|---|---|---|---|
| `zod` | 4.6.5 | [GHSA-mrhx-c7xc-m3w5](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5) | 4.6.6 | MCP runtime: direct exact pin |
| `body-parser` | 2.3.0 | [GHSA-27r3-jxmh-p828](https://github.com/advisories/GHSA-27r3-jxmh-p828) | 2.4.0 | MCP runtime: SDK, then `express` `^2.2.1` |
| `happy-dom` | 20.14.0 | [GHSA-834v-8h66-3h79](https://github.com/advisories/GHSA-834v-8h66-3h79) | 21.0.4 | Development: unit fixtures, exact pin |
| `undici` | 8.11.2 | [GHSA-xjj6-f33q-929c](https://github.com/advisories/GHSA-xjj6-f33q-929c) | 8.12.2 | Lockfile entry only; see below |

The `undici` entry is `npm/undici` under the pinned `npm` 12.0.2 development tool. The `npm` tarball bundles `node-gyp` 13.0.0, which requires `undici ^6.25.0`. The installed copy is 6.27.0, outside the advisory range. Bun records a resolution for the bundled dependency (`npm/node-gyp@13.0.2`, `npm/undici@8.11.2`) but installs the bundled files. `bun audit` reads the recorded resolution.

Moderate and low findings do not block the gate. Those under the MCP runtime (`fast-uri`, `ip-address`, `qs`) refresh with the same lockfile operation where a fix exists inside the declared range.

## Decisions

| Decision | Source and reason |
|---|---|
| Caret ranges for both MCP runtime dependencies | Peter, 2026-10-27, through the dependency-declaration question. Consumers get upstream fixes without a design-system release. Accepted cost: a consumer can resolve a newer version that our CI did not test. |
| Fix all four blocking findings by upgrade; add no new disposition | The publish workflow runs the quality workflow, which runs the audit stage. A release cannot pass with any of them. An upgrade removes the finding; a disposition only explains it. |
| Refresh the `npm/undici` lockfile entry | The installed bytes are not affected, so the refresh changes no installed file. The underlying defect is Bun's recorded resolution for a bundled dependency. A local follow-up issue names it. |
| Pin `happy-dom` and its global registrator at exact 21.0.4 | The root manifest pins both exactly. This keeps that convention. |
| Keep the SDK locked at 1.32.0 | It is the tested version and has no blocking advisory. The new range lets consumers resolve later 1.32 releases. |
| The install test restores the manifest's own `zod` value | The test now hard-codes 4.6.5 as the value to restore. Reading the original value removes that coupling. |
| Coordinated version 0.3.3 | The [repository map](../docs/agents/repository.md) requires coordinated versions for all five packages. |
| Work on branch claude/issue-9-mcp-dependencies | Another session has uncommitted files on main in the same checkout. They are never staged. The full gate runs on a clean committed candidate. |

## Ordered work

| Task | Deliverable | Blocked by |
|---|---|---|
| 1 | MCP runtime dependencies: ranges, fixed lockfile, install test, decision record | none |
| 2 | Development dependencies: `happy-dom` 21.0.4, refreshed `undici` entry, follow-up issue | none |
| 3 | Coordinated version 0.3.3 across five packages and their projections | 1, 2 |
| 4 | Release record, complete gate on a clean candidate, independent review | 3 |
| 5 | Publication: PR, merge, tag, npm, GitHub release, Pages, issue #9 closure | 4 and Peter's outward-action approval |

Tasks 1 and 2 are independent. Task 3 is one mechanical change: the release policy rejects mixed versions, so it cannot land in smaller green parts.

### Checkpoints

1. After tasks 1 and 2: the audit reports no unresolved high or critical finding. The unit suite, static checks and types pass. The build shows no generated drift.
2. After task 4: the complete gate passes on the clean candidate, and review findings are resolved. Then ask Peter once for the outward actions in task 5.

## Verification

Run every command with Bun 1.4.2 and the [verification guide](../docs/agents/verification.md). Focused checks run per task:

~~~sh
bun scripts/dependency-audit.ts
bun test packages/mcp/src/__tests__
bun test scripts/__tests__/workspace-install.test.ts
bun test
bun scripts/check.ts static
bun scripts/check.ts types
bun run split
bun run build
bun run docs
bun run build:tooling
bun run release:prepare
bun run release:validate
git diff --check
~~~

Task 4 runs `bun run check` on the clean committed candidate. If a local run cannot complete, the complete CI quality run on the PR head is the closure evidence, and the record states both outcomes.

## Risks

| Risk | Impact | Mitigation |
|---|---|---|
| `happy-dom` 21 turns off CSS file and iframe page loading by default | Unit fixtures or generated output can change | Task 2 runs the full unit suite and the build drift check. `scripts/docs-icons.ts` and `scripts/manifest.ts` already turn both off; their deprecated `disableCSSFileLoading` setting is checked for warnings. |
| A newer transitive version changes MCP behaviour | Server or protocol failure | MCP protocol, stdio and catalog tests; packed-consumer checks in the complete gate. |
| A local complete gate does not finish uninterrupted | Missing local closure evidence | The 0.3.2 and migration precedent: the complete CI run on the reviewed head closes the task. |
| npm holds a new version in automated review | Publication waits | Bounded monitoring, as in the [0.3.2 release](../docs/releases/0.3.2.md). |

## Authorization

Approval of this plan authorizes local implementation and verified local commits on the work branch. It grants no push, PR, merge, tag, release or publication. Task 5 needs Peter's separate approval, asked once at checkpoint 2.
