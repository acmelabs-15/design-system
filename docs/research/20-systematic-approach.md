# Research 20: Systematic verification and maintainer-workflow research

Status: historical research with dated implementation follow-ups. Converted 2026-10-21.

## Scope and current interpretation

This record preserves the closed parity/systematization methods and the later approved maintainer-workflow investigation. The old reading order, phase queue, source freeze, project-over-plugin exceptions and delegation are retired. The [approved specification](../../spec/SPEC-maintainer-workflow.md), [plan](../../tasks/plan.md) and [current handoff](../STATUS.md) own the new work. The dated task1–4 results below do not close full migration or fresh-session acceptance. The Chromium Hover Card failure and its unverified cause remain explicit.

The findings below retain their original research dates, source versions, measurements and verification limits. Statements about current code describe the checkpoint in their section. A proposal or source survey is not a decision or runtime acceptance. The [current handoff](../STATUS.md) owns unfinished work; the closed pass's phase gates and delegation do not apply to new work.

## Findings and dated evidence


Written 2026-09-10 and linked from the historical port plan. This record explains the investigated boundary
between mechanical checks and semantic judgment, then records later workflow decisions and migration evidence.

## The principle

Quality is the goal, and speed is only valuable where it does not cost quality. So:

**A script owns work that has one right answer, applies the same rule every time, and can be checked.**
Classification against a written rule, extraction from a known format, inventory, cross-referencing.
A person doing this work is slower, more expensive, and *less consistent* — the same input produces
different judgements on different days, which is how our parity numbers became untrustworthy.

**A person owns work where the answer depends on meaning.** What a measurement is measuring, whether a
behaviour matches, what a name should be, whether a difference is acceptable. A script here produces
output that looks finished and is wrong, which is worse than no output, because it stops anyone looking.

**The failure to guard against is overshooting.** A script that guesses a judgement is the most dangerous
artefact in this project. It is confident, uniform and unreviewed. Every tool below therefore either
refuses to guess, or marks what it guessed.

## The boundary, measured rather than asserted

This was tested, not assumed. Where a count appears, it came from running the check.

### Scripts own these

| Work | Evidence it is mechanical | Tool |
|---|---|---|
| Classifying a style difference as hard, soft or an accepted leftover | Three exact rules, each naming a property and a value pair. Applied by hand, the same page gave different answers on different days. | `tools/geist/diff.ts` |
| Extracting the reference's written behaviour statements | 442 statements pulled from a known heading structure across 58 pages, deterministically. | `tools/geist/contract.ts` |
| Extracting every callback the reference's examples wire up | 40 callbacks, from JSX attribute syntax. This is the signal that catches a control wired to nothing. | `tools/geist/contract.ts` |
| The mechanical half of a census configuration | Page label, marker, host, root selector, part name, child selectors — all present in the map. | `tools/geist/config.ts` |
| Regenerating every element and diffing against what shipped | 95 elements, byte comparison. This is what found the two generator bugs. | `/tmp/determinism.sh` pattern, worth making permanent |
| Inventory and cross-reference | Reference mentions under `src/` (9 files). Events the docs listen for versus events elements dispatch (found the table defect). Tokens declared versus read (5347 versus 579). Unused dependencies (found two). | one-off scripts, kept in the commit message |

### People own these

| Work | Why a script cannot | Evidence |
|---|---|---|
| The five judgement fields of a census config | They decide *what is measured and in what context*: what to prepare, which viewport, which width, which parts are text-sized, how to reach a repeated root. | **25 of 26** saved configs carry at least one. They are the norm, not the exception. |
| Whether our element satisfies a behaviour statement | The statement is prose about intent. | Of 442 statements, only 114 name something a test can observe; 304 are guidance. |
| Whether a difference is a new accepted leftover | Requires understanding why the values differ and whether it is visible. | Each of the three current leftovers needed a causal explanation to justify it. |
| Naming, in the API | Self-consistency, platform idiom and familiarity have to be weighed. | The `variant` versus `type` case: the reference contradicts itself, so no rule mechanises it. |
| Whether to adopt a package | Depends on our data, our reference's behaviour, and maintenance status. | The Zag question turns on whether the reference's behaviour is conventional per element. |
| Building a map for an element | Reading the spec and deciding what maps to what. | Calendar's nine examples render only a skeleton, so its map cannot be derived at all. |

