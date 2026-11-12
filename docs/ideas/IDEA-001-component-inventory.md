---
id: IDEA-001
status: define # define | specced | done | parked
result: # with status: done, the DEC-NNN or the commit SHA this idea produced
---
# IDEA-001: Component inventory for 1.0

## Intent
- Outcome: a final 1.0 component list, with one name and one part composition for each component, and a decision record for each final choice.
- User: Peter decides. IDEA-002 to IDEA-006 build on the result, and so do the designers and developers who use 1.0.
- Why now: the 0.3.3 component set does not make enough sense, and 1.0 replaces it with no compatibility duty.
- Success: the comparison matrix is in the repo with sources and no opinions; every component concept in it is in or out; every included component has a name and its parts.
- Constraint: research returns facts, sources and disagreements only. It gives no recommendation unless Peter asks.
- Out of scope: design specs (IDEA-002), the Lit core (IDEA-003), framework packages (IDEA-004), MCP and skills (IDEA-005) and devtools (IDEA-006).

<!-- After the user's explicit yes to this intent, add the line: Confirmed by <name> on <YYYY-MM-DD>. -->

## Destination
A decision: the 1.0 component inventory. One inventory record lists each included component with its name and parts, and links the decision record for each choice. The comparison matrix stays in the repo as its evidence.

## Notes

