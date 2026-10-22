# Implementation plan: maintainer workflow migration

Status: approved by Peter for local implementation on 2026-10-21. Tasks 1–11 are complete. The new workflow is active; task 12 verifies the clean candidate and actual host sessions.

Task state belongs in [todo.md](todo.md). [STATUS](../docs/STATUS.md) is the current handoff.

## Outcome

One brain-led workflow serves the monorepo. Current state, specifications, tasks, decisions, research, release records and evidence use the new structure. All five local skills and the old active structure are removed.

The migration preserves information and verification strength. It retires conflicting instructions instead of carrying them forward as exceptions.

## Baseline and scope

- Branch: codex/maintainer-workflow-migration, starting from the locally committed proposal d009bdc35.
- The initial inventory contains 930 tracked files. Two proposal records make the original baseline 932. A later full filesystem census captures 38 ignored verification logs, bringing source coverage to 970. The original baseline remains fixed; the supplemental Git capture adds only the omitted evidence. Finder metadata has a local backup and stays outside project evidence.
- Main remains at the recorded 0.3.2 closure revision. Its quality run passes; a separate documentation run fails one Chromium Hover Card case. The cause remains unverified.
- The runner currently lists 23 browser entry points and creates 24 invocations, because scoped registration runs in two modes. Nineteen entry points live under the old evidence tree.
- Source components, dependencies and published versions are outside this migration. Active verification code and documentation-reference consumers must change where paths require it.

[Baseline evidence](../docs/verification/workflow-migration/initial-research.json).

## Implementation choices

| Choice | Evidence and reason |
|---|---|
| Decouple browser-check behavior from filenames first | scripts/check.ts uses an exact old path for the two scoped modes and a filename regex for audit outputs. A rename can silently change the check plan. Stable check identities make path moves independent of those behaviors. |
| Use a complete migration ledger | The old tree mixes current instructions, historical prose, raw evidence, live drivers, helpers and fixtures. Extension-based moves would misclassify files. |
| Use a narrow migration verifier, not a new workflow manager | Coverage, hashes, links and references need repeatable checks. It must not infer whether prose is correct or maintain a second task queue. |
| Prepare targets, migrate consumers, then remove the old structure | This is a wide refactor. Temporary preparation copies can exist on the integration branch; only the old entry point is active until the cutover. The final tree has no compatibility copies or forwarding links. |
| Review semantic rewrites separately from mechanical moves | A hash proves byte preservation, not that an edited decision retained its meaning. |
| Keep one handoff and one active plan/task list | The five packages share source and generated metadata. Separate workflows would create conflicting state. |
| Keep the two existing contexts | They represent distinct terminology, already selected by Peter. No package-per-glossary expansion is needed. |
| Serialize shared operations | One coordinator owns the ledger, indexes, current task state, cutover, build and generator runs. Workers receive disjoint files and result-file paths. |

Numbered document names are allocated once in the ledger. Preserve dates and original source identities separately; numbering must not invent a chronology or approval.

## Ordered work

The detailed acceptance checks are in todo.md. Rows 4–8 are batch groups, not single unchecked bulk edits.

| Task | Deliverable | Blocked by |
|---|---|---|
| 1 | Browser check behavior survives path renaming | none |
| 2 | Complete file/reference ledger and rule dispositions | none |
| 3 | Coverage, integrity and reference guards | 2 |
| 4 | Saved evidence at its final paths, with original bytes | 2, 3 |
| 5 | Numbered decisions in the new format | 2, 3 |
| 6 | Numbered research and its index | 2, 3 |
| 7 | Current specifications, completed plans, design records and history | 4, 5, 6 |
| 8 | Live verification drivers and fixtures at their final paths | 1, 2, 3; only consumed evidence batches from 4 |
| 9 | New shared guidance and tracker adapters, prepared for activation | 2, 5, 6, 7 |
| 10 | Source consumers use the new references and generated projections agree | 4, 5, 6, 7, 8 |
| 11 | One atomic workflow cutover removes the old structure and local skills | 3, 9, 10 |
| 12 | Full migration acceptance, fresh sessions and independent review | 11 |

