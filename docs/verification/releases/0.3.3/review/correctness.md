# Correctness review: issue #9 (main...HEAD f9dc599c8)

Verdict: no Critical or Required findings. The change meets issue #9 and the approved plan for tasks 1 to 3.

## Spec check

| Requirement (spec line) | Result |
|---|---|
| Issue #9: "Release ... with `zod` 4.6.6 or later" | `packages/mcp/package.json` declares `"zod": "^4.6.7"`; bun.lock resolves `zod@4.6.7`. Met (publication is task 5). |
| Plan: `@modelcontextprotocol/sdk ^1.32.0` | Declared; lock stays 1.32.0. Met. |
| Plan: four blocking findings fixed by upgrade | `body-parser` 2.4.0, `happy-dom` and registrator 21.0.4 (package.json and bun.lock agree), `npm/undici` 8.12.3. Met. |
| Plan: coordinated 0.3.3 | Five manifests, core peers (devtools, mcp, react), README table and CDN URLs, seven skills, lock workspace entries all move. `git grep 0.3.2` outside docs/tasks/bun.lock finds only historical release links and `workflow-migration.test.ts` fixture text. Met. |
| Plan: install test restores the manifest's own `zod` value | `[ "3.25.76", mcp.dependencies.zod ]` is evaluated before the loop, so the second pass restores `^4.6.7`. Logic is right. Met. |

## Findings

### FYI / judgement: stale handoff text (docs/STATUS.md)
`Start task 1, MCP runtime dependencies. Tasks 1 and 2 are independent` and the "Red checks: ... four unresolved high findings" paragraph are false at HEAD: todo.md marks tasks 1 and 2 and checkpoint 1 done, and the audit is green. Task 4 rewrites STATUS, so this is not a defect now. It must change before checkpoint 2. Same for `Version 0.3.2 is the latest release` (STATUS) and `Version 0.3.2 is released` (spec/README.md:9): they stay correct until the 0.3.3 record exists.

### Optional / judgement: unplanned link edits (scope creep, minor)
`spec/SPEC-maintainer-workflow.md`, `docs/decisions/0057-...md` and `docs/research/20-systematic-approach.md` change links to `tasks/done/maintainer-workflow/`. The plan's "Files likely touched" lists none of them. They are a required consequence of archiving the old plan (links would break), so keep them. Name them in the task 4 record.

### Optional / judgement: test does not prove the range
`workspace-install.test.ts` proves install stability, not that the manifest keeps a caret range. No test pins decision 0116's contract (`zod` caret, `^4.6.6` or later floor). The plan's task 5 `npm view` check covers it at publication; consider a manifest assertion if a guard is wanted.

### Nit: lock refreshes beyond the four findings
`fast-uri`, `ip-address`, `qs` bumps are plan-sanctioned ("refresh with the same lockfile operation"). No action.

## Edge cases
- `^4.6.7` floor excludes vulnerable 4.6.5 and below: correct.
- Bundled `npm/undici` lock-versus-installed mismatch is recorded honestly in issue 006; no disposition added, as planned.

## Not reviewed
Tasks 4 and 5 (release record, gate, publication) are not yet done and are not defects. I did not run builds or tests.