### Program rules for all six ideas
Source: [Peter's kickoff prompt](../design/v1-kickoff-prompt.md) of 2026-11-12. IDEA-002 to IDEA-006 link to this section.

- Target: version 1.0.0. The current release is 0.3.3 across five packages.
- 1.0 is a full replacement. Nobody uses the package yet, so nothing needs backwards compatibility. Nothing from 0.3.3 survives in code unless a decision record keeps it.
- Branch: `v1`. On Peter's machine its worktree is `/Users/peterkloss/Dev/ACMElabs/design-system-v1`. All work for 1.0 happens there. `main` stays as it is until the merge.
- Every decision is the best one for the product, not the easiest or the fastest.
- Each session loads brain's ask-user-question, domain-modeling, context-engineering and the skill for the current phase. It proves the design system MCP with one real read-only call.
- Questions: one at a time, most important first, and only for real decisions. The agent makes cheap, reversible choices and states them in chat. Research settles facts.
- After every answer the agent evaluates the whole map, saves it, and tells Peter in one or two lines what changed.
- Research starts only for the row in front of us, or for a big unknown that shapes the map. It gives no recommendation unless Peter asks. Its output goes to files with sources and dates.
- Landscape sweeps use `deep-research`, the built-in workflow of Claude Code that `/deep-research` starts: IDEA-001#01, IDEA-004#01, IDEA-005#01 and IDEA-006#01. Narrow questions use brain research records.
- The model and effort for delegated research agents are in [the capabilities file](../agents/capabilities.md#sub-agents).
- The 0.3.3 decision and research records are evidence for a question. They do not answer it.
- A question that belongs to a later idea goes into that idea's map as an open row.

### Working state for all six ideas
Carried over from `docs/STATUS.md` on 2026-11-12, when the workspace moved to brain's layout 2. The ideas and their records now hold the state; `brain status` reports it.

- Checks of the 0.3.3 code: none has run on `v1` since the migration moved the records. `scripts/workflow-migration.ts` and its test still name the old layout, because they verify the completed maintainer migration. Run the unit suite before the first product change on `v1`, then repair or retire that verifier.
- Links: `docs/verification/` and `docs/agents/history/` keep their bytes, so 3 links in `docs/verification/` and 7 in the retired status note still name old paths. The note's link to the kickoff prompt is the one exception: it points to the corrected prompt, on Peter's instruction of 2026-11-12.

- Authorization: the kickoff prompt authorizes commits and pushes of this work on `v1`. It authorizes no merge, release or publication.
- Baseline: `v1` starts at ee37be98e, the tip of `main` on 2026-11-12, where the quality run passes. No product check has run on `v1`; the branch changes records only so far.
- Runtime: the repo requires Bun 1.4.2. The `v1` worktree has no local runtime yet. On Peter's machine the verified executable is `/Users/peterkloss/Dev/ACMElabs/design-system/.artifacts/runtime/bun-1.4.2/bun-darwin-aarch64/bun`.
- MCP proof: the 0.3.3 design system MCP answers `resolve_version` and `search_docs` over stdio (2026-11-12, from the built package in the `main` checkout).
- Capability gaps: no skill named Anthropic's deep research skill is installed; no Figma MCP is connected; the folder `.agents/skills/` does not exist. The seven consumer skills are in `skills/`.
- Other sessions: the branches `claude/ci-speed` and `claude/issue-12-strict-style-policy` have their own worktrees, and the `main` checkout holds uncommitted files. They change the system that 1.0 replaces. Leave them as they are.
- The open maintenance issues of 0.3.3 stay in the local tracker, `.scratch/maintenance/issues/`.

### Row 03 — pending question
- Asked on 2026-11-12: who is 1.0 for, and what do they build with it? Options put to Peter, which can combine: ACME Labs' own applications; AI-written artifacts and prototypes; other teams, as a public design system; marketing and content sites. The evidence favours no option.

### Waits
- Decision records: the prompt's own decisions (full replacement, branch, no compatibility) have no DEC files yet. The same holds for Peter's setup decisions of 2026-11-12: the kickoff prompt lives in `docs/design/`, the glossary takes the GLOSSARY names, every legacy record moves to layout 2, the tracker files are removed, and `docs/agents/workflow.md` gives way to the workspace file. The workspace is on layout 2 since 2026-11-12, so `brain new-doc DEC` now gives DEC-117 and later. The first decision record is DEC-117 (IDEA-002#02). Next: create the records for the prompt's decisions and the setup decisions.
- Row 01 — wait: Peter's go for the four sweeps. The tool is settled: on 2026-11-12 Peter pointed to `/deep-research`, which is Claude Code's built-in `deep-research` workflow, not a skill. One run fetches at most 15 sources, so the matrix takes one run for each of the five columns. Before the first run, check whether the workflow lets the caller set the model of its agents, for Peter's Opus 5.5 preference. Anthropic's skill of the same name sits in the skills trash since 2026-11-05.

### Settled by the prompt
- The matrix has five columns: shadcn/ui, Radix Primitives, Radix Themes, Chakra UI and Vercel's Geist.
- For each component concept the matrix records which systems have it, what they call it, how they split it into parts, and where they disagree.
- The final list, names and compositions come from an interview after the research. Each final choice gets a decision record.

### Agent choices
- The matrix lives under `docs/research/`, one table per component category, with the version of each system and the access date.
- Rows 07 to 09 are decided by rule first (rows 03 to 06). Peter is then asked only about the exceptions.

## Map

| # | Question | Type | Status | Blocked by | Result |
|---|---|---|---|---|---|
| 01 | Which component concepts do shadcn/ui, Radix Primitives, Radix Themes, Chakra UI and Geist have, what does each system call them, how does each split them into parts, and where do they disagree? | research | open | — | — |
| 02 | Which components, parts and recipes does release 0.3.3 ship, and which decision records chose their names? | research | open | — | — |
| 03 | Which products and users does 1.0 serve, and what does that rule in or out of the list? | interview | open | — | — |
| 04 | Can the list hold a component concept that none of the five reference columns has? | interview | open | 02, 03 | — |
| 05 | When the reference systems disagree on a name, which rule picks the 1.0 name? | interview | open | 01 | — |
| 06 | Which words name the pieces of a component (part, subcomponent, slot), and which shared part names apply across components? | interview | open | 01 | — |
| 07 | Which component concepts from the matrix are in the 1.0 list? | interview | open | 01, 03, 04 | — |
| 08 | What is the final name of each included component? | interview | open | 05, 07 | — |
| 09 | What is the final part composition of each included component? | interview | open | 06, 07 | — |

## Not yet specified
- The per-category rows for rows 07 to 09. The matrix sets the categories.
- Whether recipes and icons need their own inventory decisions.
- Which 0.3.3 glossary terms stay. The glossary has no word yet for the pieces of a component.

## Out of scope
- Design specs: anatomy, variants, named sizes, states, tokens, accessibility behaviour and motion. IDEA-002 owns them.
- How a part becomes a Lit element or a slot. IDEA-003 owns it.
- Framework packages (IDEA-004), MCP and skills (IDEA-005) and devtools (IDEA-006).
- Reference systems beyond the five columns. The prompt fixes the set.