Tasks 1 and 2 can proceed independently. After task 3, disjoint evidence, decision and research batches can proceed independently. Task 8 waits only for the evidence or helper batches its checks actually consume, not the whole raw-evidence group. Tasks 7 and 8 can overlap once their own dependencies are complete. Tasks 10–12 are coordinated and sequential.

### Checkpoints

1. After tasks 1–3: runner behavior is unchanged; every source has a destination or justified retirement; guards fail on deliberate corruption.
2. After the record batches and task 8: converted meaning is reviewed; raw hashes match; live checks execute at new paths.
3. Before task 11: no unresolved live reference will be broken by deleting the old tree.
4. After task 12: one active workflow, complete evidence, and actual fresh-session behavior verified.

## Batch bounds

The ledger allocates exact batch IDs and file lists before any file in that batch changes. Add each batch as its own checkbox under the owning task in todo.md. This refines the same approved work; it does not authorize new scope.

| Batch | Bound and completion proof |
|---|---|
| Decision conversion | At most four authored records per task, plus their index/ledger update. Long or disputed records get their own task. Each decision and qualification has a source trace. |
| Research conversion | At most two long notes or four short notes per task. Read each in full; distinguish facts, proposals, limits and dated history. |
| Specifications and history | One family or at most four related records per task. Resolve provenance before calling a contract current. |
| Raw evidence moves | One named release or milestone directory per task. These can contain many files because every byte is checked mechanically. No semantic editing in that commit. |
| Verification code moves | One driver and its dependency closure per task; combine up to three short drivers only when their shared fixtures make that one unit. Record extra fixture files explicitly. |

If a code batch grows beyond about five authored files, split it before editing. Data-only moves retain the wide-refactor exception and their full hash checks. No batch is complete merely because its files have moved.

## Record ownership and formats

The ledger records the old path and source revision/hash, destination, document kind, current/historical status, owning batch, reference consumers and verification method. It includes records created during this migration.

The rule matrix records each instruction's source, retain/rewrite/retire/resolve disposition, the applicable brain or agent-skills guidance, and its sole new owner. A generic “old project rules win” exception is not permitted.

| Record type | Target |
|---|---|
| Current state | docs/STATUS.md |
| Agent routing and repository guidance | AGENTS.md, CLAUDE.md and docs/agents/ |
| Compatible development constraints | docs/development/ |
| Current contracts | spec/ |
| Active plan/tasks | tasks/plan.md and tasks/todo.md |
| Completed plans/tasks | tasks/done/systematization/ |
| Decisions | docs/decisions/NNNN-slug.md |
| Research | docs/research/NN-slug.md and README.md |
| Original intent/interview records | docs/design/ |
| Completed prose history | docs/history/ |
| Release summaries | docs/releases/ |
| Immutable evidence and migration reports | docs/verification/ |
| Live acceptance code and its fixtures | scripts/verification/ |
| Unresolved follow-ups | .scratch/maintenance/issues/ |

Keep a requirement when its approved intent remains valid, even if current code does not implement it. Record that disagreement as an open issue. Do not silently rewrite the requirement to match the code.

Retired process instructions remain available in Git history. Converted documents describe their history without presenting them as commands for the current agent.

## Live verification migration

The ledger follows imports, relative URLs, file reads, copied fixture trees, generated inputs and runner arguments. The currently known entry groups are:

