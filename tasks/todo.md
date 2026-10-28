# Tasks: MCP dependency advisory

Status: completed 2026-10-27. Approved by Peter on 2026-10-27 through the task-size, dependency-order and task-boundary questions. Current execution state belongs in [STATUS](../docs/STATUS.md). The [plan](plan.md) owns decisions, risks and authorization.

## Checklist

- [x] 1. MCP runtime dependencies
- [x] 2. Development dependencies
- [x] Checkpoint 1: audit, units, static checks, types and build are green
- [x] 3. Coordinated version 0.3.3
- [x] 4. Release record, complete gate and review
- [x] Checkpoint 2: ready for publication; Peter's outward-action approval
- [x] 5. Publication and issue #9 closure

## Task 1: MCP runtime dependencies

**Description:** Declare `zod ^4.6.7` and `@modelcontextprotocol/sdk ^1.32.0` in the MCP manifest. Lock `zod` 4.6.7 and `body-parser` 2.4.0. Refresh moderate MCP runtime findings where a fix exists inside the declared range. Make the install test restore the manifest's own `zod` value. Record the dependency-range decision.

**Acceptance criteria:**
- [x] `bun why zod` and `bun why body-parser` show only 4.6.7 and 2.4.0. The SDK stays at 1.32.0.
- [x] The audit no longer reports `zod` or `body-parser`.
- [x] MCP protocol, stdio and catalog tests and the workspace install test pass.

**Verification:** `bun test packages/mcp/src/__tests__`; `bun test scripts/__tests__/workspace-install.test.ts`; `bun scripts/dependency-audit.ts`; static checks and types on the changed files.

**Dependencies:** None.

**Files likely touched:** packages/mcp/package.json; bun.lock; scripts/__tests__/workspace-install.test.ts; docs/decisions/0116-mcp-dependency-ranges.md; docs/decisions/README.md.

**Scope:** Medium; five files.

**Result, 2026-10-27, Bun 1.4.2, on c603a41c7 plus this change:** `bun install` locks `zod` 4.6.7; its integrity matches the registry and it carries SLSA provenance from the upstream release workflow. `bun update body-parser fast-uri ip-address qs` changes only bun.lock: 2.4.0, 3.1.9, 10.7.5 and 6.17.0. The SDK stays at 1.32.0. The audit no longer reports these five packages; `happy-dom` and `undici` remain for task 2. `bun test packages/mcp/src/__tests__ scripts/__tests__/workspace-install.test.ts`: 9 pass, 96 assertions. `bun scripts/check.ts static`: 0 diagnostics. `bun scripts/check.ts types`: exit 0. The working tree also holds another session's uncommitted files, so these two checks cover them too.

## Task 2: Development dependencies

**Description:** Pin `happy-dom` and `@happy-dom/global-registrator` at 21.0.4. Refresh the `npm/undici` lockfile entry to a fixed 8.x version. Record Bun's recorded resolution for bundled dependencies as a local follow-up issue.

**Acceptance criteria:**
- [x] The audit reports no unresolved high or critical finding, and the two existing dispositions still verify.
- [x] The full unit suite passes, and the build shows no generated drift.
- [x] The follow-up issue states the evidence: the locked and the installed `node-gyp` and `undici` versions.

**Verification:** `bun scripts/dependency-audit.ts`; `bun test`; `bun run split`; `bun run build`; static checks and types.

**Dependencies:** None.

**Files likely touched:** package.json; bun.lock; .scratch/maintenance/issues/006-bun-bundled-dependency-lock.md; .scratch/maintenance/issues/README.md.

**Scope:** Small; four files.

**Result, 2026-10-27, Bun 1.4.2, on c588f2db0 plus this change:** `bun install` locks `happy-dom` and `@happy-dom/global-registrator` 21.0.4. bun.lock records `npm/undici` 8.12.3; the installed bundled copy stays 6.27.0, which confirms [issue 006](../.scratch/maintenance/issues/006-bun-bundled-dependency-lock.md). `bun scripts/dependency-audit.ts`: exit 0, no unresolved high or critical finding, no lower finding. The native report lists only `http-cache-semantics`, so a direct `verifyAuditProof` run checks both reviewed dispositions: `braces` and `http-cache-semantics` verify. `bun test` under a pseudo-terminal: 1,126 pass, 0 fail, 191,007 assertions, 218 files, 132.64 s. `bun scripts/check.ts build`: exit 0, no generated drift, no deprecation warning, 4,319 manifest elements as in the 0.3.2 build. `scripts/docs-icons.ts` and `scripts/manifest.ts` still pass the deprecated `disableCSSFileLoading` and `disableIframePageLoading` settings; `happy-dom` 21 accepts them and its new defaults match them.

## Checkpoint 1

