# Architecture review: issue #9 (main..HEAD f9dc599c8)

Verdict on this axis: no blocking findings. The change reuses existing patterns and adds no new abstraction.

## Findings

### 1. Optional / judgement: install test couples to `^4.6.7` through a range string
`scripts/__tests__/workspace-install.test.ts:47`
```
for (const version of ["3.25.76", mcp.dependencies.zod]) {
  if (mcp.dependencies.zod === version) { continue; }
```
The array is built once before the loop mutates `mcp`, so the second entry is the original `^4.6.7` and the restore works. The coupling to a literal is gone, which is the stated goal. But the test now installs a range, not a version, and the read-then-mutate order is easy to misread. A named `const original = mcp.dependencies.zod;` before the loop shows the intent. Smell: Mysterious Name (implicit capture). No behavior change needed.

### 2. FYI / judgement: new dependency policy split, correctly recorded
`packages/mcp/package.json` now declares carets while the root dev tools stay exact (`happy-dom` 21.0.4). Decision 0116 states the reason: consumers get fixes without a release, while core already uses carets for most runtime deps. `docs/development/stack.md:52` names the MCP dependencies without a version policy, so it needs no edit. The split follows the published/dev boundary, so it is a justified rule and not drift. No finding.

### 3. FYI / judgement: lockfile refresh of `npm/undici` papers over a Bun defect
`bun.lock` `npm/undici` 8.11.2 to 8.12.3 clears the audit without changing installed bytes (installed 6.27.0). This works around the audit reading recorded resolutions. The change names the underlying defect in `.scratch/maintenance/issues/006-bun-bundled-dependency-lock.md` and states that the refresh alone does not close it. That satisfies the "name the defect" rule in `/Users/peterkloss/CLAUDE.md` section 1. Issue 006 is `needs-triage` and has no owner or date, unlike 004 (review before 2026-11-20). Consider a date, since the next `npm` bump can reintroduce the finding. Smell: none.

### 4. Nit / judgement: transient plan/status duplication
`tasks/plan.md`, `tasks/todo.md` and `docs/STATUS.md` each repeat the four-finding baseline and the approval text. `docs/agents/workflow.md` assigns state to STATUS and decisions to the plan. Duplication is small and reads as intentional cross-reference. Possible Duplicated Code, not worth action.

## Checked and clean
- Version bump touches all five manifests, `bun.lock` workspace entries, peer ranges, README tables and the seven `skills/*/SKILL.md` `library_version` fields. Release policy requires a coordinated version, so this is one mechanical change, not Shotgun Surgery.
- Archive move of the old plan/tasks keeps the single-active-plan convention. Link rewrites in `0057`, `20-systematic-approach.md`, `SPEC-maintainer-workflow.md` and `spec/README.md` are consistent.
- No new module, helper or config. Dependency direction unchanged (mcp peers on core).
- `happy-dom` plus its registrator stay paired at the same exact version, matching the root convention.

## Done well
- Decision 0116 records alternatives, accepted cost and evidence, and indexes it in `docs/decisions/README.md`.
- The fix lands at the cause (the exact pin) and not as an audit disposition.
