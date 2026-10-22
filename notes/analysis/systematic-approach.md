# The systematic approach to finishing this port

Written 2026-09-10. Linked from `PLAN.md`, which carries the task list. This file explains the *method*:
what a script decides, what a person decides, and why the line falls where it does.

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
server, so the real calendar exists at runtime only and no map can be derived from the spec. It needs the
sketch path, hand-drawn from the class strings in the compiled chunks. Budget it as the most expensive of
the three.

## The order, and why

1. **Re-measure the 21 pages that report differences.** Not all 124: 103 already read clean, and
   re-measuring those spends the most expensive resource we have on confirming what we know. Save a
   config for each, since 67 roots still lack one.
2. **Fix what survives.** In the generator, never in an element.
3. **Finish the three elements**, cheapest first: relative-time-card, then context-card, then calendar.
4. **Behaviour parity**, per [behaviour-verification-method.md](behaviour-verification-method.md). The
   contract checklists exist; the browser tier does not yet.
5. **The package audit**, per [package-choices.md](package-choices.md) and
   [hand-rolled-audit.md](hand-rolled-audit.md).
6. **Lit practice**, per [lit-practice-review.md](lit-practice-review.md). The manifest is the highest
   single-item value.
7. **Cleanup, then the release that can claim parity.**

## Rules that keep quality from slipping

- **Evidence, never inference.** Every claim about reference behaviour traces to something observed. An
  upstream library says where to look, never what the answer is.
- **A tool that cannot decide says so.** No plausible defaults for a judgement field.
- **Every accepted difference carries its reason,** in the tool, not in someone's memory.
- **Fix causes in the generator.** A workaround in an element hides the defect from every other element.
- **Write the decision down the same turn it is made.** A decision that lives only in conversation is
  lost at the next context reset.
- **Report what was not checked.** An unverified item named is shared risk; unnamed, it is a surprise.

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

Checked 2026-09-19. Peter chose to use the pack throughout the remaining pass, with the existing decisions and approval steps preserved. See [the decision](../decisions/agent-skills-workflow.md).

### Installation and evidence

- Official site: <https://skills.addy.ie/>. The site advertises 24 skills; the installed repository contains 25 `SKILL.md` files. Use the installed count.
- Official Codex guide: <https://github.com/addyosmani/agent-skills/blob/c004a74784a08295d52749b04cda634125b9a581/docs/codex-setup.md>. It specifies native marketplace registration and plugin installation, and direct skill invocation in Codex. Its Claude Code slash commands and personas are not the Codex integration.
- The repository README warns that individual skill copies omit the repository-level shared references. The native plugin preserves these paths, so it was used instead of separate skill copies.
- Commands run: `codex plugin marketplace add addyosmani/agent-skills`, then `codex plugin add agent-skills@agent-skills --json`.
- Verification: `codex plugin list --marketplace agent-skills --json` reports `installed: true`, `enabled: true`, version `0.6.10`. The cache contains 25 skills and all seven shared reference files.
- Installed root: `/Users/peterkloss/.codex/plugins/cache/agent-skills/agent-skills/0.6.10`. Marketplace commit: `c004a74784a08295d52749b04cda634125b9a581`.
- Availability is verified on disk and in CLI state. Automatic discovery in a subsequent app turn is not yet verified; the upstream Codex guide advises a new session if discovery has not refreshed. Skills can be read directly from the installed root in this task.

### Applying the pack to our existing documents

The following skill bodies were read in full from the installed version: `spec-driven-development`, `source-driven-development`, `api-and-interface-design`, `planning-and-task-breakdown`, and `incremental-implementation`.

- **Goals and element specifications:** use the clarification and acceptance-criteria checks from `spec-driven-development`. Keep the pass README and the planned inventory as our documents. That skill explicitly supports existing specification formats at lines 150–154; a second root specification would duplicate our record.
- **Research and interface design:** use `source-driven-development` to check installed versions and official documentation, and `api-and-interface-design` to describe contracts before implementing them. Apply the web-component conventions selected by this pass; its REST naming examples are not Lit rules.
- **Migration planning:** use `planning-and-task-breakdown` for dependencies, small tasks, and explicit verification. Record them in `notes/alignment/migration-plan.md`, as Phase 5 requires, rather than creating a competing `tasks/plan.md` and `tasks/todo.md`.
- **Implementation:** use `incremental-implementation` after migration approval. One logical change includes the necessary source, map, generated output, documentation, and tests. The rough file-count guidance must not split a replacement into an incomplete interface change.
- **Testing and review:** the installed pack includes `test-driven-development`, `browser-testing-with-devtools`, `performance-optimization`, and `code-review-and-quality`. Read their full instructions when that stage begins; those workflows have not been executed in this installation turn.

