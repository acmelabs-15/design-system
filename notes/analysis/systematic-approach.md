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

- `api-and-interface-design/SKILL.md:125` prefers additive, backward-compatible changes. This package has no consumers and replaces old interfaces outright. Keep that project decision.
- `api-and-interface-design/SKILL.md:146` gives REST-oriented naming examples, including boolean prefixes and uppercase enum values. Naming here follows Lit practice, the domain model, and Peter's approved conventions.
- `incremental-implementation/SKILL.md:41` commits after every slice. `PLAN.md:159` requires Peter to ask before a commit. Verification can finish while the changes remain uncommitted.
- `spec-driven-development/SKILL.md:182` defaults to `tasks/` output. The pass already assigns its specification and migration records to `notes/alignment/`; retain those paths.
- Generic examples do not change the mandated package stack, the generator's ownership of CSS, test locations, or the required build sequence. Evidence about the reference stays in notes and tooling, not in `src/` comments.

No project build or runtime behaviour changed during installation. After installation, Peter separately confirmed the existing pass scope. Its seven principles are recorded, and the later walkthrough selected the [shadow-role mapping](../decisions/floating-surface-shadows.md). Plugin adoption itself did not approve element interfaces or implementation.

## Phase 1 extension checkpoint

Peter expanded the pass after the original nine-subject walkthrough. The [extension register](../alignment/additional-functionality-review.md) preserves the completed research, decisions and later acceptance obligations. The current checkpoint is Phase 2.3: Stat is next, with detailed Toolbar composition returning during Group review. Follow the [pass handoff](../alignment/README.md#where-we-are). The seven-phase lifecycle and source freeze remain intact; the extension is not a restart or implementation approval.

The records-only capture saves decisions made while Plan mode prevented file writes. Accepted directions and initial research are separate. Future capture turns must propagate changed decisions into the handoff and existing subject analyses, rather than create a second file on the same subject.