### The middle: a script finds it, a person decides it

This is where most of the remaining value is. The script narrows 5000 candidates to 20; the person judges
those 20.

- The behaviour contract sorts 442 statements into 114 assertable, 24 mixed, 304 guidance. A person reads
  114 instead of 442.
- The reference-callback list says "look here" for 40 capabilities. It never says "this is a defect".
- The token reachability calculation finds what nothing reads. A person decides the public contract,
  because consumers use tokens too and tokens chain (182 internal references, 90 from the docs).
- The config deriver fills six fields and prints five explicit questions.

## Where the port actually stands, measured

| Measure | Value | How it was established |
|---|---|---|
| Elements the generator reproduces byte-identically | 90 of 95 | Regenerated every map, compared against what shipped |
| The other 5 | All improvements | Read by hand: each drops an unused legacy variable or a duplicate declaration |
| Pages reading zero hard differences | **103 of 124** | Full diff sweep with the accepted-leftover classification |
| Pages with real differences | 21 | Same sweep. A precise target list, and all against stale measurements |
| Maps the generator reports clean | 93 of 129 | The other 36 report cascade notes and documented reference quirks, not defects |
| Tests | 586 pass | `bun test` |

**Two of the three "unfinished" elements are generator-clean.** Context-card and relative-time-card both
report clean and have working elements with passing tests; they need a census run, not a build.
Relative-time-card already has a saved config, which makes it the cheapest remaining work.

**Calendar is the real one.** Every one of its nine reference examples renders only a skeleton on the
server, so the real calendar exists at runtime only and no map can be derived from the spec. The investigation proposed the
sketch path, drawn from compiled-chunk class strings, and estimated it as the most expensive of the three.

## The order, and why

The original proposed order was historical port work:

1. Re-measuring the 21 pages with differences, retaining the 103 clean readings rather than rerunning all 124. Each new run needed a config; 67 roots lacked one.
2. Fixing surviving defects in their generator owner.
3. Completing Relative Time Card, then Context Card, then Calendar.
4. Behavior parity using the [method investigation](03-behaviour-verification-method.md); checklists existed but the browser tier did not yet.
5. The [package audit](16-package-choices.md) and [hand-written responsibility audit](13-hand-rolled-audit.md).
6. [Lit practice](15-lit-practice-review.md), with manifest work then judged the highest-value item.
7. Cleanup and a release supported by parity evidence.

This sequence is closed history, not a restart queue.

## Rules that keep quality from slipping

The port method required observed reference evidence, explicit uncertainty in judgment fields and reasons for accepted differences. It assigned CSS defects to their generator owner, recorded decisions in the same turn and reported unperformed checks. These explain the old method; the current plugin workflow and repository guidance own operational instructions. The later producer map includes more owners than tools/geist alone.

## What running the loop actually teaches

Added 2026-09-10, after taking relative-time-card and context-card to parity.

**Most reported differences are the harness, not the element.** Across the two elements, of 208 and 12
differences reported, **all but zero traced to the measurement setup**. Not one was a defect in the
element's styles.

That is not a reason to trust the elements. It is a reason to fix the setup *first* and read the number
only afterwards, because a wrong setup produces a large, confident, entirely false number — which is
exactly how the parity claim became untrustworthy in the first place.

The causes seen so far, each worth checking before believing any count:

| Cause | How it shows up |
|---|---|
| The two sides read at different viewport sizes | A fixed-position box reports the window's width. Dozens of differences, all geometry. |
| A box sized from its own text compared as hard | Our font is different by design, so any width it drives differs. |
| An overlay opened before the page settled | Placement is measured **at open time**. Scroll position, container width and unfinished layout all change the answer. |
| A value the mirror cannot compute | The mirror strips scripts, so anything the reference computes at runtime is frozen at its sketch value. Compare the resolved *decision*, not the number. |
| Our element rendering a node the reference does not | Root counts diverge, the diff pairs by position, and every later comparison shifts. |