### Defaults that project instructions override

- `api-and-interface-design/SKILL.md:125` prefers additive, backward-compatible changes. This package has no other consumers and replaces old interfaces outright. Peter reaffirmed that code, JSDoc, README and consumer docs describe the current design only; replacement history belongs in notes and Git. No aliases, fallback implementations, deprecated exports or legacy modes. Migration skills must not introduce compatibility stages into the final package.
- `api-and-interface-design/SKILL.md:146` gives REST-oriented naming examples, including boolean prefixes and uppercase enum values. Naming here follows Lit practice, the domain model, and Peter's approved conventions.
- `incremental-implementation/SKILL.md:41` commits after every slice. `PLAN.md:159` requires Peter to ask before a commit. Verification can finish while the changes remain uncommitted.
- `spec-driven-development/SKILL.md:182` defaults to `tasks/` output. The pass already assigns its specification and migration records to `notes/alignment/`; retain those paths.
- Generic examples do not change the mandated package stack, the generator's ownership of CSS, test locations, or the required build sequence. Evidence about the reference stays in notes and tooling, not in `src/` comments.

No project build or runtime behaviour changed during installation. After installation, Peter separately confirmed the existing pass scope. Its seven principles are recorded, and the later walkthrough selected the [shadow-role mapping](../decisions/floating-surface-shadows.md). Plugin adoption itself did not approve element interfaces or implementation.

## Phase 1 extension checkpoint

