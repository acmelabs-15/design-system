# Tasks: maintainer workflow migration

Status: approved by Peter for local implementation on 2026-10-21. Tasks 1–6 and Checkpoint A are complete. Current work reconciles specifications/history and relocates live verification checks (tasks7–8). The old startup owner remains active until task11. Full migration acceptance and independent review remain task12.

The current handoff is still [the existing pass entry point](../notes/alignment/README.md#where-we-are). Task 11 changes that owner.

## Checklist

- [x] 1. Make browser-check behavior independent of filenames — [evidence](../docs/verification/workflow-migration/task-01.json).
- [x] 2. Complete the migration ledger and rule audit — [evidence](../docs/verification/workflow-migration/task-02.json).
- [x] 3. Prove the migration guards — [evidence and review](../docs/verification/workflow-migration/task-03.json).
- [x] Checkpoint A: safe preparation
- [x] 4. Migrate raw evidence batches — [690 byte-identical copies](../docs/verification/workflow-migration/task-04.json).
- [x] 5. Convert decision-record batches — [115 records and review](../docs/verification/workflow-migration/task-05.json).
- [x] 6. Convert research batches — [20 records and review](../docs/verification/workflow-migration/task-06.json).
- [ ] 7. Reconcile specifications, design records and completed history
- [ ] 8. Migrate live verification batches
- [ ] Checkpoint B: records and live checks
- [ ] 9. Prepare the shared workflow guidance
- [ ] 10. Update live reference consumers
- [ ] Checkpoint C: ready for cutover
- [ ] 11. Activate the new workflow and remove the old structure
- [ ] 12. Verify fresh sessions and the full migration
- [ ] Checkpoint D: local migration acceptance

Tasks 4–8 are batch groups. Before starting one, add each exact child batch below its task. Every child has a source-file list, dependencies, acceptance checks and result-file path. Its completion is separate from the group checkbox.

## Task 1: Make browser-check behavior independent of filenames

**Description:** Replace filename-based special behavior in the existing runner with explicit stable check identities. Keep the current paths until their owning move. This is the code prefactor that makes subsequent renaming safe.

**Acceptance criteria:**
- [x] All 23 entries still produce the same 24 ordered invocations, archive arguments, environment values and output destinations.
- [x] A regression proves that changing an entry's file path does not lose scoped module/CDN coverage, audit result routing or worker-consumer arguments.
- [x] Failure aggregation, complete-result recording and clearing of diagnostic filters remain unchanged.

**Verification:** Run the focused check-runner tests, strict script types and static checks. Preserve the before/after invocation comparison.

**Dependencies:** None.

**Files likely touched:** scripts/check.ts; scripts/__tests__/check.test.ts; scripts/__tests__/release-workflows.test.ts. The latter consumes the same browser-entry list and must follow its explicit identity/file shape.

**Scope:** Small; three authored files. The third is a discovered direct consumer, not additional behavior.

## Task 2: Complete the migration ledger and rule audit

**Description:** Refresh the tracked inventory, classify every file/section, allocate new names, and find its live consumers. Audit old rules against the new workflow before carrying anything forward.

**Acceptance criteria:**
- [x] Every current source in scope, including migration-era additions, has an owner, destination or justified retirement, source revision/hash and validation method.
- [x] Every old instruction has retain/rewrite/retire/resolve status, supporting evidence and one new owner; no unresolved conflict is silently retained.
- [x] Live drivers, helper imports, data fixtures and public references are distinguished from immutable historical evidence. Known failures and manual follow-ups have explicit destinations.

**Verification:** Compare the ledger's source set to Git; inspect all rule sources and dynamic reference cases; save the full reference graph and conflict matrix. Read each assigned record in full.

**Dependencies:** None.

**Files likely touched:** docs/verification/workflow-migration/ledger.json; docs/verification/workflow-migration/rules.md; docs/verification/workflow-migration/references.json.

**Scope:** Three output records; complete read-only source inventory.

## Task 3: Prove the migration guards

**Description:** Add a narrow Bun verifier for the ledger, evidence integrity and active references. It reports facts; it does not infer prose meaning or own task state.

**Acceptance criteria:**
- [x] Failing fixtures cover an omitted source, duplicate/escaping destination, changed immutable evidence, missing target and an active old-path reference.
- [x] Historical path strings in explicitly classified immutable payloads remain intact without masking active imports or links.
- [x] Preparation and final checks are distinct: an unfinished target can never pass final acceptance.

**Verification:** Write the failing cases first. Run the colocated tests and applicable type/static checks. Verify the complete current ledger without moving project files.

**Dependencies:** 2.

**Files likely touched:** scripts/workflow-migration.ts; scripts/__tests__/workflow-migration.test.ts; bounded test fixtures beside that test.

**Scope:** Two authored modules plus small fixtures.

## Checkpoint A: safe preparation

- [x] Tasks 1–3 pass their own checks.
- [x] The complete source set and rule dispositions are reviewable.
- [x] Every batch has a defined completion condition; unresolved product meaning remains explicit.
- [x] The known Chromium Hover Card failure is captured without a guessed cause or weakened assertion.

## Shared record-batch contract

Each child batch of tasks 4–7 inherits the following contract, with its exact files and result path recorded before edits.

**Acceptance criteria:**
- [ ] Every retained fact, decision, qualification and source has a trace to its original record.
- [ ] The new format distinguishes current requirements, proposals, supersession, limits and historical observations.
- [ ] Links resolve to prepared/new targets or remain explicitly pending inside the ledger; no pending reference passes final verification.

**Verification:** Full source-to-target review, the migration guard, and a batch report. Raw evidence additionally requires byte-identical hashes. The coordinator updates shared indexes and task state.

Semantic batches contain no more than four authored records; long research notes use one or two. Raw moves are separate commits from semantic rewrites.

## Task 4: Migrate raw evidence batches

**Description:** Put saved results, screenshots, signatures and historical artifacts under docs/verification. Group moves by their existing release or milestone identity. Exclude anything classified as live input or executable code.

**Additional acceptance:** Every moved raw file matches its original hash. Source identities and capture dates remain available. No migration script rewrites signed or measured payloads.

**Dependencies:** 2, 3.

**Files:** Exact ledger rows for one release/milestone per child batch.

**Scope:** Mechanical batches can contain many unchanged files; every byte is checked. Add the fixed child batch list here before starting.

## Task 5: Convert decision-record batches

**Description:** Convert all decisions into numbered brain-format records. Preserve their actual dates, authors, reasons and supersession relationships. Retired process rules do not become current constraints.

**Additional acceptance:** No approval, alternative or consequence is invented to fill a template. The decision index maps current topics and superseded records.

**Dependencies:** 2, 3.

**Files:** Up to four decision records per child batch; coordinator-owned decision index and ledger entries.

**Scope:** Small semantic batches. Add the fixed child batch list here before starting.

## Task 6: Convert research batches

**Description:** Convert each analysis into a numbered research note and index entry. Separate observed facts, conclusions, selected choices, proposals, uncertainty and dated history.

**Additional acceptance:** A historical “not started” or “unselected” statement cannot be presented as current when later evidence resolves it. No relevant detail is removed merely to shorten the note.

**Dependencies:** 2, 3.

**Files:** One or two long notes, or up to four short notes, per child batch; coordinator-owned research index and ledger entries.

**Scope:** Small semantic batches. Add the fixed child batch list here before starting.

## Task 7: Reconcile specifications, design records and completed history

**Description:** Move current contracts to spec/, intent/interviews to docs/design, completed plans to tasks/done, releases to docs/releases, and completed prose history to docs/history. Move valid current conventions into development guidance.

**Additional acceptance:** Current contracts trace to approvals and later resolutions. A discrepancy between approved intent and code becomes an issue, not an invented resolution. Real open work is not buried in completed tasks.

**Dependencies:** 4, 5, 6.

**Files:** One family or up to four related records per child batch; specification/index and shared state updates by the coordinator.

**Scope:** Small semantic batches. Preserve the two existing glossaries and update their references. Add the fixed child batch list here before starting.

## Shared live-check batch contract

Each child batch of task 8 moves one driver and its dependency closure. Shared helpers get an owner first. Combine at most three short drivers only when they form one fixture unit.

**Acceptance criteria:**
- [ ] The driver, helpers and all active fixtures work from the new paths; shared dependencies are not copied into competing implementations.
- [ ] Assertions, browser coverage, time limits, failure reporting and lifecycle checks retain their strength.
- [ ] The runner selects the same check identity and arguments; moved code passes the authored-source checks that now apply.

**Verification:** Run the moved scenario against the same prepared package set, the check-runner tests, relevant static/types checks, and the migration guard. Record old/new entry and result identities. No broad lint/type exclusions.

## Task 8: Migrate live verification batches

**Description:** Move the nineteen known old-tree browser entry points, their dependency closure, shared browser-distribution helper/test, live component-case inputs and discovered release/security proof helpers to scripts/verification.

**Dependencies:** 1, 2, 3. Add a dependency on a task-4 evidence batch only when the driver consumes it. Add actual helper dependencies between child batches after the reference census; file proximity does not establish independence.

**Known batch areas:** shared helper; React; docs pages/navigation/icons; docs recipes/accessibility/copied/video; consumer tooling; native history; API/removal audits; scoped registration; Flow; bundle/worker consumers; component-case inputs; security proof helper.

**Files:** The exact driver/fixture rows in the ledger; scripts/check.ts and its tests only where the entry mapping changes; other direct consumers such as scripts/component-browser-checks.ts and scripts/__tests__/dependency-audit.test.ts.

**Scope:** One verified fixture unit per child task. Add the fixed child batch list here before starting. Split code preparation, formatting and path changes when that improves review without breaking the unit.

## Checkpoint B: records and live checks

- [ ] Every batch under tasks 4–8 has its result record.
- [ ] Immutable evidence hashes match; semantic conversion is reviewed separately.
- [ ] All 24 browser invocations remain represented, including both scoped modes.
- [ ] No old process instruction has been promoted into the new rules by copying.

## Task 9: Prepare the shared workflow guidance

**Description:** Prepare the compatible domain, repository, verification and tracker guidance. Make responsibility clear for root source, generated files, the five packages and consumer skills. Prepare the actual current handoff and issue records.

**Acceptance criteria:**
- [ ] The guidance uses brain for shared skill names, the two existing contexts and local Markdown issues.
- [ ] Each fact and rule has one owner. No legacy blanket override, global-settings change or copied permission grant is introduced.
- [ ] Startup and task-end behavior covers root/package starts, incomplete work, a new request, a red baseline and no approved next task.

**Verification:** Review against both reference projects and the rule matrix. Apply the approved target formats using the documented setup conventions; keep the setup-brain command user-started. Approved choices are not asked again. Use official skill-creator guidance for the upcoming AGENTS/skill-file changes.

**Dependencies:** 2, 5, 6, 7.

**Files:** docs/agents/domain.md; repository.md; verification.md; issue-tracker.md; triage-labels.md; docs/STATUS.md and .scratch issue records.

**Scope:** Split into adapter/guidance and current-handoff batches of at most five authored files. The prepared handoff is not authoritative before task 11.

## Task 10: Update live reference consumers

**Description:** Update all live links, source references, runner paths and generated projections after targets exist. Prepare any externally published reference corrections for review.

**Acceptance criteria:**
- [ ] The site, recipe metadata, README navigation, glossaries and active tooling resolve the new paths and anchors.
- [ ] Generated output comes from its producer. The consumer README remains coherent when packaged; maintainer-only files do not enter package allowlists.
- [ ] Mutable external references have concrete proposed updates; immutable artifacts remain unchanged and unresolved external conflicts block target deletion.

**Verification:** Run link/anchor and active-reference checks, affected site/package tests, normal producers and the relevant static/types checks. Inspect generated reference changes.

**Dependencies:** 4, 5, 6, 7, 8.

**Files:** site/recipes.ts; README.md; CONTEXT-MAP.md and glossary references; remaining direct consumers found by the ledger.

**Scope:** At most five authored consumers per batch; regenerated outputs accompany their owner. External writes wait for authorization.

## Checkpoint C: ready for cutover

- [ ] New targets and their current status are complete.
- [ ] Active consumers use them; old raw paths appear only as classified historical data.
- [ ] Every rule conflict is retired, rewritten or explicitly unresolved. Unresolved conflicts cannot enter the new active instructions.
- [ ] Deleting notes/, PLAN.md and .agents/skills will not break an active reference or lose unassigned information.

## Task 11: Activate the new workflow and remove the old structure

**Description:** Perform one coordinated cutover. Replace AGENTS.md, replace the CLAUDE symlink with the import file, enable the two project plugins and make docs/STATUS.md authoritative. Remove the old tree, root PLAN.md and all five local skills.

**Acceptance criteria:**
- [ ] Claude and Codex reach the same current state and shared rules; no stale local skill wins name resolution.
- [ ] The old structure is absent, with no forwarding copies or compatibility symlinks.
- [ ] Existing launch settings, global configuration, product source and published consumer skills are preserved.

**Verification:** Review the prepared root files before writing. Check actual file types/imports, plugin configuration, current-state ownership, the complete ledger and removal/reference guards. Commit the coupled cutover as one reviewed unit.

**Dependencies:** 3, 9, 10.

**Files:** AGENTS.md; CLAUDE.md; .claude/settings.json; docs/STATUS.md; necessary .gitignore changes; removal of the fully accounted legacy tree.

**Scope:** A small authored entry-point change plus the mechanically verified removal set. It is an atomic wide-refactor checkpoint, not an independent edit per deleted file.

## Task 12: Verify fresh sessions and the full migration

**Description:** Run the complete repository gate, inspect the built website and package boundaries, and test the new workflow in fresh Claude and Codex sessions. Obtain independent review before declaring acceptance.

**Acceptance criteria:**
- [ ] The full gate passes with all required browser/consumer checks; no skipped assertion or hidden failure supplies a green result.
- [ ] Fresh root and package sessions handle continuation, interruption, new scope, a pending approval and a red baseline correctly. Host startup is tested, not inferred from Markdown.
- [ ] The ledger has complete coverage, raw evidence integrity holds, no old active path survives, and review findings are resolved or explicitly returned to Peter.

**Verification:** Run bun run check on the exact clean candidate; save its revision and results. Record separate host transcripts/results. Re-run only checks invalidated by a later correction.

**Dependencies:** 11.

**Files:** docs/verification/workflow-migration/ acceptance/review records; docs/STATUS.md; tasks/todo.md.

**Scope:** Verification and corrections owned by their original task. If the pre-existing Hover Card failure blocks the gate, investigate and record a separate prerequisite fix.

## Checkpoint D: local migration acceptance

- [ ] All approved specification success criteria have evidence.
- [ ] Working-tree/commit state and the exact next action are recorded.
- [ ] Shipping and external-reference updates are concrete and ready for the required outward-action approval.
- [ ] Actual-platform limits and credential-rotation status remain honest.

## Plan review

- [x] Task size accepted by Peter on 2026-10-21 through “approved.”
- [x] Dependency order accepted by Peter on 2026-10-21 through “approved.”
- [x] Task boundaries accepted by Peter on 2026-10-21 through “approved.” The implementation plan is fully approved.

These are the plan-review decisions. Specification approval is already settled.

## Exact child batches for tasks 4–8

The [batch index](../docs/verification/workflow-migration/batches.json) owns exact source/destination lists, dependencies, acceptance checks, verification and result paths. The ledger maps each source to one batch. The checkboxes below own completion state. A completed batch does not close its parent group until every child is verified.

- [x] 04-evidence-m00 — 2 source files; depends on task-02, task-03.
- [x] 04-evidence-m01 — 1 source file; depends on task-02, task-03.
- [x] 04-evidence-m02 — 1 source file; depends on task-02, task-03.
- [x] 04-evidence-m03 — 2 source files; depends on task-02, task-03.
- [x] 04-evidence-m04 — 1 source file; depends on task-02, task-03.
- [x] 04-evidence-m05 — 18 source files; depends on task-02, task-03.
- [x] 04-evidence-m06 — 1 source file; depends on task-02, task-03.
- [x] 04-evidence-m07 — 6 source files; depends on task-02, task-03.
- [x] 04-evidence-m08 — 2 source files; depends on task-02, task-03.
- [x] 04-evidence-m09 — 7 source files; depends on task-02, task-03.
- [x] 04-evidence-m10 — 10 source files; depends on task-02, task-03.
- [x] 04-evidence-m11 — 5 source files; depends on task-02, task-03.
- [x] 04-evidence-m12 — 3 source files; depends on task-02, task-03.
- [x] 04-evidence-m13 — 14 source files; depends on task-02, task-03.
- [x] 04-evidence-m14 — 8 source files; depends on task-02, task-03.
- [x] 04-evidence-m15 — 10 source files; depends on task-02, task-03.
- [x] 04-evidence-m16 — 3 source files; depends on task-02, task-03.
- [x] 04-evidence-m17 — 3 source files; depends on task-02, task-03.
- [x] 04-evidence-m18 — 6 source files; depends on task-02, task-03.
- [x] 04-evidence-m19 — 1 source file; depends on task-02, task-03.
- [x] 04-evidence-m20 — 2 source files; depends on task-02, task-03.
- [x] 04-evidence-m20-flow — 13 source files; depends on task-02, task-03.
- [x] 04-evidence-m21 — 11 source files; depends on task-02, task-03.
- [x] 04-evidence-m21-video — 16 source files; depends on task-02, task-03.
- [x] 04-evidence-m22 — 1 source file; depends on task-02, task-03.
- [x] 04-evidence-m22-react — 8 source files; depends on task-02, task-03.
- [x] 04-evidence-m23 — 1 source file; depends on task-02, task-03.
- [x] 04-evidence-m23-docs — 7 source files; depends on task-02, task-03.
- [x] 04-evidence-m24-consumers — 7 source files; depends on task-02, task-03.
- [x] 04-evidence-m24-devtools — 3 source files; depends on task-02, task-03.
- [x] 04-evidence-m24-skills — 160 source files; depends on task-02, task-03.
- [x] 04-evidence-m24-tabs-indicator — 2 source files; depends on task-02, task-03.
- [x] 04-evidence-m25-release — 11 source files; depends on task-02, task-03.
- [x] 04-evidence-m25-tooling — 6 source files; depends on task-02, task-03.
- [x] 04-evidence-m25-workspace — 4 source files; depends on task-02, task-03.
- [x] 04-evidence-m26-appearance — 79 source files; depends on task-02, task-03.
- [x] 04-evidence-m26-audit — 14 source files; depends on task-02, task-03.
- [x] 04-evidence-m26-bundle — 21 source files; depends on task-02, task-03.
- [x] 04-evidence-m26-final — 21 source files; depends on task-02, task-03.
- [x] 04-evidence-m26-managed-forms — 2 source files; depends on task-02, task-03.
- [x] 04-evidence-m26-native-forms — 1 source file; depends on task-02, task-03.
- [x] 04-evidence-m26-scoped — 8 source files; depends on task-02, task-03.
- [x] 04-evidence-release-0.3.0 — 12 source files; depends on task-02, task-03.
- [x] 04-evidence-release-0.3.1 — 28 source files; depends on task-02, task-03.
- [x] 04-evidence-release-0.3.2 — 69 source files; depends on task-02, task-03.
- [x] 04-evidence-research-2026-09-19 — 45 source files; depends on task-02, task-03.
- [x] 04-evidence-research-2026-09-20 — 21 source files; depends on task-02, task-03.
- [x] 04-evidence-research-2026-09-23 — 1 source file; depends on task-02, task-03.
- [x] 04-evidence-research-baseline — 11 source files; depends on task-02, task-03.
- [x] 04-original-request — 1 source file; depends on task-02, task-03.
- [x] 05-decisions-001 — 1 source file; depends on task-02, task-03.
- [x] 05-decisions-002 — 1 source file; depends on task-02, task-03.
- [x] 05-decisions-003 — 4 source files; depends on task-02, task-03.
- [x] 05-decisions-004 — 4 source files; depends on task-02, task-03.
- [x] 05-decisions-005 — 4 source files; depends on task-02, task-03.
- [x] 05-decisions-006 — 2 source files; depends on task-02, task-03.
- [x] 05-decisions-007 — 1 source file; depends on task-02, task-03.
- [x] 05-decisions-008 — 4 source files; depends on task-02, task-03.
- [x] 05-decisions-009 — 4 source files; depends on task-02, task-03.
- [x] 05-decisions-010 — 4 source files; depends on task-02, task-03.
- [x] 05-decisions-011 — 4 source files; depends on task-02, task-03.
- [x] 05-decisions-012 — 1 source file; depends on task-02, task-03.
- [x] 05-decisions-013 — 1 source file; depends on task-02, task-03.
- [x] 05-decisions-014 — 4 source files; depends on task-02, task-03.
- [x] 05-decisions-015 — 4 source files; depends on task-02, task-03.
- [x] 05-decisions-016 — 3 source files; depends on task-02, task-03.
- [x] 05-decisions-017 — 1 source file; depends on task-02, task-03.
- [x] 05-decisions-018 — 4 source files; depends on task-02, task-03.
- [x] 05-decisions-019 — 1 source file; depends on task-02, task-03.
- [x] 05-decisions-020 — 4 source files; depends on task-02, task-03.
- [x] 05-decisions-021 — 1 source file; depends on task-02, task-03.
- [x] 05-decisions-022 — 4 source files; depends on task-02, task-03.
- [x] 05-decisions-023 — 3 source files; depends on task-02, task-03.
- [x] 05-decisions-024 — 1 source file; depends on task-02, task-03.
- [x] 05-decisions-025 — 4 source files; depends on task-02, task-03.
- [x] 05-decisions-026 — 4 source files; depends on task-02, task-03.
- [x] 05-decisions-027 — 3 source files; depends on task-02, task-03.
- [x] 05-decisions-028 — 1 source file; depends on task-02, task-03.
- [x] 05-decisions-029 — 4 source files; depends on task-02, task-03.
- [x] 05-decisions-030 — 1 source file; depends on task-02, task-03.
- [x] 05-decisions-031 — 4 source files; depends on task-02, task-03.
- [x] 05-decisions-032 — 4 source files; depends on task-02, task-03.
- [x] 05-decisions-033 — 4 source files; depends on task-02, task-03.
- [x] 05-decisions-034 — 4 source files; depends on task-02, task-03.
- [x] 05-decisions-035 — 4 source files; depends on task-02, task-03.
- [x] 05-decisions-036 — 4 source files; depends on task-02, task-03.
- [x] 05-decisions-037 — 4 source files; depends on task-02, task-03.
- [x] 05-decisions-038 — 4 source files; depends on task-02, task-03.
- [x] 05-decisions-039 — 1 source file; depends on task-02, task-03.
- [x] 06-research-01-agent-tooling — 1 source file; depends on task-02, task-03.
- [x] 06-research-02-animation-package — 1 source file; depends on task-02, task-03.
- [x] 06-research-03-behaviour-verification-method — 1 source file; depends on task-02, task-03.
- [x] 06-research-04-book-census-config — 1 source file; depends on task-02, task-03.
- [x] 06-research-05-build-performance — 1 source file; depends on task-02, task-03.
- [x] 06-research-06-codebase-systematization — 1 source file; depends on task-02, task-03.
- [x] 06-research-07-design-foundations — 1 source file; depends on task-02, task-03.
- [x] 06-research-08-developer-tooling — 1 source file; depends on task-02, task-03.
- [x] 06-research-09-documentation-site — 1 source file; depends on task-02, task-03.
- [x] 06-research-10-element-child-radius — 1 source file; depends on task-02, task-03.
- [x] 06-research-11-floating-surface-shadows — 1 source file; depends on task-02, task-03.
- [x] 06-research-12-functional-parity-sources — 1 source file; depends on task-02, task-03.
- [x] 06-research-13-hand-rolled-audit — 1 source file; depends on task-02, task-03.
- [x] 06-research-14-icon-library — 1 source file; depends on task-02, task-03.
- [x] 06-research-15-lit-practice-review — 1 source file; depends on task-02, task-03.
- [x] 06-research-16-package-choices — 1 source file; depends on task-02, task-03.
- [x] 06-research-17-question-dialog-countdown — 1 source file; depends on task-02, task-03.
- [x] 06-research-18-repository-layout — 1 source file; depends on task-02, task-03.
- [x] 06-research-19-slotted-cascade — 1 source file; depends on task-02, task-03.
- [x] 06-research-20-systematic-approach — 1 source file; depends on task-02, task-03.
- [ ] 07-actions — 1 source file; depends on task-04, task-05, task-06.
- [ ] 07-additional-functionality-review — 1 source file; depends on task-04, task-05, task-06.
- [ ] 07-chakra-pro-review — 1 source file; depends on task-04, task-05, task-06.
- [ ] 07-completed-plan — 1 source file; depends on task-04, task-05, task-06.
- [ ] 07-conventions — 1 source file; depends on task-04, task-05, task-06.
- [ ] 07-data-displays — 1 source file; depends on task-04, task-05, task-06.
- [ ] 07-documentation-tooling — 1 source file; depends on task-04, task-05, task-06.
- [ ] 07-foundations — 1 source file; depends on task-04, task-05, task-06.
- [ ] 07-inputs-forms — 1 source file; depends on task-04, task-05, task-06.
- [ ] 07-inventory — 1 source file; depends on task-04, task-05, task-06.
- [ ] 07-layout — 1 source file; depends on task-04, task-05, task-06.
- [ ] 07-messages-statistics — 1 source file; depends on task-04, task-05, task-06.
- [ ] 07-navigation-disclosure — 1 source file; depends on task-04, task-05, task-06.
- [ ] 07-overlays-help — 1 source file; depends on task-04, task-05, task-06.
- [ ] 07-phase-1-review — 1 source file; depends on task-04, task-05, task-06.
- [ ] 07-phase-2-review — 1 source file; depends on task-04, task-05, task-06.
- [ ] 07-phase-3-review — 1 source file; depends on task-04, task-05, task-06.
- [ ] 07-port-plan — 1 source file; depends on task-04, task-05, task-06.
- [ ] 07-proposal-coverage — 1 source file; depends on task-04, task-05, task-06.
- [ ] 07-proposal-questions — 1 source file; depends on task-04, task-05, task-06.
- [ ] 07-readme — 1 source file; depends on task-04, task-05, task-06.
- [ ] 07-release-0.3.0 — 1 source file; depends on task-04, task-05, task-06.
- [ ] 07-release-0.3.1 — 1 source file; depends on task-04, task-05, task-06.
- [ ] 07-release-0.3.2 — 1 source file; depends on task-04, task-05, task-06.
- [ ] 07-remaining-work — 1 source file; depends on task-04, task-05, task-06.
- [ ] 07-rich-content — 1 source file; depends on task-04, task-05, task-06.
- [ ] 07-selection — 1 source file; depends on task-04, task-05, task-06.
- [ ] 07-summary-m22-react — 1 source file; depends on task-04, task-05, task-06, task-08.
- [ ] 07-summary-m23-docs — 1 source file; depends on task-04, task-05, task-06, task-08.
- [ ] 07-summary-m24-consumers — 1 source file; depends on task-04, task-05, task-06, task-08.
- [ ] 07-summary-m24-devtools — 1 source file; depends on task-04, task-05, task-06, task-08.
- [ ] 07-summary-m24-skills-followups — 1 source file; depends on task-04, task-05, task-06, task-08.
- [ ] 07-summary-m24-skills-iteration-1 — 1 source file; depends on task-04, task-05, task-06, task-08.
- [ ] 07-summary-m24-skills-iteration-1-viewer-tooling — 1 source file; depends on task-04, task-05, task-06, task-08.
- [ ] 07-summary-m24-tabs-indicator — 1 source file; depends on task-04, task-05, task-06, task-08.
- [ ] 07-summary-m25-release — 1 source file; depends on task-04, task-05, task-06, task-08.
- [ ] 07-summary-m25-tooling — 1 source file; depends on task-04, task-05, task-06, task-08.
- [ ] 07-summary-m25-workspace — 1 source file; depends on task-04, task-05, task-06, task-08.
- [ ] 07-summary-m26-appearance — 1 source file; depends on task-04, task-05, task-06, task-08.
- [ ] 07-summary-m26-audit — 1 source file; depends on task-04, task-05, task-06, task-08.
- [ ] 07-summary-m26-audit-component-browser — 1 source file; depends on task-04, task-05, task-06, task-08.
- [ ] 07-summary-m26-audit-final-runtime-review — 1 source file; depends on task-04, task-05, task-06, task-08.
- [ ] 07-summary-m26-audit-official-firefox — 1 source file; depends on task-04, task-05, task-06, task-08.
- [ ] 07-summary-m26-bundle — 1 source file; depends on task-04, task-05, task-06, task-08.
- [ ] 07-summary-m26-dev-watch — 1 source file; depends on task-04, task-05, task-06, task-08.
- [ ] 07-summary-m26-final — 1 source file; depends on task-04, task-05, task-06, task-08.
- [ ] 07-summary-m26-managed-forms — 1 source file; depends on task-04, task-05, task-06, task-08.
- [ ] 07-summary-m26-native-forms — 1 source file; depends on task-04, task-05, task-06, task-08.
- [ ] 07-summary-m26-scoped — 1 source file; depends on task-04, task-05, task-06, task-08.
- [ ] 07-surfaces — 1 source file; depends on task-04, task-05, task-06.
- [ ] 07-terms — 1 source file; depends on task-04, task-05, task-06.
- [ ] 07-typography — 1 source file; depends on task-04, task-05, task-06.
- [ ] 07-workflow-research — 1 source file; depends on task-04, task-05, task-06.
- [x] 08-browser-distribution — 2 source files; depends on task-01, task-02, task-03.
- [ ] 08-bundling — 2 source files; depends on task-01, task-02, task-03.
- [ ] 08-component-data — 2 source files; depends on task-01, task-02, task-03.
- [x] 08-dependency-audit-npm-cache-private — 1 source file; depends on task-01, task-02, task-03.
- [ ] 08-devtools-manual — 3 source files; depends on task-01, task-02, task-03.
- [ ] 08-documentation-action-labels.browser-check — 1 source file; depends on task-01, task-02, task-03.
- [ ] 08-documentation-appearance.browser-check — 1 source file; depends on task-01, task-02, task-03.
- [ ] 08-documentation-copied.browser-check — 1 source file; depends on task-01, task-02, task-03, 08-browser-distribution.
- [ ] 08-documentation-icons.browser-check — 1 source file; depends on task-01, task-02, task-03, 08-browser-distribution.
- [ ] 08-documentation-navigation.browser-check — 1 source file; depends on task-01, task-02, task-03.
- [ ] 08-documentation-pages.browser-check — 1 source file; depends on task-01, task-02, task-03.
- [ ] 08-documentation-recipe-accessibility.browser-check — 1 source file; depends on task-01, task-02, task-03.
- [ ] 08-documentation-recipes.browser-check — 1 source file; depends on task-01, task-02, task-03.
- [ ] 08-documentation-table-source-isolation.browser-check — 1 source file; depends on task-01, task-02, task-03.
- [ ] 08-documentation-video.browser-check — 1 source file; depends on task-01, task-02, task-03, 08-browser-distribution.
- [ ] 08-flow-distributions.browser-check — 1 source file; depends on task-01, task-02, task-03, 08-browser-distribution.
- [ ] 08-inspector-consumer — 2 source files; depends on task-01, task-02, task-03.
- [ ] 08-native-forms-history.browser-check — 1 source file; depends on task-01, task-02, task-03, 08-browser-distribution.
- [ ] 08-package-tools — 1 source file; depends on task-01, task-02, task-03.
- [ ] 08-public-defaults-browser-check — 1 source file; depends on task-01, task-02, task-03.
- [ ] 08-react-defaults — 2 source files; depends on task-01, task-02, task-03.
- [ ] 08-react-runtime — 2 source files; depends on task-01, task-02, task-03.
- [x] 08-react-types — 1 source file; depends on task-01, task-02, task-03.
- [ ] 08-removals-check — 1 source file; depends on task-01, task-02, task-03, 07-proposal-coverage.
- [ ] 08-scoped-fixture-text — 1 source file; depends on task-01, task-02, task-03.
- [ ] 08-scoped-registration — 2 source files; depends on task-01, task-02, task-03, 08-scoped-fixture-text, 08-browser-distribution.
- [x] 08-table-declaration-patch-check — 1 source file; depends on task-01, task-02, task-03.
- [ ] 08-table-worker-consumer.browser-check — 1 source file; depends on task-01, task-02, task-03.
- [ ] 08-workspace-consumer — 2 source files; depends on task-01, task-02, task-03.
- [ ] 08-workspace-install — 1 source file; depends on task-01, task-02, task-03.