**The check that catches all five: compare root counts per side before reading any difference count.**
If they differ, nothing downstream means anything. The runner prints them for exactly this reason.

## Agent Skills for the systematization pass

Checked 2026-09-19. Peter chose to use the pack throughout the remaining pass, with the existing decisions and approval steps preserved. See [the decision](../decisions/0002-agent-skills-workflow.md).

### Installation and evidence

- Official site: <https://skills.addy.ie/>. The site advertises 24 skills; the installed repository contains 25 `SKILL.md` files. The installed count was the observed count.
- Official Codex guide: <https://github.com/addyosmani/agent-skills/blob/c004a74784a08295d52749b04cda634125b9a581/docs/codex-setup.md>. It specifies native marketplace registration and plugin installation, and direct skill invocation in Codex. Its Claude Code slash commands and personas are not the Codex integration.
- The repository README warns that individual skill copies omit the repository-level shared references. The native plugin preserves these paths, so it was used instead of separate skill copies.
- Commands run: `codex plugin marketplace add addyosmani/agent-skills`, then `codex plugin add agent-skills@agent-skills --json`.
- Verification: `codex plugin list --marketplace agent-skills --json` reports `installed: true`, `enabled: true`, version `0.6.10`. The cache contains 25 skills and all seven shared reference files.
- Installed root: `/Users/peterkloss/.codex/plugins/cache/agent-skills/agent-skills/0.6.10`. Marketplace commit: `c004a74784a08295d52749b04cda634125b9a581`.
- Availability is verified on disk and in CLI state. Automatic discovery in a subsequent app turn is not yet verified; the upstream Codex guide advises a new session if discovery has not refreshed. Skills can be read directly from the installed root in this task.

### Applying the pack to our existing documents

The installed versions of spec-driven-development, source-driven-development, api-and-interface-design, planning-and-task-breakdown and incremental-implementation were read in full.

The original adaptation kept goals and element specifications in the pass README/inventory, citing the specification skill's existing-format allowance at lines 150–154. Research used installed versions and official documentation; interface work used the selected web-component conventions rather than generic REST examples. Migration planning used the old notes/alignment/migration-plan.md path and avoided a parallel tasks/plan.md and tasks/todo.md. Implementation grouped source, maps, generated output, docs and tests into one logical slice. The pack supplied testing, browser, performance and review skills, but none of those workflows ran in that installation turn.

### Defaults that project instructions override

This heading records the original override policy. The approved maintainer workflow retires that policy and its obsolete path/permission exceptions:

- API skill line 125 preferred additive changes. The original pass asserted no other consumers and selected outright replacement, with current-only consumer documentation and no aliases, fallbacks, deprecated exports or legacy modes. The completed replacements remain final. Actual usage was not measured; that premise and blanket future permission are retired.
- API skill line 146 used REST boolean-prefix/uppercase-enum examples. Approved Lit naming and glossary conventions remained the component contract.
- Incremental skill line 41 committed each slice, while old PLAN line 159 required Peter to request a commit. That old procedural override does not supersede this migration's approved local-commit scope.
- Specification skill line 182 defaulted to tasks/. The original pass retained notes/alignment/. The approved migration now selects spec/ and tasks/ explicitly.
- Generic examples did not change selected package roles, generated CSS ownership, colocated tests or build dependencies. Reference evidence stayed outside src. Their current owners are assigned by the rule audit, rather than this old override list.

No project build or runtime behaviour changed during installation. After installation, Peter separately confirmed the existing pass scope. Its seven principles are recorded, and the later walkthrough selected the [shadow-role mapping](../decisions/0039-floating-surface-shadows.md). Plugin adoption itself did not approve element interfaces or implementation.

## Phase 1 extension checkpoint