Historical checkpoint: the current status is in the [pass handoff](../alignment/README.md#where-we-are). The paragraph below records the earlier capture.

At this historical capture, Peter had expanded the pass and Phase 2 was still underway. That phase has since closed; use the [central handoff](../alignment/README.md#where-we-are) for current work. The [extension register](../alignment/additional-functionality-review.md) preserves completed research and acceptance obligations. The seven-phase lifecycle and source freeze remain intact.

The records-only capture saves decisions made while Plan mode prevented file writes. Accepted directions and initial research are separate. Future capture turns must propagate changed decisions into the handoff and existing subject analyses, rather than create a second file on the same subject.

## Evidence and implementation quality reaffirmation

Reaffirmed 2026-09-19 by Peter. [Standing decision](../decisions/evidence-and-implementation-quality.md), [retrospective audit](../alignment/phase-3-review.md#evidence-audit). The existing rules were already clear; the correction is to apply them before a recommendation is put forward.

Every consequential recommendation needs current code evidence, relevant official/reference practice and tests appropriate to the claim. State observed facts, limited feasibility results, comparative reasoning and unknowns separately. Investigate missing facts; do not invent assumptions to make a proposal appear complete. Community preference requires a stated survey and its limits, not a handful of names presented as consensus.

Choose the best implementation for the agreed requirements: correctness, accessibility, maintainability, testability, performance and integration fit. Fastest, easiest, familiar, convenient, fewer lines and fewer files do not decide the outcome. Reuse research and parallelize independent work to improve pace without lowering this bar.

When a previously suggested or selected direction lacks adequate comparative support, preserve the choice history, record the evidence gap and reevaluate the mechanism. Bring a concrete revision to Peter if new evidence changes the recommendation. A user-approved direction, documented framework pattern or passing simulated-DOM probe is not a completed browser implementation.

At the initial audit, CSS-first remained unselected and state integration had only a six-case happy-dom probe. Subsequently Peter selected the compiled-CSS direction after comparison. The actual existing state helper and a focused scratch refinement have now been checked, alongside native-form timing. The [architecture closeout](../alignment/phase-3-review.md#phase-3-closure) assigns remaining interface decisions and implementation checks to their return points. This is not blanket revalidation or completed implementation certification.

## Keeping the record synchronized

Peter explicitly reaffirmed that every affected note must stay current. A capture updates the owning decision, living analysis, inventory, active handoff and any other note that presents the changed choice as current or still open. Search the full notes set for older names, contrary scope and stale phase/next-step wording; updating only the newest paragraph is insufficient.

Keep current phase and next-step information in the central pass handoff. Completed reviews link there instead of repeating a phase number that will drift. Preserve dated measurements and superseded decision history, but label them and link their replacements so they cannot be read as active instructions. Check local file/heading links, evidence JSON and source fingerprints after the capture. This process does not turn draft interfaces into approvals or unverified evidence into passing tests.

## Component-level progress correction

Peter approved a workflow correction on 2026-09-20 after the foundation investigation expanded into repeated small decisions and probes without completing inventory entries. The evidence remains useful; the problem was unbounded sequencing and progress reporting that foregrounded activity instead of completed contracts.

Use the [remaining-work queue](../alignment/remaining-work.md) to assemble complete family proposals from existing selections, record their dependencies and assign engineering checks to their actual gates. The agent resolves ordinary implementation details and investigates facts. User questions concern consequential unresolved authoring/behavior choices within the full proposal. A new technical finding can block the affected interface, but does not automatically suspend preparation of unrelated proposals.

The first delivery is the shared-rule/layout proposal, grounded in the existing Group, Box, Stack and Simple Grid drafts and the related control compatibility evidence. Do not resume with another isolated helper-detail question. Report proposals ready for review, entries approved, groups remaining and material blockers; retain test/link/fingerprint results as supporting evidence. All source freezes, reference-review requirements and Phase 4/5 approval gates remain. [Decision](../decisions/agent-skills-workflow.md#complete-component-proposals-and-visible-progress), [coverage](../alignment/evidence/remaining-work-consolidation-2026-09-20.json).

Peter subsequently required the [entire Phase 4 proposal set before further questions](../decisions/agent-skills-workflow.md#assemble-the-whole-proposal-set-before-the-next-decision-walk). The first layout delivery is completed preparation, not the stopping pattern to repeat. Assemble all remaining groups, reconcile their dependencies and collect genuine choices for one subsequent decision walkthrough. The [established-reference rule](../decisions/reference-systems.md#follow-the-established-reference-without-another-preference-question) resolves source-defined details without individual preference votes. No production source or migration approval is implied.

That assembly now covers all thirteen groups through the [complete proposal index](../alignment/inventory.md#complete-proposal-set). The [coverage map](../alignment/proposal-coverage.md) accounts for all 150 source tags and thirty extension records, and the [five-question register](../alignment/proposal-questions.md) separates user choices from retired source lookups/engineering details. Continue from that register and the named evidence gates rather than resume the earlier one-family-at-a-time draft loop. No complete entry or migration is marked approved by this assembly.

### Whole-set approval and Phase 5 handoff

On 2026-09-20 Peter said “I approve all proposals.” The [approval record](../decisions/inventory-approval.md) selects the complete set and the five stated recommendations. Earlier proposal/unselected statements above retain their historical evidence scope; current design status is approved. Peter subsequently [approved the migration plan](../decisions/migration-approval.md) through “approved”. M00 technical prerequisites remain active before dependent implementation. Production implementation has not started; approval is not a runtime result.

## Maintainer workflow migration 2026-10-21

Peter now requests the agent-skills/brain workflow used in the CLI and D&D projects. He clarifies three requirements: complete migration to the new layout and formats, deletion of all five local skills, and removal or rewriting of rules that conflict with the new workflow. [Decision](../decisions/maintainer-workflow-migration.md), [approved specification](../../spec/SPEC-maintainer-workflow.md), [observations and inventory](../alignment/evidence/workflow-migration-2026-10-21.json).

### What creates the continuity in the reference projects

Read the supplied D&D kickoff prompt in full. Read both projects' AGENTS.md, CLAUDE.md, README.md, CONTEXT.md, docs/STATUS.md, all three docs/agents files and project plugin settings in full. The CLI capability index and completed github-ops plan/task list were also read in full.

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

Use the new docs/, spec/ and tasks/ structure, not a permanent index over notes/. Convert decisions to numbered records and research to numbered notes with an index. Move current contracts to specifications, completed plans to tasks/done, releases to docs/releases, raw evidence to docs/verification, and completed prose history to docs/history.

Retain raw evidence bytes. Rewrite prose into the new format without inventing decisions or removing qualifications. Retired process rules survive in Git, not as alternative instructions in the active docs. Keep immutable historical payloads distinct from live references.

Remove all five .agents skills. Brain's domain-modeling, codebase-design, interview-me/specification and wait-what skills cover their corresponding roles. The old improve-codebase-architecture procedure has no same-named brain skill in the inspected catalog; its useful architecture/review responsibilities route through brain's codebase-design and review skills. Its bespoke HTML-report/grilling procedure is not automatically carried forward as a requirement.

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
