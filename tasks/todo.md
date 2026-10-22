# Tasks: maintainer workflow migration

Status: proposed for plan review, 2026-10-21. The [specification](../spec/SPEC-maintainer-workflow.md) is approved. The [implementation plan](plan.md) is not yet approved. No implementation checkbox is complete.

The current handoff is still [the existing pass entry point](../notes/alignment/README.md#where-we-are). Task 11 changes that owner.

## Checklist

- [ ] 1. Make browser-check behavior independent of filenames
- [ ] 2. Complete the migration ledger and rule audit
- [ ] 3. Prove the migration guards
- [ ] Checkpoint A: safe preparation
- [ ] 4. Migrate raw evidence batches
- [ ] 5. Convert decision-record batches
- [ ] 6. Convert research batches
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
- [ ] All 23 entries still produce the same 24 ordered invocations, archive arguments, environment values and output destinations.
- [ ] A regression proves that changing an entry's file path does not lose scoped module/CDN coverage, audit result routing or worker-consumer arguments.
- [ ] Failure aggregation, complete-result recording and clearing of diagnostic filters remain unchanged.

**Verification:** Run the focused check-runner tests, strict script types and static checks. Preserve the before/after invocation comparison.

**Dependencies:** None.

**Files likely touched:** scripts/check.ts; scripts/__tests__/check.test.ts.

**Scope:** Small; two authored files.

## Task 2: Complete the migration ledger and rule audit

**Description:** Refresh the tracked inventory, classify every file/section, allocate new names, and find its live consumers. Audit old rules against the new workflow before carrying anything forward.

**Acceptance criteria:**
- [ ] Every current source in scope, including migration-era additions, has an owner, destination or justified retirement, source revision/hash and validation method.
- [ ] Every old instruction has retain/rewrite/retire/resolve status, supporting evidence and one new owner; no unresolved conflict is silently retained.
- [ ] Live drivers, helper imports, data fixtures and public references are distinguished from immutable historical evidence. Known failures and manual follow-ups have explicit destinations.

**Verification:** Compare the ledger's source set to Git; inspect all rule sources and dynamic reference cases; save the full reference graph and conflict matrix. Read each assigned record in full.

**Dependencies:** None.

**Files likely touched:** docs/verification/workflow-migration/ledger.json; docs/verification/workflow-migration/rules.md; docs/verification/workflow-migration/references.json.

**Scope:** Three output records; complete read-only source inventory.

## Task 3: Prove the migration guards

**Description:** Add a narrow Bun verifier for the ledger, evidence integrity and active references. It reports facts; it does not infer prose meaning or own task state.

**Acceptance criteria:**
- [ ] Failing fixtures cover an omitted source, duplicate/escaping destination, changed immutable evidence, missing target and an active old-path reference.
- [ ] Historical path strings in explicitly classified immutable payloads remain intact without masking active imports or links.
- [ ] Preparation and final checks are distinct: an unfinished target can never pass final acceptance.

**Verification:** Write the failing cases first. Run the colocated tests and applicable type/static checks. Verify the complete current ledger without moving project files.

**Dependencies:** 2.

**Files likely touched:** scripts/workflow-migration.ts; scripts/__tests__/workflow-migration.test.ts; bounded test fixtures beside that test.

**Scope:** Two authored modules plus small fixtures.

## Checkpoint A: safe preparation

- [ ] Tasks 1–3 pass their own checks.
- [ ] The complete source set and rule dispositions are reviewable.
- [ ] Every batch has a defined completion condition; unresolved product meaning remains explicit.
- [ ] The known Chromium Hover Card failure is captured without a guessed cause or weakened assertion.

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

- [ ] Task size accepted.
- [ ] Dependency order accepted.
- [ ] Task boundaries accepted.

These are the plan-review decisions. Specification approval is already settled.