Historical checkpoint: the current status is in the [pass handoff](../STATUS.md). The paragraph below records the earlier capture.

At this historical capture, Peter had expanded the pass and Phase 2 was underway. That phase later closed. The [extension register](../design/additional-capabilities.md) preserves the research and acceptance obligations. The seven-phase lifecycle and source freeze applied then; they are retired workflow history.

The records-only capture saves decisions made while Plan mode prevented file writes. Accepted directions and initial research are separate. The original capture convention propagated changed decisions into the handoff and existing subject analysis, avoiding a duplicate subject file.

## Evidence and implementation quality reaffirmation

Reaffirmed 2026-09-19 by Peter. [Standing decision](../decisions/0034-evidence-and-implementation-quality.md), [retrospective audit](../history/systematization/architecture-review.md#evidence-audit). The existing rules were already clear; the correction is to apply them before a recommendation is put forward.

The reaffirmed quality bar required current code evidence, relevant official/reference practice and tests appropriate to consequential recommendations. It separated observations, bounded feasibility, comparisons and unknowns. Missing facts required investigation; community-preference claims required a stated survey and limits rather than a few names presented as consensus.

The reaffirmed criteria were correctness, accessibility, maintainability, testability, performance and integration fit. Speed, ease, familiarity, convenience and file/line count alone did not decide the outcome. Research reuse and independent parallel work were proposed ways to improve pace without reducing that bar; this historical statement grants no new delegation.

When a previously suggested or selected direction lacks adequate comparative support, preserve the choice history, record the evidence gap and reevaluate the mechanism. Bring a concrete revision to Peter if new evidence changes the recommendation. A user-approved direction, documented framework pattern or passing simulated-DOM probe is not a completed browser implementation.

At the initial audit, CSS-first remained unselected and state integration had only a six-case happy-dom probe. Subsequently Peter selected the compiled-CSS direction after comparison. The actual existing state helper and a focused scratch refinement have now been checked, alongside native-form timing. The [architecture closeout](../history/systematization/architecture-review.md#phase-3-closure) assigns remaining interface decisions and implementation checks to their return points. This is not blanket revalidation or completed implementation certification.

## Keeping the record synchronized

Peter reaffirmed that affected notes had to remain accurate. The old capture updated the decision, analysis, inventory and active pass handoff wherever they presented a changed choice as current or open. It searched for obsolete names, contrary scope and stale next actions, rather than relying on one appended paragraph.

The old central handoff owned phase and next-step state. Completed reviews linked to it. Measurements and superseded decisions retained dates and replacement links, and capture checks covered local anchors, evidence JSON and source fingerprints. Capture did not turn drafts into approvals or unverified evidence into passing tests. The new workflow preserves one current owner per fact and uses docs/STATUS.md for handoff.

## Component-level progress correction

Peter approved a workflow correction on 2026-09-20 after the foundation investigation expanded into repeated small decisions and probes without completing inventory entries. The evidence remains useful; the problem was unbounded sequencing and progress reporting that foregrounded activity instead of completed contracts.

The correction used the [remaining-work queue](../../tasks/done/systematization/review-queue.md) to assemble complete family proposals, dependencies and engineering checks. The agent owned discoverable facts and ordinary implementation details; Peter owned consequential unresolved authoring/behavior choices. A finding could block its affected interface without suspending unrelated preparation.

The first proposed delivery was shared rules/layout, based on Group, Box, Stack, Simple Grid and control-compatibility evidence. This replaced isolated helper-detail questioning. Reporting emphasized complete proposals, approvals, remaining groups and blockers, with test/link/fingerprint results as evidence. The original source freeze and Phase 4/5 gates still applied then; they are historical. [Decision](../decisions/0002-agent-skills-workflow.md#complete-component-proposals-and-visible-progress), [coverage](../verification/systematization/remaining-work-consolidation-2026-09-20.json).

Peter subsequently required the [entire Phase 4 proposal set before further questions](../decisions/0002-agent-skills-workflow.md#assemble-the-whole-proposal-set-before-the-next-decision-walk). The first layout delivery completed preparation for one group. Peter's correction required assembling all remaining groups, dependencies and genuine choices before the next decision walk. The [established-reference rule](../decisions/0082-reference-systems.md#follow-the-established-reference-without-another-preference-question) resolves source-defined details without individual preference votes. No production source or migration approval is implied.

That assembly now covers all thirteen groups through the [complete proposal index](../../spec/SPEC-design-system.md#complete-proposal-set). The [coverage map](../../spec/component-coverage.md) accounts for all 150 source tags and thirty extension records, and the [five-question register](../design/systematization-decisions.md) separates user choices from retired source lookups/engineering details. The five-question register replaced the earlier one-family draft loop. Assembly itself approved neither complete entries nor implementation.

### Whole-set approval and Phase 5 handoff

On 2026-09-20 Peter said “I approve all proposals.” The [approval record](../decisions/0049-inventory-approval.md) selects the complete set and the five stated recommendations. Earlier proposal/unselected statements above retain their historical evidence scope; current design status is approved. Peter subsequently [approved the migration plan](../decisions/0064-migration-approval.md) through “approved”. At that approval checkpoint, M00 prerequisites preceded dependent implementation and production implementation had not started. The completed systematization evidence supersedes that status; approval alone was not a runtime result.

## Maintainer workflow migration 2026-10-21

Peter now requests the agent-skills/brain workflow used in the CLI and D&D projects. He clarifies three requirements: complete migration to the new layout and formats, deletion of all five local skills, and removal or rewriting of rules that conflict with the new workflow. [Decision](../decisions/0057-maintainer-workflow-migration.md), [approved specification](../../spec/SPEC-maintainer-workflow.md), [observations and inventory](../verification/workflow-migration/initial-research.json).

### What creates the continuity in the reference projects

The investigation read the supplied D&D kickoff prompt and both projects' AGENTS.md, CLAUDE.md, README.md, CONTEXT.md, docs/STATUS.md, all three docs/agents files and project plugin settings in full. The CLI capability index and completed github-ops plan/task list were also read in full.

The repository instructions supply the session contract: read status first, read the active specification/tasks, inspect Git and verification, report briefly, then update status/tasks at the end. CLAUDE.md imports the shared AGENTS.md and adds Claude-specific commands. Both plugins are enabled, with brain taking precedence on shared skill names. Both projects use local Markdown issues.

The installed plugin skills provide the lifecycle, specifications, tasks, verification and handoff disciplines. Searches of both plugins' skill and command trees, including the Claude command directories, find no STATUS.md reference. Neither inspected Claude plugin manifest declares a status-writing hook. This supports the repository instructions as the source of the named status-file routine. It is not a guarantee about future plugin versions or every host configuration.

Claude has brain 0.6.0 and agent-skills 0.6.13 installed. Five relevant brain router/setup/planning/build files match their Codex cache copies byte for byte. Project settings express enablement; actual fresh-session discovery remains an implementation acceptance check.

### Differences that the migration must handle

| Finding | Consequence |
|---|---|
| The CLI already contains multiple packages and an agent guide | Use its shared handoff/task model; do not create a parallel project process for each npm package |
| This repo already has a selected two-context map | Keep the component/tooling meanings and their relationship; do not invent one glossary per package |
| The old startup corpus has 114 decisions and 20 analyses, 8,715 lines before other required reading | Route from short current state into relevant records, then read each selected record in full |
| The current handoff mixes current release closure with many old instructions to continue past phases | Separate current state, current specifications and completed history |
| CLAUDE.md is currently a symlink | Replace it with the reference projects' import file without accidentally editing AGENTS.md through the symlink |
| Local domain-modeling and grill-me still say docs/ is generated | Retire those local procedures; the real website output is _site/ |
| scripts/check.ts executes files inside the old evidence tree | Move active drivers and update their callers; do not treat every old evidence file as inert history |
| site/recipes.ts embeds decision and evidence paths | Update source references and their generated projections with the migration |
| Core and browser share one build; React and tools consume its metadata | Preserve source ownership and cross-package verification when changing guidance |
| The reference projects have different standing commit/push grants | Do not import a grant from either project as authorization here |

The complete tracked source inventory for this migration contains 930 files at the baseline, including 215 Markdown files and 124 TypeScript files. Many are raw evidence or fixtures. The ledger must classify them; file extensions alone do not establish whether a file is live code, evidence or a current contract.

### Final-state recommendation

The final-state recommendation selected docs/, spec/ and tasks/, rather than an index over the old notes tree. It allocated numbered decision/research records with indexes, current contracts to specifications, completed plans to tasks/done, releases to docs/releases, raw evidence to docs/verification and completed prose to docs/history.

The recommendation preserved raw evidence bytes and all prose qualifications while converting formats without inventing decisions. Retired process rules remained in Git. Immutable historical payloads were distinct from live references.

The approved recommendation removed all five local skills. Brain's domain-modeling, codebase-design, interview-me/specification and wait-what skills cover their corresponding roles. The old improve-codebase-architecture procedure has no same-named brain skill in the inspected catalog; its useful architecture/review responsibilities route through brain's codebase-design and review skills. Its bespoke HTML-report/grilling procedure is not automatically carried forward as a requirement.

The new workflow controls the rule audit. Existing product constraints survive only when compatible and still applicable. Explicitly classify the completed pass's blanket delegation, old approval cadence, reading order, output paths and local skill priority. Do not add a catch-all “existing rules override the plugins” paragraph that defeats the requested replacement.

This is a workflow/documentation migration, not adoption of the CLI project's runtime version, Changesets setup, shared presets or publication pipeline. Published package versions and signed evidence remain immutable. Inventory mutable external links, including GitHub release-note links, before their source paths disappear. Updating those external surfaces still follows the outward-action approval rule.

### Verification and current red check

Main still points at 1b5d08a420f7f916b0c87b166527c60985937f4d. Quality run 39516728235 passes. Documentation run 39516728504 fails before deployment. Its downloaded diagnostic ZIP matches GitHub's SHA-256. Of 1,446 component cases, one Chromium Tooltip-suite case fails: Hover Card destination activation expects #profile and observes an empty fragment. No root cause is established by this observation.

Carry that result into the migrated status/issues. Do not infer that the assertion is wrong or discard the failing run because a separate run of the same commit passes. The runtime investigation is separate from this specification work; the migration's final gate must still report or resolve all applicable failures.

The migration needs two kinds of proof: complete record/reference/ownership checks, and fresh-session behavior in the intended hosts. Test root and package starts, interrupted work, a new request beside an incomplete task, no approved next task, and an existing failed check. A file's presence does not prove the agent follows it.

No startup rule, local skill, product source, package version or plugin setting changes in this investigation. Peter approves the specification on 2026-10-21. The detailed plan is subsequently approved through all three review questions. This paragraph supersedes earlier provisional suggestions to keep the old record paths permanently.

### Implementation planning after specification approval

The [implementation plan](../../tasks/plan.md) and [task list](../../tasks/todo.md) contain twelve ordered tasks or batch groups. They keep one active workflow during preparation, migrate consumers, then remove the old structure in one coordinated cutover. Semantic rewrites are separate from byte-preserving evidence moves. Exact child batches are recorded before editing; no parent group counts as one unbounded implementation task.

The current check runner contains 23 browser entry points and produces 24 invocations. Nineteen entry points live under the old evidence tree. Its behavior is partly coupled to filenames: an exact scoped-check path selects module/CDN runs, a regular expression routes audit outputs, and a worker filename selects archive arguments. The first proposed task replaces that coupling with stable identities before any driver rename. Existing runner tests already cover failure aggregation, runtime identity, environment isolation and special arguments; those behaviors stay intact.

The migration also owns live JSON inputs consumed by the component runner, the shared browser-distribution helper and its test, and the npm-cache security helper invoked by an audit test. The file/reference ledger must discover further dynamic and transitive dependencies. The normal lint walk covers scripts but not notes, so moved executable code must meet the checks for authored scripts. A broad ignore is not a migration fix.

Task sizing follows the inspected planning skill: bounded authored changes, explicit dependencies and completion proof, with large unchanged evidence moves treated as mechanical batches. Shared indexes, state, generators and heavy verification remain coordinated. The known Chromium failure stays visible and gets a separate prerequisite investigation if it blocks final acceptance.

Peter approves the task sizes and dependency order on 2026-10-21 through separate “approved” replies to those review questions. Peter then approves the task boundaries, completing plan review. The specification and plan approvals are settled. Tasks 1 and 2 start local implementation; no runtime or fresh-session acceptance is claimed yet.

### Runner identity prefactor completed

The runner now stores each check's stable identity beside its file path. Scoped modes, audit output routing and worker archive arguments use that identity. All 23 entries and 24 ordered invocations match the pre-change plan, including explicit undefined diagnostic filters. The rename regression fails on the original implementation and passes after the change. Nine focused tests, strict script types, Oxlint and Oxfmt pass. Coordinator review finds no issue; full migration verification and independent review remain later work. [Complete evidence](../verification/workflow-migration/task-01.json).

### Complete migration source audit

Task 2 allocates every one of the 932 tracked old-tree files. The team reads all 115 decisions, 20 analyses, 28 alignment records, conventions, the full port plan, local skills/references and 22 authored verification summaries. Nineteen captured Markdown records and other raw artifacts receive explicit byte-preservation classifications; this is not a claim of semantic review of every generated or binary payload. The ledger has 920 distinct destination owners, 115 closed rule dispositions, 39 live old-tree files and two exact extracted text fixtures. [Audit results](../verification/workflow-migration/task-02.json), [all reports](../verification/workflow-migration/README.md).

The external audit verifies self-contained package retrieval and historical source targets. Three release-note links need the prepared immutable-source corrections before publication of old-path removal. No external write is made. An existing research link to the removed Empty State map resolves at the recorded pre-migration source commit; its conversion will use that historical target. Four corpus links are explicitly local research resources, not portable build inputs.

### Preservation and reference guard completed

The migration guard reads original Git objects, enforces all three approved source roots, protects immutable bytes and extracted fixture text, rejects path/symlink escapes, and requires exact batch scopes and completion records. It checks active Markdown references and supported literal source inputs, imports and runner paths. Preparation distinguishes planned work from errors; final mode rejects the unfinished migration. Computed/runtime paths, two generated projections, prose meaning and actual host behavior retain separate execution/review requirements.

Independent five-axis review found three reference gaps. Regressions reproduced them before correction. Coordinator checks also closed scope shrinkage, inappropriate retirement, metadata-read containment and missing batch accountability. All 53 focused tests, strict types and static checks pass; actual preparation passes. No required finding remains. [Evidence, original findings and re-review](../verification/workflow-migration/task-03.json).

### Evidence destinations prepared

Task 4 copies 690 immutable files (37,930,925 bytes) into their allocated destinations across 50 bounded batches. Every source matches the Git-bound hash; every destination passes both SHA-256 and direct byte comparison. Aggregate preparation verification passes with zero errors. Original files remain until coordinated cutover. The two live JSON fixture files and two extracted text fixtures belong to task 8 rather than this raw-evidence group. [Per-batch and aggregate proof](../verification/workflow-migration/task-04.json).

## Sources and limitations

Source provenance: notes/analysis/systematic-approach.md (the source path identifies the pre-migration record). The inline sources and saved evidence above retain their original scope. This conversion does not rerun their experiments.

- Mechanical classification does not decide semantic meaning.
- Installed/disk discovery is not actual host invocation.
- Old no-consumers/output-path/project-over-plugin exceptions are retired.
- 930-file and 23/24-check counts describe a baseline; account for migration-created records.
- Current Hover Card cause is unverified; a passing separate run does not erase failure.
- Files do not prove cold startup/interruption behavior.
- Task1 focused results do not close full acceptance or independent review; audit includes the new completion paragraph.