| Group | Existing area | Essential behavior |
|---|---|---|
| Shared helpers | evidence/browser-distribution.ts and its colocated test | Runtime and distribution setup remains shared |
| React | m22-react | Wrapper behavior and default restoration |
| Documentation pages | m23-docs pages, navigation and icons | Complete page coverage, route behavior and icon loading |
| Documentation recipes | m23-docs recipes, accessibility, copied examples and video | Actual outcomes, cleanup and copied-consumer behavior |
| Consumer tooling | m24-consumers | Packed installation and tools/skills contract |
| Native forms | m26-native-forms | Real history restoration |
| API/removal audits | m26-audit | Removed interfaces, defaults and Table patch proof |
| Scoped registration | m26-scoped | Both module and CDN invocations |
| Flow | m20-flow | All six entries, two origins and actual worker closure |
| Bundle/worker consumers | m26-bundle and m26-audit | Archive arguments and consumer identity |
| Component-case inputs | m26-audit/component-browser | cases.json and controls.json are live fixture inputs |
| Release/security proof helpers | release-0.3.0 and any further discovered consumers | The npm cache regression and existing audit dispositions keep their meaning |

This table is the known starting set. Task 2 must find transitive and dynamically named consumers before classifying the rest as historical.

The normal lint walk includes scripts/ but excludes the old notes tree. Moved live code must satisfy its new authored-code checks. Historical example code stays classified as evidence. Do not add broad exclusions to make the move pass.

Keep the runner's ordering, arguments, environment isolation, failure aggregation and output ownership. The complete browser plan must retain all 24 invocations unless new evidence leads to a separately reviewed change.

## Verification

Run commands with Bun 1.4.2. The approved task uses brain's focused-per-slice verification and the complete final gate.

Existing commands:

~~~sh
bun test scripts/__tests__/check.test.ts
bun test scripts/__tests__/release-workflows.test.ts
bun scripts/check.ts static
bun scripts/check.ts types
bun run check
git diff --check
~~~

The migration guard and its colocated tests are new task-3 work. It proves file coverage, preserved hashes, destination uniqueness and resolvable active references. Its report keeps natural-language review separate from those mechanical proofs.

For each migrated live driver, run its actual scenario with the prepared package set and pinned browser runtime. Source-only success does not substitute for packed-consumer acceptance.

Final acceptance also checks:

- The site and generated metadata refer to the new documents.
- Public package allowlists do not accidentally include maintainer instructions or historical test fixtures.
- Root and package-start sessions in Claude and Codex load the intended context and choose brain on overlapping skill names.
- Interrupted work, a new request beside an incomplete plan, no approved next task, and a failed baseline are handled correctly.
- No removed path is still an active instruction, import, filesystem dependency or generated reference.
- Old path strings in immutable evidence are labelled historical data, not treated as live references.

## Known failure and other limits

The Chromium Hover Card activation failure remains an explicit issue. Capture its exact test scope, source revision and result before moving verification code. A passing rerun alone does not establish the cause.

If it blocks the final gate, investigate under brain's debugging workflow. Keep a required fix separate from the path migration. Do not skip the assertion or claim migration acceptance from a red final run.

Actual Safari, assistive technology, OS input/autofill, background-window behavior and the earlier token-rotation confirmation remain visible follow-ups. This migration does not certify them.

## External references and permissions

The ledger includes local links, site-generated references, GitHub release-note links and references embedded in published artifacts.

Prepare mutable external-link corrections locally. Do not rewrite published npm bytes, signed provenance or release tags. If an immutable published reference cannot survive the selected structure, record the exact conflict before deleting its target.

Plan approval authorizes the local implementation and its verified local commits. It does not grant a standing push, PR, merge, release or publication permission. Prepare the reviewed result first, then ask once for the concrete outward-facing action that is needed.

No global plugin configuration or reference-project file changes are included.

## Review state

Specification: approved 2026-10-21.

Implementation plan:

- Task size: approved by Peter on 2026-10-21 through “approved,” answering the task-size review question.
- Dependency order: approved by Peter on 2026-10-21 through “approved,” answering the dependency-order review question.
- Task boundaries: approved by Peter on 2026-10-21 through “approved,” completing the plan review.

Brain's plan-review questions cover these three points, one question at a time. Clear written approval of the presented plan must be preserved; settled specification choices are not reopened.
