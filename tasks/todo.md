# Tasks: MCP dependency advisory

Status: approved by Peter on 2026-10-27 through the task-size, dependency-order and task-boundary questions. Current execution state belongs in [STATUS](../docs/STATUS.md). The [plan](plan.md) owns decisions, risks and authorization.

## Checklist

- [x] 1. MCP runtime dependencies
- [ ] 2. Development dependencies
- [ ] Checkpoint 1: audit, units, static checks, types and build are green
- [ ] 3. Coordinated version 0.3.3
- [ ] 4. Release record, complete gate and review
- [ ] Checkpoint 2: ready for publication; Peter's outward-action approval
- [ ] 5. Publication and issue #9 closure

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
- [ ] The audit reports no unresolved high or critical finding, and the two existing dispositions still verify.
- [ ] The full unit suite passes, and the build shows no generated drift.
- [ ] The follow-up issue states the evidence: the locked and the installed `node-gyp` and `undici` versions.

**Verification:** `bun scripts/dependency-audit.ts`; `bun test`; `bun run split`; `bun run build`; static checks and types.

**Dependencies:** None.

**Files likely touched:** package.json; bun.lock; .scratch/maintenance/issues/006-bun-bundled-dependency-lock.md; .scratch/maintenance/issues/README.md.

**Scope:** Small; four files.

## Checkpoint 1

- [ ] The audit has zero unresolved high or critical findings.
- [ ] `bun test`, static checks and types pass.
- [ ] The build shows no generated drift.

## Task 3: Coordinated version 0.3.3

**Description:** Advance all five packages, their core peer versions, README examples and the version table, the seven consumer-skill records and the lockfile workspace versions to 0.3.3. Regenerate the projections through their producers.

**Acceptance criteria:**
- [ ] No live authored file outside history and evidence names 0.3.2 as the current version.
- [ ] Generated projections come from their producers, and the build shows no drift.
- [ ] `release:prepare` and `release:validate` accept five 0.3.3 archives.

**Verification:** `bun run split`; `bun run build`; `bun run docs`; `bun run build:tooling`; `bun run release:prepare`; `bun run release:validate`; a search for stale version strings.

**Dependencies:** 1, 2.

**Files likely touched:** five package manifests; README.md; packages/browser/README.md; seven skills/*/SKILL.md files; bun.lock; regenerated outputs.

**Scope:** One mechanical coordinated change. The release policy rejects mixed versions, so it cannot land in smaller green parts.

## Task 4: Release record, complete gate and review

**Description:** Write the 0.3.3 release record. Run the complete gate on the clean committed candidate. Obtain an independent five-axis review and resolve its findings.

**Acceptance criteria:**
- [ ] The complete gate passes on the clean candidate, or the record states the local outcome and the complete CI run on the same head.
- [ ] Review findings are resolved or returned to Peter.
- [ ] STATUS names the exact next action and the pending approval.

**Verification:** `bun run check`; `git diff --check`; review report.

**Dependencies:** 3.

**Files likely touched:** docs/releases/0.3.3.md; docs/STATUS.md; tasks/todo.md.

**Scope:** Small; three authored files plus evidence.

## Checkpoint 2

- [ ] Every acceptance check of tasks 1–4 has evidence.
- [ ] Peter approves the outward actions of task 5.

## Task 5: Publication and issue #9 closure

**Description:** Push the branch, open the PR and pass its checks. Merge with a merge commit. Tag v0.3.3 and pass the publish workflow. Verify the five public npm versions, their provenance and latest tags. Publish the GitHub release, verify Pages, and close issue #9 with the evidence.

**Acceptance criteria:**
- [ ] `npm view @acmelabs/design-system-mcp@0.3.3 dependencies` shows `zod ^4.6.7`. A fresh consumer install resolves `zod` 4.6.6 or later.
- [ ] All five 0.3.3 versions are public with verified provenance.
- [ ] Issue #9 is closed with a link to the release and its evidence.

**Verification:** CI run results; public registry checks; the issue state.

**Dependencies:** 4 and Peter's outward-action approval.

**Files likely touched:** docs/releases/0.3.3.md; docs/STATUS.md; tasks/todo.md; publication evidence under docs/verification/releases/0.3.3/.

**Scope:** Outward actions plus three record files.