- [x] The audit has zero unresolved high or critical findings.
- [x] `bun test`, static checks and types pass. Static checks and types rerun after task 2: both exit 0, with 0 diagnostics in 885 files.
- [x] The build shows no generated drift.

## Task 3: Coordinated version 0.3.3

**Description:** Advance all five packages, their core peer versions, README examples and the version table, the seven consumer-skill records and the lockfile workspace versions to 0.3.3. Regenerate the projections through their producers.

**Acceptance criteria:**
- [x] No live authored file outside history and evidence names 0.3.2 as the current version.
- [x] Generated projections come from their producers, and the build shows no drift.
- [x] `release:prepare` and `release:validate` accept five 0.3.3 archives.

**Verification:** `bun run split`; `bun run build`; `bun run docs`; `bun run build:tooling`; `bun run release:prepare`; `bun run release:validate`; a search for stale version strings.

**Dependencies:** 1, 2.

**Files likely touched:** five package manifests; README.md; packages/browser/README.md; seven skills/*/SKILL.md files; bun.lock; regenerated outputs.

**Scope:** One mechanical coordinated change. The release policy rejects mixed versions, so it cannot land in smaller green parts.

**Result, 2026-10-27, Bun 1.4.2, commit f9dc599c8:** 16 version strings move to 0.3.3. `bun install` updates the five workspace versions but leaves the three core peer entries in bun.lock at 0.3.2, and a frozen install accepts that mismatch. `bun install --force --lockfile-only` refreshes exactly those three lines; a scratch-copy probe showed the same six-line change first. The build stage before the commit fails only because `packages/core/package.json` is uncommitted; the build changes nothing else in it. The complete gate in task 4 then passes its build stage with no drift and its packages stage with five 0.3.3 archives that name commit f9dc599c8. The packages stage runs the same prepare and validate steps as `release:prepare` and `release:validate`.

## Task 4: Release record, complete gate and review

**Description:** Write the 0.3.3 release record. Run the complete gate on the clean committed candidate. Obtain an independent five-axis review and resolve its findings.

**Acceptance criteria:**
- [x] The complete gate passes on the clean candidate, or the record states the local outcome and the complete CI run on the same head.
- [x] Review findings are resolved or returned to Peter.
- [x] STATUS names the exact next action and the pending approval.

**Verification:** `bun run check`; `git diff --check`; review report.

**Dependencies:** 3.

**Files likely touched:** docs/releases/0.3.3.md; docs/STATUS.md; tasks/todo.md.

**Scope:** Small; three authored files plus evidence.

**Result, 2026-10-27:** `bun run check` exits 0 on a clean detached checkout of f9dc599c8: static, build, types, 1,126 unit tests, audit, packages, browser installation, 24 of 24 browser invocations and release checks. The five-axis review approves; 1394fc019 and ea74d45c8 apply its findings, with their own focused checks. [Release record](../docs/releases/0.3.3.md), [review](../docs/verification/releases/0.3.3/review/README.md).

## Checkpoint 2

- [x] Every acceptance check of tasks 1–4 has evidence.
- [x] Peter approves the outward actions of task 5: on 2026-10-27 he selects "Approve, hold Pages", the 0.3.2 order with Pages held until npm verifies.

## Task 5: Publication and issue #9 closure

**Description:** Push the branch, open the PR and pass its checks. Merge with a merge commit. Tag v0.3.3 and pass the publish workflow. Verify the five public npm versions, their provenance and latest tags. Publish the GitHub release, verify Pages, and close issue #9 with the evidence.

**Acceptance criteria:**
- [x] `npm view @acmelabs/design-system-mcp@0.3.3 dependencies` shows `zod ^4.6.7`. A fresh consumer install resolves `zod` 4.6.6 or later.
- [x] All five 0.3.3 versions are public with verified provenance.
- [x] Issue #9 is closed with a link to the release and its evidence.

**Verification:** CI run results; public registry checks; the issue state.

**Dependencies:** 4 and Peter's outward-action approval.

**Files likely touched:** docs/releases/0.3.3.md; docs/STATUS.md; tasks/todo.md; publication evidence under docs/verification/releases/0.3.3/.

**Scope:** Outward actions plus three record files.

**Result, 2026-10-27:** PR #10 merges as 998d72c8c after its Linux quality run passes. Tag v0.3.3 publishes all five packages through four attempts of the publish job, because the script's confirmation wait is shorter than npm's review ([issue 007](../.scratch/maintenance/issues/007-publication-confirmation-wait.md)). The public tarballs equal the verified archives, their provenance verifies, and `latest` is 0.3.3. A fresh install of the public MCP package resolves `zod` 4.6.7, and `bun audit` finds nothing. Pages redeploys after npm verification and passes in three engines. The GitHub release is published, its duplicate publish run is cancelled, and issue #9 is closed. [Release record](../docs/releases/0.3.3.md#publication).
